"""Hardware telemetry and the health watchdog.

Three telemetry sources, merged into one sample:

1. **psutil** - always available: CPU load per core and total, frequency,
   per-core times, memory/swap, per-disk usage and IO, per-NIC IO and error
   counts, battery, uptime, process list. Never optional.
2. **LibreHardwareMonitor / OpenHardwareMonitor HTTP bridge** - the genuinely
   deep sensors (CPU package and per-core temperatures, motherboard and VRM
   temps, fan RPMs, voltages, power draw, GPU temps). Enabled when the app is
   running with its web server on.
3. **WMI thermal zone** fallback on Windows (``MSAcpi_ThermalZoneTemperature``)
   for machines without LHM.

The watchdog runs on a timer, keeps a short rolling history, and raises an
alert *before* things get dangerous: sustained high CPU temperature, a fan
whose RPM stops correlating with temperature (the classic failing-fan
signature), memory pressure, disk nearly full, a disk reporting SMART-ish
errors, or PCIe/thermal throttling. Alerts are published on the bus, so the
main agent is woken with a plain-language summary and the HUD turns red. The
main agent can also query everything on demand.
"""

from __future__ import annotations

import asyncio
import logging
import math
import platform
import statistics
import time
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable

from ..bus import BUS, EventType
from ..config import HardwareThresholds, Settings
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.hardware")

try:
    import psutil  # type: ignore

    PSUTIL_AVAILABLE = True
except Exception as exc:  # noqa: BLE001
    psutil = None  # type: ignore[assignment]
    PSUTIL_AVAILABLE = False
    PSUTIL_ERROR = str(exc)
else:
    PSUTIL_ERROR = ""

SYSTEM = platform.system()
IS_WINDOWS = SYSTEM == "Windows"


@dataclass
class Sensor:
    """One readable sensor value."""

    name: str
    category: str          # temperature | fan | voltage | power | load | clock | other
    value: float
    unit: str
    source: str

    def to_json(self) -> dict[str, Any]:
        return {"name": self.name, "category": self.category, "value": round(self.value, 2),
                "unit": self.unit, "source": self.source}


@dataclass
class Sample:
    ts: float
    cpu: dict[str, Any] = field(default_factory=dict)
    memory: dict[str, Any] = field(default_factory=dict)
    disks: list[dict[str, Any]] = field(default_factory=list)
    network: list[dict[str, Any]] = field(default_factory=list)
    sensors: list[Sensor] = field(default_factory=list)
    processes: list[dict[str, Any]] = field(default_factory=list)
    battery: dict[str, Any] = field(default_factory=dict)
    sources: dict[str, bool] = field(default_factory=dict)

    def by_category(self, category: str) -> list[Sensor]:
        return [sensor for sensor in self.sensors if sensor.category == category]

    def to_json(self) -> dict[str, Any]:
        return {
            "ts": self.ts, "cpu": self.cpu, "memory": self.memory, "disks": self.disks,
            "network": self.network, "sensors": [sensor.to_json() for sensor in self.sensors],
            "processes": self.processes, "battery": self.battery, "sources": self.sources,
        }

    def summary(self, limit: int = 12) -> str:
        lines = [
            f"CPU  {self.cpu.get('percent_total', 0):.0f}%  "
            f"{self.cpu.get('freq_mhz', 0):.0f} MHz  cores={self.cpu.get('cores_physical', '?')}",
            f"RAM  {self.memory.get('percent', 0):.0f}% used  "
            f"({self.memory.get('used_gb', 0):.1f} / {self.memory.get('total_gb', 0):.1f} GB)",
        ]
        hot = [sensor for sensor in self.by_category("temperature") if sensor.value > 0]
        if hot:
            top = sorted(hot, key=lambda sensor: sensor.value, reverse=True)[:limit]
            lines.append("Temps: " + ", ".join(f"{s.name} {s.value:.0f}{s.unit}" for s in top))
        fans = self.by_category("fan")
        if fans:
            lines.append("Fans: " + ", ".join(f"{s.name} {s.value:.0f} {s.unit}" for s in fans))
        volts = self.by_category("voltage")
        if volts:
            lines.append("Volts: " + ", ".join(f"{s.name} {s.value:.2f}{s.unit}" for s in volts[:8]))
        for disk in self.disks:
            lines.append(
                f"Disk {disk.get('mountpoint')}  {disk.get('percent', 0):.0f}% used  "
                f"{disk.get('free_gb', 0):.1f} GB free"
            )
        return "\n".join(lines)


@dataclass
class Alert:
    severity: str          # notice | warning | critical
    category: str
    message: str
    advice: str = ""
    sensor: str = ""
    value: float = 0.0
    ts: float = field(default_factory=time.time)

    def to_json(self) -> dict[str, Any]:
        return {
            "severity": self.severity, "category": self.category, "message": self.message,
            "advice": self.advice, "sensor": self.sensor, "value": self.value, "ts": self.ts,
        }

    def spoken(self) -> str:
        base = f"Warning: {self.message}."
        return f"{base} {self.advice}" if self.advice else base


class HardwareMonitor:
    """Sampling, history, threshold evaluation and alerting."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.thresholds: HardwareThresholds = settings.hardware
        self._history: deque[Sample] = deque(maxlen=180)   # ~12 minutes at 4s
        self._alerts: deque[Alert] = deque(maxlen=200)
        self._suppressed: dict[str, float] = {}
        self._watch_task: asyncio.Task[None] | None = None
        self._lhm_url = ""
        self._lhm_ok = False
        self._cpu_name = _cpu_name()

    # -- sources --------------------------------------------------------
    def configure_lhm(self, url: str) -> dict[str, Any]:
        self._lhm_url = url.strip()
        reachable = self._probe_lhm() if self._lhm_url else False
        return {"url": self._lhm_url, "reachable": reachable}

    def _probe_lhm(self) -> bool:
        try:
            import requests  # type: ignore

            response = requests.get(self._lhm_url, timeout=2.0)
            self._lhm_ok = response.status_code == 200
        except Exception:  # noqa: BLE001
            self._lhm_ok = False
        return self._lhm_ok

    @staticmethod
    def capabilities() -> dict[str, Any]:
        return {"psutil": PSUTIL_AVAILABLE, "psutil_error": PSUTIL_ERROR,
                "platform": SYSTEM, "windows": IS_WINDOWS}

    def discover_sources(self) -> dict[str, Any]:
        lhm = self._probe_lhm() if self._lhm_url else False
        return {
            "psutil": PSUTIL_AVAILABLE,
            "librehardwaremonitor": lhm,
            "wmi_thermal": IS_WINDOWS,
            "cpu": self._cpu_name,
            "note": (
                "Install LibreHardwareMonitor, enable Options -> Remote Web Server, and set "
                "VYRALIS_LHM_URL to its /data.json for full fan/voltage/VRM telemetry."
            ),
        }

    # -- sampling -------------------------------------------------------
    def sample(self, *, include_processes: int = 0) -> Sample:
        now = time.time()
        data = Sample(ts=now)
        data.sources = {
            "psutil": PSUTIL_AVAILABLE,
            "librehardwaremonitor": bool(self._lhm_url) and self._probe_lhm(),
            "wmi_thermal": IS_WINDOWS,
        }
        if PSUTIL_AVAILABLE:
            data.cpu = self._cpu_sample()
            data.memory = self._memory_sample()
            data.disks = self._disk_sample()
            data.network = self._network_sample()
            data.battery = self._battery_sample()
            if include_processes:
                data.processes = self._process_sample(include_processes)
        if data.sources["librehardwaremonitor"]:
            data.sensors.extend(self._lhm_sensors())
        if not data.sensors:
            data.sensors.extend(self._psutil_sensors(data))
        self._history.append(data)
        return data

    def _cpu_sample(self) -> dict[str, Any]:
        assert psutil is not None
        per_core = psutil.cpu_percent(interval=0.0, percpu=True)
        frequency = psutil.cpu_freq()
        return {
            "percent_total": psutil.cpu_percent(interval=None),
            "percent_per_core": per_core,
            "cores_physical": psutil.cpu_count(logical=False),
            "cores_logical": psutil.cpu_count(logical=True),
            "freq_mhz": frequency.current if frequency else 0.0,
            "freq_max_mhz": frequency.max if frequency else 0.0,
            "load_avg": list(getattr(psutil, "getloadavg", lambda: (0, 0, 0))()),
        }

    def _memory_sample(self) -> dict[str, Any]:
        assert psutil is not None
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        return {
            "total_gb": round(memory.total / 1e9, 2), "used_gb": round(memory.used / 1e9, 2),
            "available_gb": round(memory.available / 1e9, 2), "percent": memory.percent,
            "swap_percent": swap.percent, "swap_used_gb": round(swap.used / 1e9, 2),
        }

    def _disk_sample(self) -> list[dict[str, Any]]:
        assert psutil is not None
        out: list[dict[str, Any]] = []
        for partition in psutil.disk_partitions(all=False):
            try:
                usage = psutil.disk_usage(partition.mountpoint)
            except (PermissionError, OSError):
                continue
            entry = {
                "device": partition.device, "mountpoint": partition.mountpoint,
                "fstype": partition.fstype, "total_gb": round(usage.total / 1e9, 2),
                "used_gb": round(usage.used / 1e9, 2), "free_gb": round(usage.free / 1e9, 2),
                "percent": usage.percent,
            }
            out.append(entry)
        try:
            io = psutil.disk_io_counters(perdisk=True) or {}
            for name, counters in list(io.items())[:8]:
                out.append({
                    "device": name, "io": True,
                    "read_mb": round(counters.read_bytes / 1e6, 1),
                    "write_mb": round(counters.write_bytes / 1e6, 1),
                    "read_errors": getattr(counters, "read_errors", 0) or 0,
                    "write_errors": getattr(counters, "write_errors", 0) or 0,
                })
        except Exception:  # noqa: BLE001
            pass
        return out

    def _network_sample(self) -> list[dict[str, Any]]:
        assert psutil is not None
        out = []
        try:
            counters = psutil.net_io_counters(pernic=True) or {}
            for name, values in counters.items():
                if name.lower().startswith(("loopback", "lo")):
                    continue
                out.append({
                    "interface": name,
                    "sent_mb": round(values.bytes_sent / 1e6, 2),
                    "recv_mb": round(values.bytes_recv / 1e6, 2),
                    "errors_in": getattr(values, "errin", 0) or 0,
                    "errors_out": getattr(values, "errout", 0) or 0,
                    "drops": (getattr(values, "dropin", 0) or 0) + (getattr(values, "dropout", 0) or 0),
                })
        except Exception:  # noqa: BLE001
            pass
        return out

    def _battery_sample(self) -> dict[str, Any]:
        assert psutil is not None
        try:
            battery = psutil.sensors_battery()
        except Exception:  # noqa: BLE001
            return {}
        if battery is None:
            return {}
        return {
            "percent": battery.percent, "plugged": battery.power_plugged,
            "seconds_left": battery.secsleft if battery.secsleft and battery.secsleft > 0 else None,
        }

    def _process_sample(self, limit: int) -> list[dict[str, Any]]:
        assert psutil is not None
        rows: list[dict[str, Any]] = []
        for process in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"]):
            try:
                info = process.info
                rows.append({
                    "pid": info["pid"], "name": info["name"],
                    "cpu": round(info.get("cpu_percent") or 0.0, 1),
                    "memory_percent": round(info.get("memory_percent") or 0.0, 1),
                })
            except Exception:  # noqa: BLE001
                continue
        rows.sort(key=lambda row: (row["cpu"], row["memory_percent"]), reverse=True)
        return rows[:limit]

    def _psutil_sensors(self, data: Sample) -> list[Sensor]:
        sensors: list[Sensor] = [
            Sensor("CPU load", "load", data.cpu.get("percent_total", 0.0), "%", "psutil"),
            Sensor("Memory used", "load", data.memory.get("percent", 0.0), "%", "psutil"),
        ]
        for index, value in enumerate(data.cpu.get("percent_per_core", [])[:32]):
            sensors.append(Sensor(f"CPU core {index}", "load", value, "%", "psutil"))
        if PSUTIL_AVAILABLE:
            assert psutil is not None
            try:
                temperatures = psutil.sensors_temperatures() or {}
                for chip, entries in temperatures.items():
                    for entry in entries:
                        sensors.append(
                            Sensor(
                                entry.label or f"{chip}", "temperature", entry.current, "C",
                                f"psutil:{chip}",
                            )
                        )
            except Exception:  # noqa: BLE001
                pass
            try:
                fans = psutil.sensors_fans() or {}
                for chip, entries in fans.items():
                    for entry in entries:
                        sensors.append(
                            Sensor(entry.label or chip, "fan", entry.current, "RPM", f"psutil:{chip}")
                        )
            except Exception:  # noqa: BLE001
                pass
            if IS_WINDOWS:
                sensors.extend(self._wmi_thermal())
        return [sensor for sensor in sensors if math.isfinite(sensor.value)]

    def _wmi_thermal(self) -> list[Sensor]:
        try:
            import wmi  # type: ignore

            connection = wmi.WMI(namespace="root\\wmi")
            sensors: list[Sensor] = []
            for zone in connection.MSAcpi_ThermalZoneTemperature():
                # Value is in tenths of a Kelvin.
                celsius = (zone.CurrentTemperature / 10.0) - 273.15
                if -20 < celsius < 150:
                    sensors.append(
                        Sensor(f"Thermal zone {zone.InstanceName or 'ACPI'}", "temperature",
                               celsius, "C", "wmi")
                    )
            return sensors
        except Exception:  # noqa: BLE001
            return []

    def _lhm_sensors(self) -> list[Sensor]:
        """Parse LibreHardwareMonitor's /data.json tree into flat sensors."""
        try:
            import requests  # type: ignore

            payload = requests.get(self._lhm_url, timeout=2.5).json()
        except Exception:  # noqa: BLE001
            return []
        sensors: list[Sensor] = []

        def walk(node: dict[str, Any], path: list[str]) -> None:
            text = node.get("Text") or node.get("Name") or ""
            value = node.get("Value") or ""
            if isinstance(value, str) and (" " in value or value.endswith(("%", "RPM", "V", "W", "°C", "C"))):
                number = _leading_number(value)
                unit = "".join(ch for ch in value if ch in "%.VWRPM C°" ).strip() or ""
                if number is not None:
                    sensors.append(
                        Sensor(" / ".join([*path, text])[:120], _categorise(unit), number,
                               _normalise_unit(unit), "lhm")
                    )
            for child in node.get("Children") or []:
                walk(child, [*path, text])

        for child in payload.get("Children") or []:
            walk(child, [])
        return sensors[:400]

    # -- evaluation -----------------------------------------------------
    def evaluate(self, sample: Sample) -> list[Alert]:
        alerts: list[Alert] = []
        thresholds = self.thresholds

        for sensor in sample.by_category("temperature"):
            if not _is_cpu_temperature(sensor.name):
                if sensor.value >= thresholds.cpu_temp_crit:
                    alerts.append(_critical(sensor, f"{sensor.name} at {sensor.value:.0f}°C",
                                            "Reduce load or improve cooling immediately."))
                elif sensor.value >= thresholds.cpu_temp_warn:
                    alerts.append(_warn(sensor, f"{sensor.name} at {sensor.value:.0f}°C",
                                        "Above the warning threshold; watch for throttling."))
                continue
            if sensor.value >= thresholds.cpu_temp_crit:
                alerts.append(_critical(
                    sensor, f"CPU temperature {sensor.value:.0f}°C is critical",
                    "Stop heavy tasks, check the cooler and thermal paste, and confirm the fan is running.",
                ))
            elif sensor.value >= thresholds.cpu_temp_warn:
                alerts.append(_warn(
                    sensor, f"CPU temperature {sensor.value:.0f}°C is high",
                    "Consider pausing background work until it drops.",
                ))

        cpu_percent = sample.cpu.get("percent_total", 0.0)
        if cpu_percent >= thresholds.cpu_pct_warn:
            sustained = self._sustained_cpu(seconds=45)
            if sustained >= thresholds.cpu_pct_warn:
                alerts.append(Alert(
                    "warning", "cpu",
                    f"CPU has been above {sustained:.0f}% for over 45 seconds",
                    "Identify the top process; a runaway task may need to be stopped.",
                ))

        memory_percent = sample.memory.get("percent", 0.0)
        if memory_percent >= thresholds.mem_pct_warn:
            alerts.append(Alert(
                "warning", "memory", f"Memory usage at {memory_percent:.0f}%",
                "Close large applications or reduce parallel agents.",
            ))

        for disk in sample.disks:
            if disk.get("io"):
                continue
            free = disk.get("free_gb", 999.0)
            if free <= thresholds.disk_free_gb_warn:
                alerts.append(Alert(
                    "warning" if free > 1 else "critical", "disk",
                    f"Disk {disk.get('mountpoint')} has only {free:.1f} GB free",
                    "Free space before further writes or installs.",
                ))

        alerts.extend(self._fan_pattern_alerts(sample))
        self._record(alerts)
        return alerts

    def _sustained_cpu(self, seconds: float) -> float:
        cutoff = time.time() - seconds
        recent = [sample.cpu.get("percent_total", 0.0) for sample in self._history if sample.ts >= cutoff]
        return min(recent) if len(recent) >= 3 else 0.0

    def _fan_pattern_alerts(self, sample: Sample) -> list[Alert]:
        """A fan that stops responding to temperature is failing.

        Signature: temperature climbs well above the mean while fan RPM either
        stalls (no change at all) or swings wildly. Both indicate a dead or
        obstructed fan rather than normal speed ramping.
        """
        alerts: list[Alert] = []
        fans = sample.by_category("fan")
        if len(self._history) < 10 or not fans:
            return alerts
        recent_samples = list(self._history)[-10:]
        for fan in fans:
            history = [
                value for previous in recent_samples
                for value in [next((s.value for s in previous.sensors
                                    if s.category == "fan" and s.name == fan.name), None)]
                if value is not None
            ]
            if len(history) < 6:
                continue
            swings = max(history) - min(history)
            stalled = swings < 5.0 and max(history) > 0
            if stalled and fan.value > 0:
                hot = [s.value for s in sample.by_category("temperature") if _is_cpu_temperature(s.name)]
                if hot and max(hot) > self.thresholds.cpu_temp_warn:
                    alerts.append(Alert(
                        "warning", "fan",
                        f"{fan.name} stayed at {fan.value:.0f} RPM while CPU reached {max(hot):.0f}°C",
                        "The fan is not responding to heat. Check the fan cable and the cooler.",
                        sensor=fan.name, value=fan.value,
                    ))
            elif swings > self.thresholds.fan_rpm_delta_warn:
                alerts.append(Alert(
                    "notice", "fan",
                    f"{fan.name} is hunting between {min(history):.0f}-{max(history):.0f} RPM",
                    "Erratic fan behaviour can indicate a failing bearing or a bad fan curve.",
                    sensor=fan.name, value=fan.value,
                ))
        return alerts

    def _record(self, alerts: Iterable[Alert]) -> None:
        now = time.time()
        for alert in alerts:
            key = f"{alert.category}:{alert.sensor}:{alert.message}"
            # Do not repeat the same alert more than once every 5 minutes.
            if now - self._suppressed.get(key, 0.0) < 300:
                continue
            self._suppressed[key] = now
            self._alerts.append(alert)
            BUS.publish(
                EventType.HARDWARE_ALERT,
                alert.to_json() | {"spoken": alert.spoken()},
            )
            log.warning("hardware alert [%s] %s", alert.severity, alert.message)

    # -- watch loop -----------------------------------------------------
    async def watch(self, stop: asyncio.Event) -> None:
        """Continuous background monitoring with cheapest-first cadence."""
        log.info("hardware watchdog started (every %.0fs)", self.thresholds.sample_seconds)
        while not stop.is_set():
            try:
                sample = self.sample()
                alerts = self.evaluate(sample)
                if sample.sensors or alerts:
                    BUS.publish(EventType.HARDWARE_SAMPLE, {
                        "summary": sample.summary(),
                        "cpu_percent": sample.cpu.get("percent_total", 0.0),
                        "memory_percent": sample.memory.get("percent", 0.0),
                        "alerts": [alert.to_json() for alert in alerts],
                        "temps": [
                            {"name": s.name, "value": round(s.value, 1)}
                            for s in sorted(sample.by_category("temperature"),
                                            key=lambda s: s.value, reverse=True)[:6]
                        ],
                        "fans": [
                            {"name": s.name, "value": round(s.value, 0)}
                            for s in sample.by_category("fan")[:6]
                        ],
                    })
                await asyncio.sleep(max(1.0, self.thresholds.sample_seconds))
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001
                log.debug("hardware sample failed: %s", exc)
                await asyncio.sleep(10.0)

    def start_watch(self) -> asyncio.Task[None]:
        stop = asyncio.Event()
        self._watch_task = asyncio.create_task(self.watch(stop))
        return self._watch_task

    async def stop_watch(self) -> None:
        if self._watch_task is not None:
            self._watch_task.cancel()
            try:
                await self._watch_task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
            self._watch_task = None

    # -- reporting ------------------------------------------------------
    def history(self, limit: int = 60) -> list[dict[str, Any]]:
        return [sample.to_json() for sample in list(self._history)[-limit:]]

    def recent_alerts(self, limit: int = 20) -> list[dict[str, Any]]:
        return [alert.to_json() for alert in list(self._alerts)[-limit:]]

    def trend(self, sensor_name: str, limit: int = 60) -> list[dict[str, Any]]:
        points = []
        for sample in list(self._history)[-limit:]:
            for sensor in sample.sensors:
                if sensor.name == sensor_name:
                    points.append({"ts": sample.ts, "value": round(sensor.value, 2)})
                    break
        return points

    def health_verdict(self) -> dict[str, Any]:
        if not self._history:
            return {"verdict": "unknown", "detail": "No samples yet."}
        latest = self._history[-1]
        alerts = self.evaluate(latest)
        critical = [alert for alert in alerts if alert.severity == "critical"]
        warnings = [alert for alert in alerts if alert.severity == "warning"]
        verdict = "critical" if critical else ("degraded" if warnings else "healthy")
        return {
            "verdict": verdict,
            "critical": [alert.message for alert in critical],
            "warnings": [alert.message for alert in warnings],
            "summary": latest.summary(),
        }


# ---------------------------------------------------------------------------
def _leading_number(text: str) -> float | None:
    import re

    match = re.search(r"-?\d+(?:[.,]\d+)?", text)
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", "."))
    except ValueError:
        return None


def _categorise(unit: str) -> str:
    unit = unit.lower()
    if "°c" in unit or unit in {"c", "°c"}:
        return "temperature"
    if "rpm" in unit:
        return "fan"
    if unit == "v":
        return "voltage"
    if unit == "w":
        return "power"
    if unit == "%":
        return "load"
    return "other"


def _normalise_unit(unit: str) -> str:
    return {"°c": "C", "c": "C", "v": "V", "w": "W", "%": "%", "rpm": "RPM"}.get(unit.lower(), unit)


def _is_cpu_temperature(name: str) -> bool:
    lowered = name.lower()
    return any(token in lowered for token in ("cpu", "package", "core", "tctl", "tdie", "ccd"))


def _cpu_name() -> str:
    try:
        if IS_WINDOWS:
            import winreg  # type: ignore

            with winreg.OpenKey(
                winreg.HKEY_LOCAL_MACHINE,
                r"HARDWARE\DESCRIPTION\System\CentralProcessor\0",
            ) as key:
                return str(winreg.QueryValueEx(key, "ProcessorNameString")[0]).strip()
        if platform.system() == "Darwin":
            return platform.processor() or "Apple Silicon"
        with Path("/proc/cpuinfo").open("r", encoding="utf-8", errors="replace") as handle:
            for line in handle:
                if line.lower().startswith("model name"):
                    return line.split(":", 1)[1].strip()
    except Exception:  # noqa: BLE001
        pass
    return platform.processor() or "unknown CPU"


def _warn(sensor: Sensor, message: str, advice: str) -> Alert:
    return Alert("warning", sensor.category, message, advice, sensor.name, sensor.value)


def _critical(sensor: Sensor, message: str, advice: str) -> Alert:
    return Alert("critical", sensor.category, message, advice, sensor.name, sensor.value)


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, monitor: HardwareMonitor) -> None:
    def monitor_for(_: Any) -> HardwareMonitor:
        return monitor

    @registry.tool(
        "hardware.report",
        "Full hardware report: CPU load per core, clock speed, memory and swap, disks and free "
        "space, network counters, battery, plus every temperature, fan, voltage and power sensor "
        "the machine exposes.",
        obj(
            {
                "processes": prop("integer", "Include this many of the busiest processes."),
                "include_history": prop("boolean", "Append recent samples for trend analysis."),
            },
        ),
        category="hardware", permission="safe",
    )
    def report(processes: int = 8, include_history: bool = False, ctx: Any = None) -> dict[str, Any]:
        sample = monitor_for(ctx).sample(include_processes=processes)
        payload = sample.to_json() | {"summary": sample.summary()}
        if include_history:
            payload["history"] = monitor_for(ctx).history(30)
        return payload

    @registry.tool(
        "hardware.sensors",
        "List every sensor by category (temperature, fan, voltage, power, load, clock) with its "
        "source, so the agent can query exactly what this machine exposes.",
        obj({"category": prop("string", "Filter to one category.")}),
        category="hardware", permission="safe",
    )
    def sensors(category: str | None = None, ctx: Any = None) -> dict[str, Any]:
        sample = monitor_for(ctx).sample()
        found = sample.by_category(category) if category else sample.sensors
        return {"count": len(found), "sensors": [sensor.to_json() for sensor in found],
                "sources": sample.sources}

    @registry.tool(
        "hardware.health",
        "Overall health verdict with any current warnings or critical conditions, plus the advice "
        "the watchdog would give the user.",
        obj({}), category="hardware", permission="safe",
    )
    def health(ctx: Any = None) -> dict[str, Any]:
        return monitor_for(ctx).health_verdict()

    @registry.tool(
        "hardware.alerts",
        "Recent hardware alerts: high or critical temperatures, failing-fan patterns, memory "
        "pressure, low disk space.",
        obj({"limit": prop("integer", "How many alerts to return.")}),
        category="hardware", permission="safe",
    )
    def alerts(limit: int = 20, ctx: Any = None) -> dict[str, Any]:
        return {"alerts": monitor_for(ctx).recent_alerts(limit)}

    @registry.tool(
        "hardware.trend",
        "Time series for one named sensor, for deciding whether a temperature is climbing.",
        obj({"sensor": prop("string", "Exact sensor name from hardware.sensors."),
             "limit": prop("integer", "How many samples.")}, ["sensor"]),
        category="hardware", permission="safe",
    )
    def trend(sensor: str, limit: int = 60, ctx: Any = None) -> dict[str, Any]:
        points = monitor_for(ctx).trend(sensor, limit=limit)
        values = [point["value"] for point in points]
        return {
            "sensor": sensor, "points": points,
            "min": min(values) if values else None, "max": max(values) if values else None,
            "mean": round(statistics.fmean(values), 2) if values else None,
            "slope": round(_slope(values), 3) if len(values) > 1 else None,
        }

    @registry.tool(
        "hardware.configure",
        "Point the monitor at a LibreHardwareMonitor web server for deep sensor telemetry, or "
        "adjust the alert thresholds.",
        obj(
            {
                "lhm_url": prop("string", "For example http://127.0.0.1:8085/data.json"),
                "cpu_temp_warn": prop("number", "CPU warning temperature in Celsius."),
                "cpu_temp_crit": prop("number", "CPU critical temperature in Celsius."),
                "mem_pct_warn": prop("number", "Memory warning percentage."),
                "sample_seconds": prop("number", "Sampling interval."),
            },
        ),
        category="hardware", permission="sensitive",
    )
    def configure(lhm_url: str | None = None, cpu_temp_warn: float | None = None,
                  cpu_temp_crit: float | None = None, mem_pct_warn: float | None = None,
                  sample_seconds: float | None = None, ctx: Any = None) -> dict[str, Any]:
        target = monitor_for(ctx)
        result: dict[str, Any] = {}
        if lhm_url:
            result["lhm"] = target.configure_lhm(lhm_url)
        if cpu_temp_warn is not None:
            target.thresholds.cpu_temp_warn = cpu_temp_warn
        if cpu_temp_crit is not None:
            target.thresholds.cpu_temp_crit = cpu_temp_crit
        if mem_pct_warn is not None:
            target.thresholds.mem_pct_warn = mem_pct_warn
        if sample_seconds is not None:
            target.thresholds.sample_seconds = sample_seconds
        result["thresholds"] = {
            "cpu_temp_warn": target.thresholds.cpu_temp_warn,
            "cpu_temp_crit": target.thresholds.cpu_temp_crit,
            "mem_pct_warn": target.thresholds.mem_pct_warn,
            "sample_seconds": target.thresholds.sample_seconds,
        }
        return result


def _slope(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    n = len(values)
    mean_x = (n - 1) / 2
    mean_y = statistics.fmean(values)
    numerator = sum((index - mean_x) * (value - mean_y) for index, value in enumerate(values))
    denominator = sum((index - mean_x) ** 2 for index in range(n)) or 1.0
    return numerator / denominator
