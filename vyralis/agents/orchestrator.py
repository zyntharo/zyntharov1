"""The orchestrator: the main agent, its subagents, teams and task graph.

Responsibilities:

* own exactly one main agent (VYRA) that the user talks to,
* spawn, brief, supervise, reassign and retire subagents,
* keep the task graph (a head task fans out into employee tasks),
* run confirmations - when a tool needs a human answer, this is where the
  request is parked and resolved,
* guarantee cleanup: every background task is cancellable and retired on
  shutdown, so nothing keeps clicking after the window closes.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any, Sequence

from ..bus import BUS, EventType
from ..memory.store import AgentRecord, TaskRecord, new_id
from .agent import Agent, AgentResult
from .roles import HEAD, MAIN, MANAGER, ROLES, RoleSpec, role_for, suggest_names

log = logging.getLogger("vyralis.orchestrator")


@dataclass
class Team:
    id: str
    name: str
    objective: str
    head_id: str
    member_ids: list[str] = field(default_factory=list)
    status: str = "forming"      # forming | working | reviewing | done | failed
    created_at: float = field(default_factory=time.time)
    result: str = ""

    def to_json(self) -> dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "objective": self.objective,
            "head_id": self.head_id, "members": self.member_ids, "status": self.status,
            "result": self.result[:600], "created_at": self.created_at,
            "size": len(self.member_ids) + 1,
        }


@dataclass
class Assignment:
    agent: Agent
    task: TaskRecord
    future: asyncio.Future[AgentResult] | None = None


class Orchestrator:
    """Owns agents, teams and the running task graph."""

    def __init__(self, runtime: Any) -> None:
        self.runtime = runtime
        self.agents: dict[str, Agent] = {}
        self.teams: dict[str, Team] = {}
        self.assignments: dict[str, Assignment] = {}
        self._running: set[asyncio.Task[Any]] = set()
        self._pending_confirmations: dict[str, asyncio.Future[bool]] = {}
        self.main: Agent | None = None
        self.session_task_id: str | None = None

    # -- boot -----------------------------------------------------------
    def ensure_main(self) -> Agent:
        if self.main is not None:
            return self.main
        record = AgentRecord(
            id=new_id("agent"), name="VYRA", role="main", rank=MAIN.rank,
            mandate="Own the user's requests end to end. Speak for the system.",
            permissions={}, budget={"max_steps": MAIN.max_steps},
        )
        agent = Agent(record, self.runtime, role=MAIN, grant=None)
        self.agents[agent.id] = agent
        self.main = agent
        BUS.publish(EventType.AGENT_SPAWNED, agent.describe())
        return agent

    # -- spawning -------------------------------------------------------
    def spawn(
        self, *, role: str = "employee", name: str | None = None, mandate: str = "",
        grant: Sequence[str] | None = None, budget: dict[str, Any] | None = None,
        parent: Agent | None = None, team_id: str | None = None,
        provider_id: str | None = None, model: str | None = None,
    ) -> Agent:
        spec: RoleSpec = role_for(role)
        parent = parent or self.main
        if parent is not None and not parent.role.can_spawn:
            raise PermissionError(f"{parent.name} ({parent.role.key}) is not permitted to spawn agents.")
        # The limit counts workers, not the permanent seats (main + Overwatch).
        subagent_roles = {"head", "employee", "specialist"}
        active = [
            agent for agent in self.agents.values()
            if agent.record.status != "retired" and agent.role.key in subagent_roles
        ]
        if len(active) >= self.runtime.settings.max_subagents:
            raise RuntimeError(
                f"Subagent limit ({self.runtime.settings.max_subagents}) reached. "
                f"Retire an agent before spawning another."
            )

        taken = {agent.name for agent in self.agents.values()}
        chosen = name or suggest_names(1, taken=taken)[0]
        record = AgentRecord(
            id=new_id("agent"), name=chosen, role=spec.key, rank=spec.rank,
            parent_id=parent.id if parent else None, team_id=team_id, mandate=mandate,
            provider_id=provider_id, model=model,
            permissions={"deny": []},
            budget={"max_steps": (budget or {}).get("max_steps", spec.max_steps),
                    "tier_ceiling": (budget or {}).get("tier_ceiling", spec.tier_ceiling)},
        )
        # Rank can never exceed the parent's, so authority cannot escalate.
        if parent is not None:
            record.rank = min(record.rank, max(10, parent.record.rank - 10))

        resolved_grant = self._resolve_grant(spec, grant)
        agent = Agent(record, self.runtime, role=spec, grant=resolved_grant, budget=budget)
        self.agents[agent.id] = agent
        BUS.publish(
            EventType.AGENT_SPAWNED,
            agent.describe() | {"parent": parent.name if parent else None},
            agent_id=agent.id,
        )
        log.info("spawned %s (%s) under %s", agent.name, spec.key, parent.name if parent else "root")
        return agent

    def _resolve_grant(self, spec: RoleSpec, grant: Sequence[str] | None) -> list[str] | None:
        """Turn a category grant or an explicit tool list into tool names."""
        if grant is None:
            if spec.tool_categories is None:
                return None
            registry = self.runtime.registry
            return [
                tool.name for tool in registry.all()
                if tool.spec.category in spec.tool_categories
            ]
        registry = self.runtime.registry
        names: list[str] = []
        for entry in grant:
            if entry == "all":
                return None
            if "." in entry and registry.has(entry):
                names.append(entry)
                continue
            if entry in registry.by_category():
                names.extend(tool.name for tool in registry.by_category()[entry])
                continue
            names.append(entry)  # allow-forward: unknown names simply never match
        return sorted(set(names))

    def get(self, agent_id: str) -> Agent | None:
        return self.agents.get(agent_id)

    def list_agents(self) -> list[dict[str, Any]]:
        return [agent.describe() for agent in self.agents.values() if agent.record.status != "retired"]

    def retire(self, agent_id: str) -> dict[str, Any]:
        agent = self.agents.get(agent_id)
        if agent is None:
            return {"retired": False, "reason": "unknown agent"}
        if agent is self.main:
            return {"retired": False, "reason": "the main agent cannot be retired"}
        agent.cancel()
        agent.set_status("retired")
        self.store_status(agent)
        BUS.publish(EventType.AGENT_RETIRED,
                    {"id": agent.id, "name": agent.name, "role": agent.role.key},
                    agent_id=agent.id)
        return {"retired": True, "id": agent.id, "name": agent.name}

    def store_status(self, agent: Agent) -> None:
        self.runtime.store.upsert_agent(agent.record)

    # -- tasks ----------------------------------------------------------
    def create_task(self, title: str, brief: str = "", *, agent: Agent | None = None,
                    parent_id: str | None = None, team_id: str | None = None,
                    priority: int = 50) -> TaskRecord:
        task = TaskRecord(
            id=new_id("task"), title=title[:200], brief=brief, agent_id=agent.id if agent else None,
            parent_id=parent_id, team_id=team_id, priority=priority,
        )
        self.runtime.store.create_task(task)
        BUS.publish(EventType.PLAN, {
            "task_id": task.id, "title": task.title, "agent": agent.name if agent else None,
            "parent_id": parent_id,
        }, agent_id=agent.id if agent else None, task_id=task.id)
        return task

    async def assign(
        self, agent: Agent, *, title: str, brief: str = "", directive: str = "",
        context: str = "", parent_id: str | None = None, team_id: str | None = None,
        wait: bool = True,
    ) -> AgentResult | asyncio.Task[Any]:
        """Give an agent a task. ``wait=False`` runs it in the background."""
        task = self.create_task(title, brief, agent=agent, parent_id=parent_id, team_id=team_id)
        coroutine = agent.run(task, directive=directive, context=context)
        if wait:
            return await coroutine
        handle = asyncio.create_task(coroutine, name=f"task:{task.id}")
        self._running.add(handle)
        self.assignments[agent.id] = Assignment(agent=agent, task=task)
        handle.add_done_callback(self._running.discard)
        return handle

    # -- teams ----------------------------------------------------------
    def form_team(
        self, *, objective: str, members: int = 3, name: str | None = None,
        head_name: str | None = None, member_budget: dict[str, Any] | None = None,
        head: Agent | None = None,
    ) -> dict[str, Any]:
        parent = head or self.main
        team_id = new_id("team")
        team_name = name or f"Squad {len(self.teams) + 1}"
        head_agent = self.spawn(
            role="head", name=head_name, mandate=objective, parent=parent, team_id=team_id,
            budget={"max_steps": HEAD.max_steps},
        )
        member_agents = [
            self.spawn(
                role="employee", mandate=f"Support the objective: {objective}",
                parent=head_agent, team_id=team_id, budget=member_budget,
            )
            for _ in range(max(1, min(members, self.runtime.settings.max_subagents)))
        ]
        team = Team(
            id=team_id, name=team_name, objective=objective, head_id=head_agent.id,
            member_ids=[agent.id for agent in member_agents],
        )
        self.teams[team_id] = team
        BUS.publish(EventType.TEAM_FORMED, team.to_json() | {
            "head": head_agent.name, "members": [agent.name for agent in member_agents],
        })
        return team.to_json()

    def list_teams(self) -> list[dict[str, Any]]:
        return [team.to_json() for team in self.teams.values()]

    # -- user conversation ---------------------------------------------
    async def handle_user(self, text: str, *, channel: str = "voice") -> AgentResult:
        agent = self.ensure_main()
        BUS.publish(EventType.USER_INPUT, {"text": text[:4000], "channel": channel},
                    agent_id=agent.id)
        task = self.create_task(
            f"User request: {text[:80]}", brief=text, agent=agent, priority=90
        )
        self.session_task_id = task.id
        result = await agent.run(task)
        BUS.publish(
            EventType.SPEECH_START,
            {"text": self._spoken_form(result), "agent_id": agent.id, "name": agent.name},
            agent_id=agent.id, task_id=task.id,
        )
        return result

    @staticmethod
    def _spoken_form(result: AgentResult) -> str:
        """What the voice channel says out loud: the prose, not the file paths."""
        if not result.ok:
            return f"I could not finish that. {result.error[:300]}"
        lines = [line for line in result.report.splitlines() if line.strip()]
        spoken = " ".join(lines)
        if len(spoken) > 1200:
            spoken = spoken[:1200] + " The rest is in the panel."
        return spoken

    # -- confirmations --------------------------------------------------
    async def request_confirmation(self, tool: str, args: dict[str, Any], reason: str,
                                   agent_id: str | None = None) -> bool:
        """Ask the user before a dangerous action runs. Defaults to 'no'."""
        confirmation_id = new_id("confirm")
        loop = asyncio.get_running_loop()
        future: asyncio.Future[bool] = loop.create_future()
        self._pending_confirmations[confirmation_id] = future
        self.runtime.store.add_confirmation(confirmation_id, tool, args, agent_id, reason)
        BUS.publish(EventType.CONFIRM_REQUEST, {
            "id": confirmation_id, "tool": tool, "args": args, "reason": reason,
            "agent_id": agent_id,
            "agent_name": self.agents[agent_id].name if agent_id in self.agents else "",
        }, agent_id=agent_id)
        try:
            return await asyncio.wait_for(future, timeout=120.0)
        except asyncio.TimeoutError:
            self.runtime.store.resolve_confirmation(confirmation_id, "timeout")
            BUS.publish(EventType.CONFIRM_RESULT,
                        {"id": confirmation_id, "approved": False, "reason": "timed out"},
                        agent_id=agent_id)
            return False
        finally:
            self._pending_confirmations.pop(confirmation_id, None)

    def resolve_confirmation(self, confirmation_id: str, approved: bool) -> dict[str, Any]:
        future = self._pending_confirmations.get(confirmation_id)
        self.runtime.store.resolve_confirmation(
            confirmation_id, "approved" if approved else "denied"
        )
        if future is not None and not future.done():
            future.set_result(approved)
        BUS.publish(EventType.CONFIRM_RESULT,
                    {"id": confirmation_id, "approved": approved})
        return {"id": confirmation_id, "approved": approved, "delivered": future is not None}

    def pending_confirmations(self) -> list[dict[str, Any]]:
        return self.runtime.store.pending_confirmations()

    # -- supervision helpers (used by the manager) ----------------------
    def inspect(self, agent_id: str) -> dict[str, Any]:
        agent = self.agents.get(agent_id)
        if agent is None:
            return {"error": f"unknown agent '{agent_id}'"}
        return agent.inspect()

    def reassign_model(self, agent_id: str, provider_id: str | None = None,
                       model: str | None = None) -> dict[str, Any]:
        agent = self.agents.get(agent_id)
        if agent is None:
            return {"ok": False, "error": f"unknown agent '{agent_id}'"}
        return agent.reassign_model(provider_id, model) | {"ok": True}

    def broadcast(self, message: str, *, agent_ids: Sequence[str] | None = None) -> dict[str, Any]:
        targets = [self.agents[aid] for aid in agent_ids if aid in self.agents] if agent_ids else [
            agent for agent in self.agents.values() if agent is not self.main
        ]
        for agent in targets:
            agent.remember(f"Instruction from the main agent: {message}", kind="episodic",
                           importance=0.7)
        BUS.publish(EventType.THOUGHT, {"text": f"Broadcast to {len(targets)} agent(s): {message[:200]}",
                                        "kind": "note"}, agent_id=self.main.id if self.main else None)
        return {"broadcast_to": [agent.name for agent in targets], "count": len(targets)}

    def notify_main(self, message: str, *, severity: str = "notice") -> None:
        """Surface something to the main agent without interrupting the user."""
        if self.main is not None:
            self.main.remember(f"System notice ({severity}): {message}", kind="episodic",
                               importance=0.8 if severity != "notice" else 0.5)
        BUS.publish(EventType.QUOTA_EVENT if "quota" in message.lower() else EventType.HARDWARE_ALERT,
                    {"kind": "manager_notice", "severity": severity, "message": message})

    # -- shutdown -------------------------------------------------------
    async def shutdown(self) -> dict[str, Any]:
        cancelled = 0
        for handle in list(self._running):
            handle.cancel()
            cancelled += 1
        for handle in list(self._running):
            try:
                await handle
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
        for agent in self.agents.values():
            agent.cancel()
        for future in self._pending_confirmations.values():
            if not future.done():
                future.set_result(False)
        return {"cancelled_tasks": cancelled, "agents": len(self.agents)}

    def stats(self) -> dict[str, Any]:
        by_role: dict[str, int] = {}
        for agent in self.agents.values():
            if agent.record.status == "retired":
                continue
            by_role[agent.role.key] = by_role.get(agent.role.key, 0) + 1
        running = sum(1 for agent in self.agents.values() if agent.record.status in {"thinking", "acting"})
        return {
            "agents": len([a for a in self.agents.values() if a.record.status != "retired"]),
            "by_role": by_role,
            "running": running,
            "teams": len(self.teams),
            "background_tasks": len(self._running),
            "pending_confirmations": len(self._pending_confirmations),
        }


def manager_role() -> RoleSpec:
    return MANAGER


def known_roles() -> dict[str, RoleSpec]:
    return dict(ROLES)
