"""The agent loop.

One implementation, shared by every role. A role changes the prompt, the tool
grant, the model ceiling and the step budget - never the mechanics. That keeps
behaviour predictable: a subagent is exactly as capable as the main agent
within its grant, because it is running the same code.

The loop:

1. Assemble context - role prompt, environment facts, tool grant, recalled
   memories, parent directive, task brief.
2. Ask the model (streaming, with failover on provider failure).
3. Execute any tool calls (independent calls concurrently), feeding results back
   as tool messages.
4. Repeat until the model answers without tools, or the step budget runs out.
5. Distil the run into memory and return a structured report.

Every step is published on the event bus, so the GUI can show thinking, tool
calls, wiring and cost live, and so the manager can supervise.
"""

from __future__ import annotations

import asyncio
import json
import logging
import platform
import time
from dataclasses import dataclass, field, replace
from typing import Any, Sequence

from ..bus import BUS, EventType
from ..config import Settings
from ..llm.client import ModelUnavailable
from ..llm.quota import QuotaLedger
from ..llm.router import ModelRouter, Requirements, Route
from ..llm.types import (
    AuthError,
    ChatMessage,
    LLMError,
    LLMResponse,
    ProviderDown,
    RateLimited,
    ToolCall,
    ToolSpec,
)
from ..memory.store import AgentRecord, MemoryRecord, MessageRecord, TaskRecord, new_id
from ..tools.context import Services, ToolContext
from ..tools.registry import ToolRegistry, ToolResult
from .roles import RoleSpec, role_for, tier_for_rank

log = logging.getLogger("vyralis.agent")

REPORT_TOOL_HINT = (
    "When you have finished, reply with your report and no further tool calls: the message you "
    "send without tool calls is what your caller sees."
)


@dataclass
class AgentResult:
    ok: bool
    report: str = ""
    outputs: list[str] = field(default_factory=list)
    steps: int = 0
    tool_calls: int = 0
    tokens_in: int = 0
    tokens_out: int = 0
    model: str = ""
    provider: str = ""
    duration_s: float = 0.0
    error: str = ""
    interrupted: bool = False

    def to_json(self) -> dict[str, Any]:
        return {
            "ok": self.ok, "report": self.report[:4000], "outputs": self.outputs[:50],
            "steps": self.steps, "tool_calls": self.tool_calls,
            "tokens_in": self.tokens_in, "tokens_out": self.tokens_out,
            "model": self.model, "provider": self.provider,
            "duration_s": round(self.duration_s, 2), "error": self.error,
            "interrupted": self.interrupted,
        }

    def one_line(self) -> str:
        if self.ok:
            head = self.report.strip().splitlines()[0] if self.report.strip() else "done"
            return head[:200]
        return f"failed: {self.error[:200]}"


class Agent:
    """A running agent: identity, grant, memory and loop."""

    def __init__(
        self,
        record: AgentRecord,
        runtime: Any,
        *,
        role: RoleSpec | None = None,
        grant: Sequence[str] | None = None,
        budget: dict[str, Any] | None = None,
    ) -> None:
        self.runtime = runtime
        self.settings: Settings = runtime.settings
        self.store = runtime.store
        self.role: RoleSpec = role or role_for(record.role)
        self.record = record
        self.record.role = self.role.key
        self.record.rank = self.record.rank or self.role.rank
        self.record.permissions = record.permissions or {}
        self.grant: list[str] | None = list(grant) if grant is not None else None
        self.budget: dict[str, Any] = {
            "max_steps": self.role.max_steps,
            "tier_ceiling": self.role.tier_ceiling,
            "max_tokens_out": 200_000,
            **(budget or {}),
        }
        self._activity: list[dict[str, Any]] = []
        self._cancelled = False
        self.store.upsert_agent(self.record)

    # -- identity -------------------------------------------------------
    @property
    def id(self) -> str:
        return self.record.id

    @property
    def name(self) -> str:
        return self.record.name

    def describe(self) -> dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "role": self.role.key, "title": self.role.title,
            "rank": self.record.rank, "parent_id": self.record.parent_id,
            "team_id": self.record.team_id, "status": self.record.status,
            "mandate": self.record.mandate, "model": self.record.model,
            "provider_id": self.record.provider_id, "color": self.role.color,
            "grant": self.grant or ["all"], "budget": self.budget,
            "created_at": self.record.created_at,
        }

    # -- lifecycle ------------------------------------------------------
    def set_status(self, status: str) -> None:
        self.record.status = status
        self.store.set_agent_status(self.id, status)
        BUS.publish(EventType.AGENT_STATE,
                    {"id": self.id, "name": self.name, "role": self.role.key, "status": status},
                    agent_id=self.id)

    def cancel(self) -> None:
        self._cancelled = True

    # -- context --------------------------------------------------------
    def environment_facts(self) -> str:
        services = self.runtime.services
        available = services.available()
        lines = [
            f"SYSTEM: {platform.system()} {platform.release()} ({platform.machine()})",
            f"Vyralis version: {self.runtime.version}",
            f"Your identity: {self.name} / {self.role.title} / role={self.role.key} / rank={self.record.rank}",
        ]
        if self.record.mandate:
            lines.append(f"Your mandate: {self.record.mandate}")
        lines.append(f"Subsystems online: {', '.join(available) if available else 'none'}")
        if services.computer is not None:
            caps = services.computer.capabilities()
            lines.append(
                f"Desktop input: {'available' if caps['pyautogui'] else 'UNAVAILABLE'} "
                f"({caps['platform']})"
            )
        if services.browser is not None:
            caps = services.browser.capabilities()
            installed = [name for name, present in caps["installed_browsers"].items() if present]
            lines.append(
                f"Browser control: {'available' if caps['playwright'] else 'UNAVAILABLE'}; "
                f"installed browsers: {', '.join(installed) or 'none detected'}"
            )
        if services.vision is not None:
            caps = services.vision.capabilities()
            lines.append(
                f"Vision: capture={'yes' if caps['pillow'] else 'no'} "
                f"ocr={'yes' if caps['ocr'] else 'no (grid marks instead)'}"
            )
        if self.grant:
            lines.append(f"YOUR TOOL GRANT: {', '.join(sorted(self.grant))}")
        else:
            lines.append("YOUR TOOL GRANT: all tools")
        lines.append(
            f"BUDGET: at most {self.budget['max_steps']} steps, model tier up to "
            f"{self.budget.get('tier_ceiling') or self.role.tier_ceiling}"
        )
        if self.runtime.permission_mode != "auto":
            lines.append(
                f"PERMISSIONS: '{self.runtime.permission_mode}' mode - destructive and listed "
                f"actions are confirmed by the user before they run."
            )
        return "\n".join(lines)

    def system_prompt(self, *, task: TaskRecord | None, directive: str = "") -> str:
        blocks = [self.role.prompt, "", self.environment_facts(), ""]
        memories = self.remembered_context(task.brief if task else "")
        if memories:
            blocks.append("RELEVANT MEMORY:")
            blocks.append(memories)
            blocks.append("")
        if directive:
            blocks.append("DIRECTIVE FROM YOUR CALLER:")
            blocks.append(directive)
            blocks.append("")
        if self.runtime.skills is not None and task is not None:
            matches = self.runtime.skills.matches(f"{task.title} {task.brief}")
            if matches:
                blocks.append("EXISTING SKILLS THAT MAY FIT THIS TASK (check before doing it by hand):")
                for skill in matches[:3]:
                    blocks.append(
                        f"  - {skill.name} (id={skill.id}, reliability={skill.reliability:.0%}, "
                        f"inputs={list(skill.parameters)}): {skill.description[:160]}"
                    )
                blocks.append("")
        blocks.append(REPORT_TOOL_HINT)
        return "\n".join(blocks)

    def remembered_context(self, query: str, limit: int = 8) -> str:
        try:
            memories = self.store.recall(query or self.record.mandate, agent_id=self.id, limit=limit)
        except Exception:  # noqa: BLE001
            return ""
        lines = []
        for memory in memories:
            kind = memory.kind
            content = memory.content.strip().replace("\n", " ")
            lines.append(f"  [{kind}] {content[:400]}")
        return "\n".join(lines)

    def tools_for_model(self) -> list[ToolSpec]:
        registry: ToolRegistry = self.runtime.registry
        allow = set(self.grant) if self.grant else None
        specs = registry.specs(allow=allow, deny=self.record.permissions.get("deny", []))
        # Agents only see tools whose subsystem is actually online.
        online = set(self.runtime.services.available())
        category_to_service = {
            "computer": "computer", "browser": "browser", "vision": "vision",
            "office": "office", "hardware": "hardware", "whatsapp": "whatsapp",
            "plugins": "plugins", "skills": "skills", "agents": "orchestrator",
        }
        filtered = []
        for spec in specs:
            needs = category_to_service.get(spec.category)
            if needs and needs in {"computer", "browser", "vision", "office", "hardware",
                                   "whatsapp"} and needs not in online:
                continue
            filtered.append(spec)
        return filtered

    # -- the loop -------------------------------------------------------
    async def run(self, task: TaskRecord, *, directive: str = "", context: str = "") -> AgentResult:
        started = time.perf_counter()
        self.set_status("thinking")
        self._activity = []
        self.store.update_task(task.id, status="running", agent_id=self.id)

        BUS.publish(
            EventType.THOUGHT,
            {"text": f"{self.name} started: {task.title}", "role": self.role.key},
            agent_id=self.id, task_id=task.id,
        )

        messages: list[ChatMessage] = [
            ChatMessage(role="system", content=self.system_prompt(task=task, directive=directive))
        ]
        if context:
            messages.append(ChatMessage(role="user", content=f"CONTEXT FROM CALLER:\n{context}"))
        messages.append(
            ChatMessage(role="user", content=f"TASK: {task.title}\n\n{task.brief}".strip())
        )

        requirements = Requirements(
            needs_tools=True,
            needs_vision=bool(self.settings.providers and self.grant is None),
            max_tier=self.budget.get("tier_ceiling") or self.role.tier_ceiling,
            pinned_provider=self.record.provider_id,
            pinned_model=self.record.model,
            quality_first=self.role.rank >= 60,
            estimated_tokens=2000,
        )

        result = AgentResult(ok=False, model=self.record.model or "", provider=self.record.provider_id or "")
        route: Route | None = None
        failures: list[str] = []
        steps = 0
        max_steps = int(self.budget.get("max_steps", self.role.max_steps))
        tokens_out_total = 0
        tokens_in_total = 0

        while steps < max_steps and not self._cancelled:
            steps += 1
            if route is None:
                route = self.runtime.router.select(requirements, agent_id=self.id)
            if route is None and requirements.max_tier != "frontier":
                # The tier ceiling is a cost policy, not a wall: if nothing within
                # it can serve the request, working on a larger model beats failing.
                log.info("%s: nothing within tier '%s'; relaxing to any available model",
                         self.name, requirements.max_tier)
                requirements = replace(requirements, max_tier="frontier")
                route = self.runtime.router.select(requirements, agent_id=self.id)
                self._publish_thought(
                    "No model was available inside my tier budget, so I am using the best "
                    "available model instead.", kind="note",
                )
            if route is None:
                result.error = "No model is available: every provider is disabled, out of quota or cooling down."
                break

            try:
                response, route = await self._call_model(route, messages, failures)
            except LLMError as exc:
                failures.append(f"{route.provider.id}: {exc}")
                new_route = self.runtime.router.failover(
                    route, requirements, agent_id=self.id, reason=str(exc)
                )
                if new_route is None:
                    result.error = f"All providers failed. Last error: {exc}"
                    break
                route = new_route
                self._remember_model_switch(route)
                continue
            except asyncio.CancelledError:
                result.interrupted = True
                break
            except Exception as exc:  # noqa: BLE001
                log.exception("agent %s model call failed", self.name)
                failures.append(f"{route.provider.id}: {exc}")
                new_route = self.runtime.router.failover(
                    route, requirements, agent_id=self.id, reason=str(exc)
                )
                if new_route is None:
                    result.error = f"All providers failed. Last error: {exc}"
                    break
                route = new_route
                continue

            result.model = response.model or route.model
            result.provider = response.provider_id or route.provider.id
            tokens_in_total += response.usage.tokens_in
            tokens_out_total += response.usage.tokens_out
            self.record.model = result.model
            self.record.provider_id = result.provider

            if response.content:
                self._publish_thought(response.content)
            messages.append(
                ChatMessage(role="assistant", content=response.content, tool_calls=response.tool_calls)
            )
            self._persist_message(task, "assistant", response.content, response.tool_calls)

            if not response.tool_calls:
                result.ok = True
                result.report = response.content.strip()
                break

            tool_results = await self._execute_calls(response.tool_calls, task)
            for call, tool_result in zip(response.tool_calls, tool_results):
                messages.append(
                    ChatMessage(
                        role="tool",
                        content=tool_result.to_model_text(),
                        tool_call_id=call.id,
                        name=call.name,
                    )
                )
                self._persist_message(task, "tool", tool_result.to_model_text(), [], call.id, call.name)
                result.tool_calls += 1

            if self._cancelled:
                result.interrupted = True
                break
            if steps >= max_steps:
                result.error = f"Step budget of {max_steps} exhausted before the task finished."
                result.ok = False
                result.report = (
                    self._activity_summary() +
                    "\nBudget exhausted - the task is partially complete. What remains is described above."
                )

        # Distil the run into memory and finish.
        result.steps = steps
        result.tokens_in = tokens_in_total
        result.tokens_out = tokens_out_total
        result.duration_s = time.perf_counter() - started
        result.outputs = [item["path"] for item in self._activity if item.get("path")]

        if result.ok and result.report:
            self.remember_task_outcome(task, result)
        self.store.update_task(
            task.id, status="done" if result.ok else ("cancelled" if result.interrupted else "failed"),
            result=result.report[:8000],
        )
        self.set_status("idle" if result.ok else "blocked")
        BUS.publish(
            EventType.AGENT_REPORT,
            {"id": self.id, "name": self.name, "role": self.role.key,
             "ok": result.ok, "report": result.report[:2000], "outputs": result.outputs[:20],
             "steps": result.steps, "tokens": result.tokens_in + result.tokens_out,
             "duration_s": round(result.duration_s, 2)},
            agent_id=self.id, task_id=task.id,
        )
        try:
            self.store.trace("agent.report", result.to_json(), agent_id=self.id, task_id=task.id)
        except Exception:  # noqa: BLE001
            pass
        return result

    async def _call_model(
        self, route: Route, messages: list[ChatMessage], failures: list[str]
    ) -> tuple[LLMResponse, Route]:
        decision = self.runtime.ledger.check(route.provider, estimated_tokens=1500)
        if not decision.allowed:
            raise ProviderDown(f"{route.provider.id}: {decision.reason}")

        def on_token(text: str) -> None:
            BUS.publish(EventType.TOKEN, {"text": text}, agent_id=self.id)

        tools = self.tools_for_model()
        try:
            response = await self.runtime.client.stream_chat(
                route.provider, route.model, messages, tools=tools,
                temperature=self._temperature(), max_tokens=self._max_tokens(),
                on_token=on_token if self.role.key == "main" else None,
            )
        except RateLimited as exc:
            self.runtime.ledger.mark_failure(route.provider.id, str(exc), rate_limited=True)
            self.runtime.ledger.record(route.provider.id, route.model, ok=False)
            raise
        except AuthError:
            self.runtime.ledger.mark_failure(route.provider.id, "authentication failed")
            self.runtime.ledger.record(route.provider.id, route.model, ok=False)
            raise
        except ModelUnavailable as exc:
            self.runtime.ledger.mark_failure(route.provider.id, str(exc))
            self.runtime.ledger.record(route.provider.id, route.model, ok=False)
            # The provider may still serve its configured model.
            configured = route.provider.model
            if configured and configured != route.model:
                log.info("retrying %s with its configured model %s", route.provider.id, configured)
                route = Route(provider=route.provider, model=configured, reason="model unavailable fallback")
                response = await self.runtime.client.stream_chat(
                    route.provider, route.model, messages, tools=tools,
                    temperature=self._temperature(), max_tokens=self._max_tokens(),
                )
            else:
                raise

        self.runtime.ledger.mark_ok(route.provider.id)
        self.runtime.ledger.record(
            route.provider.id, route.model,
            tokens_in=response.usage.tokens_in, tokens_out=response.usage.tokens_out, ok=True,
        )
        BUS.publish(
            EventType.MODEL_SELECTED,
            route.to_json() | {"tokens_in": response.usage.tokens_in,
                               "tokens_out": response.usage.tokens_out},
            agent_id=self.id,
        )
        return response, route

    def _temperature(self) -> float:
        return {"main": 0.4, "manager": 0.15, "head": 0.3, "employee": 0.2, "specialist": 0.05}.get(
            self.role.key, 0.3
        )

    def _max_tokens(self) -> int:
        return {"main": 4096, "manager": 2048, "head": 4096, "employee": 3072, "specialist": 2048}.get(
            self.role.key, 3072
        )

    def _remember_model_switch(self, route: Route) -> None:
        self.record.provider_id = route.provider.id
        self.record.model = route.model
        self.store.upsert_agent(self.record)
        note = (
            f"Switched to {route.provider.label}/{route.model} after a provider failure. "
            f"Continuing with the same context and memory."
        )
        BUS.publish(EventType.PROVIDER_FAILOVER,
                    {"agent_id": self.id, "to": route.to_json(), "note": note}, agent_id=self.id)
        self._publish_thought(note)

    # -- tool execution -------------------------------------------------
    async def _execute_calls(self, calls: Sequence[ToolCall], task: TaskRecord) -> list[ToolResult]:
        context = ToolContext(
            agent_id=self.id,
            store=self.store,
            settings=self.settings,
            services=self.runtime.services,
            policy=self.runtime.policy,
            confirm=self.runtime.confirm,
            allowed_tools=self.grant if self.grant else None,
            denied_tools=set(self.record.permissions.get("deny", [])),
            task_id=task.id,
            emit=lambda message, **extra: self._publish_thought(message, kind="note"),
        )
        registry: ToolRegistry = self.runtime.registry

        # Independent calls run concurrently; a call that produces an artifact
        # needed by a later call still works because results are gathered in order.
        independent = [call for call in calls if call.name not in {"agents.spawn"}]
        if len(independent) == len(calls) and len(calls) > 1:
            results = await registry.execute_many(
                [(call.name, call.arguments) for call in calls], context
            )
        else:
            results = []
            for call in calls:
                results.append(await registry.execute(call.name, call.arguments, context))
                if self._cancelled:
                    break

        for call, result in zip(calls, results):
            self._activity.append({
                "tool": call.name,
                "ok": getattr(result, "ok", False),
                "args": {key: value for key, value in list(call.arguments.items())[:6]},
                "error": getattr(result, "error", "")[:200],
                "path": (call.arguments or {}).get("path") if isinstance(call.arguments, dict) else None,
                "summary": self._summarise(call, result),
            })
            if not getattr(result, "ok", False):
                BUS.publish(
                    EventType.THOUGHT,
                    {"text": f"{call.name} failed: {getattr(result, 'error', '')[:200]}",
                     "kind": "error"},
                    agent_id=self.id, task_id=task.id,
                )
        return results

    @staticmethod
    def _summarise(call: ToolCall, result: Any) -> str:
        if not getattr(result, "ok", False):
            return f"{call.name}: {getattr(result, 'error', '')[:120]}"
        data = getattr(result, "data", None)
        if isinstance(data, dict):
            for key in ("path", "url", "contact", "sent", "ok", "count", "rows", "matches"):
                if key in data:
                    return f"{call.name}: {key}={str(data[key])[:80]}"
        return f"{call.name}: ok ({getattr(result, 'duration_ms', 0)}ms)"

    def _activity_summary(self) -> str:
        if not self._activity:
            return "No actions were recorded."
        lines = ["ACTIONS TAKEN:"]
        for item in self._activity[-25:]:
            mark = "ok " if item["ok"] else "FAIL"
            lines.append(f"  [{mark}] {item['summary']}")
        return "\n".join(lines)

    # -- memory ---------------------------------------------------------
    def _publish_thought(self, text: str, *, kind: str = "thought") -> None:
        text = (text or "").strip()
        if not text:
            return
        BUS.publish(EventType.THOUGHT, {"text": text[:2000], "kind": kind,
                                        "role": self.role.key, "name": self.name},
                    agent_id=self.id)
        if self.runtime.voice is not None and kind == "note":
            self.runtime.voice.maybe_speak(text)

    def _persist_message(self, task: TaskRecord, role: str, content: str,
                         tool_calls: Sequence[ToolCall] = (), tool_call_id: str | None = None,
                         name: str | None = None) -> None:
        try:
            self.store.add_message(MessageRecord(
                id=new_id("msg"), agent_id=self.id, role=role, content=content[:20000],
                tool_calls=[{"id": call.id, "name": call.name, "arguments": call.arguments}
                            for call in tool_calls],
                tool_call_id=tool_call_id, name=name,
            ))
        except Exception:  # noqa: BLE001
            pass

    def remember(self, content: str, *, kind: str = "episodic", importance: float = 0.5,
                 scope: str | None = None, tags: Sequence[str] = ()) -> str:
        memory_id = new_id("mem")
        self.store.remember(MemoryRecord(
            id=memory_id, agent_id=self.id, kind=kind, content=content,
            tags=list(tags), importance=importance, scope=scope or self.role.memory_scope,
            source=f"agent:{self.name}",
        ))
        BUS.publish(EventType.MEMORY_WRITE,
                    {"agent_id": self.id, "kind": kind, "content": content[:300]}, agent_id=self.id)
        return memory_id

    def remember_task_outcome(self, task: TaskRecord, result: AgentResult) -> None:
        summary = result.report.strip()
        if not summary:
            return
        self.remember(
            f"Task '{task.title}' finished. Outcome: {summary[:1200]}",
            kind="episodic", importance=0.45, tags=["task", task.title[:40]],
        )
        # Durable facts are extracted separately by the main agent; here we only
        # keep the operational record, so memory does not fill with noise.

    # -- supervision ----------------------------------------------------
    def inspect(self) -> dict[str, Any]:
        recent = [message.to_json() if hasattr(message, "to_json") else str(message)
                  for message in self.store.history(self.id, limit=20)]
        return {
            "agent": self.describe(),
            "status": self.record.status,
            "steps_taken": len(self._activity),
            "recent_actions": self._activity[-20:],
            "failures": [item for item in self._activity if not item["ok"]][-10:],
            "messages": len(recent),
            "mandate": self.record.mandate,
        }

    def reassign_model(self, provider_id: str | None = None, model: str | None = None) -> dict[str, Any]:
        """Called by the manager when a provider is exhausted - keeps the context."""
        if provider_id:
            self.record.provider_id = provider_id
        if model:
            self.record.model = model
        self.store.upsert_agent(self.record)
        note = (
            f"Your model was reassigned to "
            f"{provider_id or self.record.provider_id}/{model or self.record.model} "
            f"to keep your work running. Your memory and context are unchanged; carry on with the "
            f"same task."
        )
        self.remember(note, kind="episodic", importance=0.6)
        BUS.publish(EventType.PROVIDER_FAILOVER,
                    {"agent_id": self.id, "provider_id": provider_id, "model": model, "note": note},
                    agent_id=self.id)
        return {"agent_id": self.id, "provider_id": self.record.provider_id,
                "model": self.record.model, "note": note}

    def boundary_report(self) -> str:
        """Short, structured handover text for a parent or a replacement agent."""
        payload = {
            "agent": self.name,
            "role": self.role.key,
            "status": self.record.status,
            "mandate": self.record.mandate,
            "steps_taken": len(self._activity),
            "recent_actions": [
                {"tool": item["tool"], "ok": item["ok"], "summary": item["summary"]}
                for item in self._activity[-12:]
            ],
            "outputs": [item["path"] for item in self._activity if item.get("path")][:20],
        }
        return json.dumps(payload, indent=2, ensure_ascii=False)
