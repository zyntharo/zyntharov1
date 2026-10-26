"""Configuration and filesystem layout for Vyralis.

Everything the runtime persists (memories, quota ledger, plugin cache, browser
profiles, screenshots, logs) lives under a single per-user data directory so
the whole product can be uninstalled by deleting one folder.

No third-party dependency is used here on purpose: config must be importable
before anything is installed, which keeps first-run diagnostics reliable.
"""

from __future__ import annotations

import json
import os
import platform
import secrets
import sys
from dataclasses import asdict, dataclass, field, fields
from pathlib import Path
from typing import Any


# --------------------------------------------------------------------------
# Filesystem layout
# --------------------------------------------------------------------------
def _default_data_dir() -> Path:
    """Return the per-user data directory for the current platform."""
    override = os.environ.get("VYRALIS_HOME")
    if override:
        return Path(override).expanduser().resolve()

    home = Path.home()
    system = platform.system()
    if system == "Windows":
        base = Path(os.environ.get("LOCALAPPDATA", home / "AppData" / "Local"))
        return base / "Vyralis"
    if system == "Darwin":
        return home / "Library" / "Application Support" / "Vyralis"
    base = Path(os.environ.get("XDG_DATA_HOME", home / ".local" / "share"))
    return base / "vyralis"


@dataclass(frozen=True)
class Paths:
    """Resolved runtime paths. Created lazily by :meth:`ensure`."""

    root: Path

    @property
    def db(self) -> Path:
        return self.root / "vyralis.sqlite3"

    @property
    def settings(self) -> Path:
        return self.root / "settings.json"

    @property
    def secrets(self) -> Path:
        return self.root / "secrets.json"

    @property
    def logs(self) -> Path:
        return self.root / "logs"

    @property
    def plugins(self) -> Path:
        return self.root / "plugins"

    @property
    def plugin_cache(self) -> Path:
        return self.root / "plugin_cache"

    @property
    def profiles(self) -> Path:
        return self.root / "profiles"

    @property
    def screenshots(self) -> Path:
        return self.root / "screenshots"

    @property
    def artifacts(self) -> Path:
        return self.root / "artifacts"

    @property
    def skills(self) -> Path:
        return self.root / "skills"

    @property
    def all_dirs(self) -> tuple[Path, ...]:
        return (
            self.root,
            self.logs,
            self.plugins,
            self.plugin_cache,
            self.profiles,
            self.screenshots,
            self.artifacts,
            self.skills,
        )

    def ensure(self) -> "Paths":
        for path in self.all_dirs:
            path.mkdir(parents=True, exist_ok=True)
        return self


def package_dir() -> Path:
    """Directory containing the installed ``vyralis`` package."""
    return Path(__file__).resolve().parent


def bundled_gui_dir() -> Path:
    """Where the built GUI assets live (inside the package for frozen builds)."""
    if getattr(sys, "frozen", False):
        return Path(getattr(sys, "_MEIPASS", package_dir())) / "gui"
    return package_dir() / "gui"


def is_frozen() -> bool:
    return bool(getattr(sys, "frozen", False))


# --------------------------------------------------------------------------
# Settings
# --------------------------------------------------------------------------
@dataclass
class ProviderConfig:
    """One OpenAI-compatible model endpoint plus its quota envelope.

    Quota values are what the Manager agent uses to decide model selection and
    failover. They are advisory: if a real HTTP 429 arrives, the ledger trusts
    the server and cools the provider down regardless of these numbers.
    """

    id: str
    label: str
    base_url: str
    api_key_env: str = ""
    api_key: str = ""
    model: str = ""
    audio_model: str = ""
    rpm: int = 0          # requests per minute (0 = unlimited/unknown)
    rpd: int = 0          # requests per day
    tpm: int = 0          # tokens per minute
    tpd: int = 0          # tokens per day
    priority: int = 100   # lower wins when everything else ties
    enabled: bool = True
    supports_tools: bool = True
    supports_vision: bool = False
    supports_audio: bool = False
    tier: str = "standard"  # frontier | standard | economy | local

    def resolved_key(self) -> str:
        """Key from the environment if present, else the locally stored key."""
        if self.api_key_env:
            env_value = os.environ.get(self.api_key_env, "").strip()
            if env_value:
                return env_value
        return self.api_key.strip()


@dataclass
class HardwareThresholds:
    cpu_temp_warn: float = 80.0
    cpu_temp_crit: float = 92.0
    cpu_pct_warn: float = 90.0
    mem_pct_warn: float = 88.0
    disk_free_gb_warn: float = 5.0
    fan_rpm_delta_warn: float = 1500.0
    # How often the watchdog samples sensors, in seconds.
    sample_seconds: float = 4.0


@dataclass
class Settings:
    """Every user-tunable knob. Persisted to ``settings.json``."""

    host: str = "127.0.0.1"
    port: int = 8756
    token: str = ""

    permission_mode: str = "ask"          # ask | auto | deny
    fs_allowlist: list[str] = field(default_factory=list)
    require_confirmation_for: list[str] = field(
        default_factory=lambda: ["files.delete", "shell.run", "plugins.install", "system.shutdown"]
    )

    browser_channel: str = "chrome"
    browser_headless: bool = False
    browser_profile: str = "default"

    watch_interval_seconds: int = 60       # default per-agent observation cadence
    max_subagents: int = 8
    max_parallel_tools: int = 4
    max_steps_per_task: int = 60

    vision_set_of_marks: bool = True
    vision_grid_overlay: bool = False

    voice_enabled: bool = True
    voice_engine: str = "browser"          # browser | local | provider
    voice_name: str = ""
    input_mode: str = "voice"              # voice | chat

    hardware: HardwareThresholds = field(default_factory=HardwareThresholds)
    providers: list[ProviderConfig] = field(default_factory=list)

    # GUI knobs, so the HUD is configurable without a rebuild.
    gui_particle_count: int = 18000
    gui_show_wiring: bool = True
    gui_reduced_motion: bool = False

    # ------------------------------------------------------------------
    @classmethod
    def load(cls, paths: Paths) -> "Settings":
        settings = cls()
        settings._load_providers_from_env()
        if paths.settings.exists():
            try:
                raw = json.loads(paths.settings.read_text("utf-8"))
                settings._apply(raw)
            except (json.JSONDecodeError, OSError, TypeError):
                # A corrupt settings file must never stop the agent booting.
                pass
        if not settings.token:
            settings.token = os.environ.get("VYRALIS_TOKEN", "").strip() or secrets.token_urlsafe(24)
        settings._write_env_overrides()
        return settings

    def _apply(self, raw: dict[str, Any]) -> None:
        known = {f.name for f in fields(self)}
        for key, value in raw.items():
            if key not in known:
                continue
            if key == "providers" and isinstance(value, list):
                provider_fields = {f.name for f in fields(ProviderConfig)}
                restored: list[ProviderConfig] = []
                for item in value:
                    if isinstance(item, dict):
                        restored.append(
                            ProviderConfig(**{k: v for k, v in item.items() if k in provider_fields})
                        )
                if restored:
                    self.providers = restored
            elif key == "hardware" and isinstance(value, dict):
                hw_fields = {f.name for f in fields(HardwareThresholds)}
                for k, v in value.items():
                    if k in hw_fields:
                        setattr(self.hardware, k, v)
            else:
                setattr(self, key, value)

    def _load_providers_from_env(self) -> None:
        """Seed the provider registry from the documented environment vars."""
        specs = (
            ("primary", "Primary", "VYRALIS_PRIMARY", "frontier", 10, True, True, True),
            ("secondary", "Secondary", "VYRALIS_SECONDARY", "standard", 20, True, True, False),
            ("local", "Local", "VYRALIS_LOCAL", "local", 90, True, True, False),
        )
        for pid, label, prefix, tier, priority, tools, vision, audio in specs:
            base_url = os.environ.get(f"{prefix}_BASE_URL", "").strip()
            model = os.environ.get(f"{prefix}_MODEL", "").strip()
            if not base_url and not model:
                continue
            self.providers.append(
                ProviderConfig(
                    id=pid,
                    label=label,
                    base_url=base_url,
                    api_key_env=f"{prefix}_API_KEY",
                    api_key=os.environ.get(f"{prefix}_API_KEY", "").strip(),
                    model=model,
                    audio_model=os.environ.get(f"{prefix}_AUDIO_MODEL", "").strip(),
                    tier=tier,
                    priority=priority,
                    supports_tools=tools,
                    supports_vision=vision,
                    supports_audio=audio,
                )
            )

    def _write_env_overrides(self) -> None:
        """Environment wins over the settings file for a handful of keys."""
        for attr, env_name in (
            ("host", "VYRALIS_HOST"),
            ("port", "VYRALIS_PORT"),
            ("browser_channel", "VYRALIS_BROWSER_CHANNEL"),
            ("permission_mode", "VYRALIS_PERMISSION_MODE"),
        ):
            value = os.environ.get(env_name, "").strip()
            if value:
                setattr(self, attr, int(value) if attr == "port" else value)
        allow = os.environ.get("VYRALIS_FS_ALLOWLIST", "").strip()
        if allow:
            self.fs_allowlist = [p.strip() for p in allow.split(os.pathsep) if p.strip()]
        if os.environ.get("VYRALIS_BROWSER_HEADLESS", "").strip().lower() in {"1", "true", "yes"}:
            self.browser_headless = True

    # ------------------------------------------------------------------
    def save(self, paths: Paths) -> None:
        payload = asdict(self)
        paths.settings.write_text(json.dumps(payload, indent=2), "utf-8")

    def provider(self, provider_id: str) -> ProviderConfig | None:
        for candidate in self.providers:
            if candidate.id == provider_id:
                return candidate
        return None

    @property
    def active_providers(self) -> list[ProviderConfig]:
        return [p for p in self.providers if p.enabled and p.base_url and p.resolved_key()]

    def redacted(self) -> dict[str, Any]:
        """Settings safe to hand to the GUI: keys replaced by presence flags."""
        payload = asdict(self)
        for provider in payload.get("providers", []):
            has_key = bool(provider.get("api_key")) or bool(
                os.environ.get(provider.get("api_key_env") or "", "").strip()
            )
            provider["api_key"] = ""
            provider["has_key"] = has_key
        payload["token"] = ""
        payload["token_set"] = bool(self.token)
        return payload


# --------------------------------------------------------------------------
# Process-wide singleton
# --------------------------------------------------------------------------
_PATHS = Paths(_default_data_dir()).ensure()
_SETTINGS: Settings | None = None


def paths() -> Paths:
    return _PATHS


def settings(reload: bool = False) -> Settings:
    global _SETTINGS
    if _SETTINGS is None or reload:
        _SETTINGS = Settings.load(_PATHS)
    return _SETTINGS


def set_settings(value: Settings) -> None:
    global _SETTINGS
    _SETTINGS = value


def reset(data_dir: str | Path | None = None) -> Settings:
    """Re-point the data directory and reload settings (used by tests and by
    portable installs that move the data folder at runtime)."""
    global _PATHS, _SETTINGS
    _PATHS = Paths(
        Path(data_dir).expanduser().resolve() if data_dir else _default_data_dir()
    ).ensure()
    _SETTINGS = None
    return settings(reload=True)
