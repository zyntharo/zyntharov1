"""Overwatch: the manager agent.

A background supervisor with a fixed loop. It is deliberately *not* an LLM call
on a timer - that would burn the user's quota for nothing. Instead:

* a deterministic watchdog runs every few seconds and detects the conditions
  that matter (provider cooling down, quota exhausted, an agent pinned to a dead
  provider, a worker that has stopped making progress, a hardware alert),
* it fixes what it has authority to fix immediately (reassigning models,
  carrying context forward, disabling a broken provider),
* and it only wakes a model when a judgement call is actually needed, at which
  point it runs the OVERWATCH prompt with the facts and gets a short report.

That keeps the "manager checks everyone constantly" promise without paying for
a model round-trip every few seconds.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any

from ..bus import BUS, EventType
from ..llm.router import Requirements
from ..memory.store import TaskRecord, new_id
from .agent import Agent
from .roles import MANAGER

log = logging.getLogger("vyralis.manager")

STUCK_SECONDS = 240.0


@dataclass
class ManagerEvent:
    kind: str
    detail: str
    action: str = ""
    severity: str = "notice"
    ts: float = field(default_factory=time.time)

    def to_json(self) -> dict[str, Any]:
        return {"kind": self.kind, "detail": self.detail, "action": self.action,
                "severity": self.severity, "ts": self.ts}


class ManagerAgent:
    """The watchdog. Owns provider rotation, model reassignment and worker health."""

    def __init__(self, runtime: Any, orchestrator: Any, *, interval: float = 20.0) -> None:
        self.runtime = runtime
        self.orchestrator = orchestrator
        self.interval = interval
        self.agent: Agent | None = None
        self.events: list[ManagerEvent] = []
        self._task: asyncio.Task[None] | None = None
        self._stop = asyncio.Event()
        self._suspended: dict[str, float] = {}   # provider_id -> until
        self._consulted: dict[str, float] = {}   # agent_id -> last model consult
        self.reports = 0

    # -- lifecycle ------------------------------------------------------
    def ensure_agent(self) -> Agent:
        if self.agent is not None:
            return self.agent
        record = self.runtime.store.get_agent("manager")
        if record is None:
            from ..memory.store import AgentRecord

            record = AgentRecord(
                id="manager", name="OVERWATCH", role="manager", rank=MANAGER.rank,
                mandate="Keep the provider pool, the model assignments and every worker healthy.",
            )
        agent = Agent(record, self.runtime, role=MANAGER,
                      grant=self.orchestrator._resolve_grant(MANAGER, None))  # noqa: SLF001
        self.agent = agent
        self.orchestrator.agents[agent.id] = agent
        BUS.publish(EventType.AGENT_SPAWNED, agent.describe())
        return agent

    def start(self) -> asyncio.Task[None]:
        self.ensure_agent()
        self._stop.clear()
        self._task = asyncio.create_task(self._loop(), name="manager-watchdog")
        return self._task

    async def stop(self) -> None:
        self._stop.set()
        if self._task is not None:
            self._task.cancel()
            try:
                await self._task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
            self._task = None

    # -- main loop ------------------------------------------------------
    async def _loop(self) -> None:
        log.info("Overwatch started (interval %.0fs)", self.interval)
        while not self._stop.is_set():
            try:
                await self.cycle()
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001
                log.debug("manager cycle failed: %s", exc)
            try:
                await asyncio.wait_for(self._stop.wait(), timeout=self.interval)
            except asyncio.TimeoutError:
                pass

    async def cycle(self) -> dict[str, Any]:
        """One supervision pass: detect, fix, report."""
        events: list[ManagerEvent] = []
        events.extend(self._check_providers())
        events.extend(self._check_agents())
        events.extend(self._check_quota_pressure())

        report = {
            "ts": time.time(),
            "status": "critical" if any(e.severity == "critical" for e in events)
            else ("degraded" if events else "ok"),
            "events": [event.to_json() for event in events],
            "changes": [event.action for event in events if event.action],
            "headroom": self.runtime.router.headroom(),
        }
        if events:
            self.reports += 1
            BUS.publish(EventType.QUOTA_EVENT, {"kind": "manager_report", **report})
            for event in events:
                if event.severity in {"warning", "critical"}:
                    self.orchestrator.notify_main(event.detail, severity=event.severity)
        if self._needs_model_judgement():
            await self.consult_model(report)
        return report

    # -- checks ---------------------------------------------------------
    def _check_providers(self) -> list[ManagerEvent]:
        events: list[ManagerEvent] = []
        for provider in self.runtime.settings.providers:
            if not provider.enabled:
                continue
            health = self.runtime.ledger.health(provider.id)
            now = time.time()
            if health.cooling(now):
                remaining = int(health.cooldown_until - now)
                if remaining > 30:
                    events.append(ManagerEvent(
                        "provider_cooling",
                        f"Provider '{provider.label}' is cooling down for {remaining}s "
                        f"after: {health.last_error[:120] or 'repeated failures'}",
                        severity="warning" if remaining < 300 else "critical",
                    ))
                # Move anyone pinned to it onto a working provider right away.
                for agent in list(self.orchestrator.agents.values()):
                    if agent.record.status == "retired":
                        continue
                    if agent.record.provider_id != provider.id:
                        continue
                    move = self._best_alternative(exclude={provider.id})
                    if move is None:
                        continue
                    result = self.orchestrator.reassign_model(
                        agent.id, provider_id=move["provider_id"], model=move["model"]
                    )
                    if result.get("ok"):
                        events.append(ManagerEvent(
                            "model_reassigned",
                            f"{agent.name} was on '{provider.label}' which is unavailable; "
                            f"moved to {move['provider_label']}/{move['model']}. "
                            f"Context and memory preserved.",
                            action=f"reassign {agent.name} -> {move['model']}",
                            severity="warning",
                        ))
            # Repeated rate-limit strikes mean the provider is not usable right now,
            # whether or not it is still inside its cooldown window.
            if health.consecutive_429 >= 4 and time.time() - self._suspended.get(provider.id, 0) > 600:
                provider.enabled = False
                self._suspended[provider.id] = time.time()
                self.runtime.settings.save(self.runtime.paths)
                events.append(ManagerEvent(
                    "provider_disabled",
                    f"Provider '{provider.label}' hit {health.consecutive_429} rate-limit "
                    f"responses and was taken out of rotation.",
                    action=f"disable provider {provider.id}",
                    severity="warning",
                ))
        return events

    def _best_alternative(self, *, exclude: set[str]) -> dict[str, Any] | None:
        requirements = Requirements(
            needs_tools=True, max_tier="frontier", exclude_providers=exclude, quality_first=True
        )
        routes = self.runtime.router.available(requirements)
        if not routes:
            return None
        route = routes[0]
        return {
            "provider_id": route.provider.id, "provider_label": route.provider.label,
            "model": route.model, "score": route.score,
        }

    def _check_agents(self) -> list[ManagerEvent]:
        events: list[ManagerEvent] = []
        now = time.time()
        for agent in list(self.orchestrator.agents.values()):
            if agent.record.status == "retired":
                continue
            age = now - agent.record.updated_at
            if agent.record.status in {"thinking", "acting"} and age > STUCK_SECONDS:
                events.append(ManagerEvent(
                    "worker_stuck",
                    f"{agent.name} ({agent.role.key}) has been '{agent.record.status}' for "
                    f"{int(age)}s with no state change.",
                    severity="warning",
                ))
            failures = [item for item in agent._activity[-8:] if not item["ok"]]  # noqa: SLF001
            if len(failures) >= 5:
                repeated = {item["tool"] for item in failures}
                if len(repeated) <= 2:
                    events.append(ManagerEvent(
                        "tool_loop",
                        f"{agent.name} has failed {len(failures)} of its last 8 actions, mostly "
                        f"{', '.join(sorted(repeated))}. It is likely looping.",
                        severity="warning",
                    ))
        return events

    def _check_quota_pressure(self) -> list[ManagerEvent]:
        events: list[ManagerEvent] = []
        for provider in self.runtime.settings.providers:
            if not provider.enabled:
                continue
            decision = self.runtime.ledger.check(provider)
            if decision.allowed and decision.pressure >= 0.85:
                events.append(ManagerEvent(
                    "quota_pressure",
                    f"'{provider.label}' is at {decision.pressure:.0%} of its configured limit "
                    f"({provider.rpm or '-'} rpm / {provider.rpd or '-'} rpd / "
                    f"{provider.tpm or '-'} tpm / {provider.tpd or '-'} tpd).",
                    severity="warning" if decision.pressure < 0.97 else "critical",
                ))
            elif not decision.allowed and decision.reason:
                events.append(ManagerEvent(
                    "quota_exhausted",
                    f"'{provider.label}' cannot serve requests: {decision.reason}. "
                    f"Work will be routed elsewhere.",
                    severity="warning",
                ))
        return events

    # -- optional model judgement ---------------------------------------
    def _needs_model_judgement(self) -> bool:
        """Only escalate to a model call when something is genuinely stuck."""
        now = time.time()
        for agent in self.orchestrator.agents.values():
            if agent.record.status == "retired":
                continue
            if agent.record.status == "blocked":
                if now - self._consulted.get(agent.id, 0.0) > 900:
                    self._consulted[agent.id] = now
                    return True
        return False

    async def consult_model(self, report: dict[str, Any]) -> dict[str, Any] | None:
        """Run the OVERWATCH prompt for a judgement call and apply its decisions."""
        agent = self.ensure_agent()
        facts = self.runtime.router.describe()
        stuck = [
            {"id": a.id, "name": a.name, "role": a.role.key, "status": a.record.status,
             "mandate": a.record.mandate}
            for a in self.orchestrator.agents.values()
            if a.record.status in {"blocked", "waiting"} and a.record.status != "retired"
        ]
        brief = (
            "Supervision cycle. Facts:\n"
            f"- Provider ledger: {facts}\n"
            f"- Open routes by tier: {report['headroom'].get('by_tier')}\n"
            f"- Agents needing attention: {stuck}\n"
            f"- Detected issues: {report['events']}\n\n"
            "Decide and act: reassign models where a provider is failing, take broken providers out "
            "of rotation, and report STATUS / CHANGES / BLOCKED in at most four lines."
        )
        task = TaskRecord(id=new_id("task"), title="Supervision cycle", brief=brief, agent_id=agent.id)
        self.runtime.store.create_task(task)
        try:
            result = await agent.run(task)
        except Exception as exc:  # noqa: BLE001
            log.debug("manager model consult failed: %s", exc)
            return None
        BUS.publish(EventType.AGENT_REPORT, {
            "id": agent.id, "name": agent.name, "role": "manager", "ok": result.ok,
            "report": result.report[:1200], "kind": "manager",
        }, agent_id=agent.id, task_id=task.id)
        return result.to_json()

    # -- reporting ------------------------------------------------------
    def status(self) -> dict[str, Any]:
        return {
            "running": self._task is not None and not self._task.done(),
            "interval_seconds": self.interval,
            "reports": self.reports,
            "recent_events": [event.to_json() for event in self.events[-20:]],
            "suspended_providers": sorted(self._suspended),
            "headroom": self.runtime.router.headroom(),
        }
