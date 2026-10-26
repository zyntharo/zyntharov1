"""Agent-facing tools for orchestration, memory and system control.

These are what let the main agent behave like a principal engineer running a
team: hire, brief, inspect, correct, reassign, fire - and let a head agent do the
same locally. The grant system means a head can only hand out what it holds.
"""

from __future__ import annotations

from typing import Any, Sequence

from ..memory.store import MemoryRecord, new_id
from ..tools.registry import ToolRegistry, obj, prop
from .roles import ROLE_TIER_CEILING, all_roles


def register(registry: ToolRegistry, runtime: Any, orchestrator: Any, manager: Any) -> None:
    def _agent(ctx: Any) -> Any:
        return orchestrator.get(ctx.agent_id)

    # ==================================================================
    # Agents
    # ==================================================================
    @registry.tool(
        "agents.spawn",
        "Create a subagent with its own identity, memory and tool grant. A subagent has exactly "
        "the same abilities as you within the grant you give it. Give it a narrow grant and a "
        "concrete mandate.",
        obj(
            {
                "role": prop("string", "employee | specialist | head | manager",
                             enum=["employee", "specialist", "head"]),
                "name": prop("string", "Display name (a short callsign)."),
                "mandate": prop("string", "What this agent exists to do."),
                "grant": prop(
                    "array",
                    "Tool categories (e.g. ['browser','files']) or exact tool names. Omit for the "
                    "role's default.",
                    items={"type": "string"},
                ),
                "max_steps": prop("integer", "Step budget for this agent."),
                "tier_ceiling": prop("string", "local | economy | standard | frontier - the best "
                                              "model tier it may use."),
                "provider_id": prop("string", "Pin to a specific provider."),
                "model": prop("string", "Pin to a specific model."),
            },
            ["role", "mandate"],
        ),
        category="agents", permission="sensitive",
    )
    def spawn(role: str, mandate: str, name: str | None = None,
              grant: list[str] | None = None, max_steps: int | None = None,
              tier_ceiling: str | None = None, provider_id: str | None = None,
              model: str | None = None, ctx: Any = None) -> dict[str, Any]:
        parent = _agent(ctx) or orchestrator.main
        budget: dict[str, Any] = {}
        if max_steps:
            budget["max_steps"] = max_steps
        if tier_ceiling:
            # A subagent can never be given more model authority than its parent has.
            parent_ceiling = parent.budget.get("tier_ceiling", browser_ceiling(parent))
            order = ["local", "economy", "standard", "frontier"]
            budget["tier_ceiling"] = order[min(order.index(tier_ceiling), order.index(parent_ceiling))]
        agent = orchestrator.spawn(
            role=role, name=name, mandate=mandate, grant=grant, budget=budget,
            parent=parent, provider_id=provider_id, model=model,
        )
        return agent.describe()

    def browser_ceiling(agent: Any) -> str:
        return ROLE_TIER_CEILING.get(agent.role.key, "standard")

    @registry.tool(
        "agents.assign",
        "Give an agent a task. Set wait=false to run it in the background and keep working; you "
        "will be told the result when it finishes.",
        obj(
            {
                "agent_id": prop("string", "Target agent id from agents.spawn or agents.list."),
                "title": prop("string", "One-line objective."),
                "brief": prop("string", "Full brief: deliverable, location, constraints, report shape."),
                "directive": prop("string", "Framing instructions in your own words."),
                "context": prop("string", "State the agent needs and cannot discover itself."),
                "wait": prop("boolean", "Wait for completion (default true)."),
            },
            ["agent_id", "title", "brief"],
        ),
        category="agents", permission="sensitive", timeout=900.0,
    )
    async def assign(agent_id: str, title: str, brief: str, directive: str = "",
                     context: str = "", wait: bool = True, ctx: Any = None) -> dict[str, Any]:
        agent = orchestrator.get(agent_id)
        if agent is None:
            return {"ok": False, "error": f"No agent with id '{agent_id}'."}
        outcome = await orchestrator.assign(
            agent, title=title, brief=brief, directive=directive, context=context, wait=wait
        )
        if wait:
            return {"ok": outcome.ok, "report": outcome.report[:4000],
                    "outputs": outcome.outputs, "steps": outcome.steps,
                    "model": outcome.model, "duration_s": round(outcome.duration_s, 1),
                    "error": outcome.error}
        return {"ok": True, "queued": True, "agent": agent.name,
                "note": "Running in the background; check agents.reports or agents.inspect later."}

    @registry.tool(
        "agents.list",
        "List every live agent with role, model, status and mandate.",
        obj({}), category="agents", permission="safe",
    )
    def list_agents(ctx: Any = None) -> dict[str, Any]:
        return {"agents": orchestrator.list_agents(), "stats": orchestrator.stats()}

    @registry.tool(
        "agents.inspect",
        "Inspect what an agent is actually doing: its recent actions, failures and status. Use "
        "this to check on a subagent before trusting its report.",
        obj({"agent_id": prop("string", "Agent id.")}, ["agent_id"]),
        category="agents", permission="safe",
    )
    def inspect(agent_id: str, ctx: Any = None) -> dict[str, Any]:
        return orchestrator.inspect(agent_id)

    @registry.tool(
        "agents.report",
        "Read the task results an agent has produced so far, from the task graph.",
        obj({"agent_id": prop("string", "Optional: filter to one agent."),
             "limit": prop("integer", "How many tasks.")}),
        category="agents", permission="safe",
    )
    def reports(agent_id: str | None = None, limit: int = 20, ctx: Any = None) -> dict[str, Any]:
        rows = runtime.store.list_tasks(status=None, agent_id=agent_id, limit=limit)
        return {"tasks": [
            {"id": task.id, "title": task.title, "status": task.status,
             "agent_id": task.agent_id, "result": task.result[:1200],
             "updated_at": task.updated_at}
            for task in rows
        ]}

    @registry.tool(
        "agents.retire",
        "Cancel an agent's work and retire it. Use when a worker is stuck, redundant or finished.",
        obj({"agent_id": prop("string", "Agent id.")}, ["agent_id"]),
        category="agents", permission="sensitive",
    )
    def retire(agent_id: str, ctx: Any = None) -> dict[str, Any]:
        return orchestrator.retire(agent_id)

    @registry.tool(
        "agents.team",
        "Form a team for a long objective: one head plus employees. The head splits the work, "
        "staffs it and reports one consolidated result back to you.",
        obj(
            {
                "objective": prop("string", "The long objective, stated fully."),
                "members": prop("integer", "How many employees to give the head."),
                "name": prop("string", "Team name."),
                "head_name": prop("string", "Name for the squad lead."),
            },
            ["objective"],
        ),
        category="agents", permission="sensitive",
    )
    def team(objective: str, members: int = 3, name: str | None = None,
             head_name: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return orchestrator.form_team(
            objective=objective, members=members, name=name, head_name=head_name,
            head=_agent(ctx),
        )

    @registry.tool(
        "agents.teams", "List the teams currently formed and their status.",
        obj({}), category="agents", permission="safe",
    )
    def teams(ctx: Any = None) -> dict[str, Any]:
        return {"teams": orchestrator.list_teams()}

    @registry.tool(
        "agents.broadcast",
        "Send an instruction to several agents at once (for example: stop writing to the same "
        "file). It is stored in each agent's memory.",
        obj({"message": prop("string", "Instruction."),
             "agent_ids": prop("array", "Targets; omit for every subagent.",
                               items={"type": "string"})}, ["message"]),
        category="agents", permission="sensitive",
    )
    def broadcast(message: str, agent_ids: list[str] | None = None, ctx: Any = None) -> dict[str, Any]:
        return orchestrator.broadcast(message, agent_ids=agent_ids)

    @registry.tool(
        "agents.reassign_model",
        "Move an agent (including yourself or the main agent) onto a different provider or model "
        "without losing its context or memory. Use when a provider is exhausted or failing.",
        obj(
            {
                "agent_id": prop("string", "Agent to move."),
                "provider_id": prop("string", "Target provider id."),
                "model": prop("string", "Target model name."),
            },
            ["agent_id"],
        ),
        category="agents", permission="sensitive",
    )
    def reassign_model(agent_id: str, provider_id: str | None = None, model: str | None = None,
                       ctx: Any = None) -> dict[str, Any]:
        return orchestrator.reassign_model(agent_id, provider_id, model)

    @registry.tool(
        "agents.roles",
        "List the agent roles, their ranks, model-tier ceilings and default powers.",
        obj({}), category="agents", permission="safe",
    )
    def roles(ctx: Any = None) -> dict[str, Any]:
        return {"roles": all_roles()}

    # ==================================================================
    # Quota and providers
    # ==================================================================
    @registry.tool(
        "agents.quota_report",
        "The provider ledger: every configured provider with its rpm/rpd/tpm/tpd limits, current "
        "usage, cooldown state and failure count. This is how you decide which model to use.",
        obj({}), category="agents", permission="safe",
    )
    def quota_report(ctx: Any = None) -> dict[str, Any]:
        return {
            "providers": runtime.router.describe(),
            "headroom": runtime.router.headroom(),
            "manager": manager.status(),
        }

    @registry.tool(
        "agents.set_provider",
        "Enable or disable a provider, or change its quota envelope at runtime.",
        obj(
            {
                "provider_id": prop("string", "Provider id."),
                "enabled": prop("boolean", "Turn it on or off."),
                "rpm": prop("integer", "New requests-per-minute limit (0 = unlimited)."),
                "rpd": prop("integer", "New requests-per-day limit."),
                "tpm": prop("integer", "New tokens-per-minute limit."),
                "tpd": prop("integer", "New tokens-per-day limit."),
                "model": prop("string", "Change the default model."),
            },
            ["provider_id"],
        ),
        category="agents", permission="sensitive",
    )
    def set_provider(provider_id: str, enabled: bool | None = None, rpm: int | None = None,
                     rpd: int | None = None, tpm: int | None = None, tpd: int | None = None,
                     model: str | None = None, ctx: Any = None) -> dict[str, Any]:
        provider = runtime.settings.provider(provider_id)
        if provider is None:
            return {"ok": False, "error": f"Unknown provider '{provider_id}'."}
        if enabled is not None:
            provider.enabled = enabled
        for name, value in (("rpm", rpm), ("rpd", rpd), ("tpm", tpm), ("tpd", tpd)):
            if value is not None:
                setattr(provider, name, value)
        if model:
            provider.model = model
        runtime.settings.save(runtime.paths)
        runtime.ledger.clear(provider_id)
        return {"ok": True, "provider": {
            "id": provider.id, "enabled": provider.enabled, "model": provider.model,
            "rpm": provider.rpm, "rpd": provider.rpd, "tpm": provider.tpm, "tpd": provider.tpd,
        }}

    @registry.tool(
        "agents.add_provider",
        "Register another model provider at runtime: any OpenAI-compatible endpoint with a base "
        "URL, API key and model id, plus its quota limits.",
        obj(
            {
                "id": prop("string", "Short id, e.g. 'groq' or 'my_gateway'."),
                "label": prop("string", "Display name."),
                "base_url": prop("string", "OpenAI-compatible base URL ending in /v1."),
                "api_key": prop("string", "Secret key (stored locally, never logged)."),
                "model": prop("string", "Default model id."),
                "audio_model": prop("string", "Realtime/audio model id, if any."),
                "tier": prop("string", "local | economy | standard | frontier"),
                "rpm": prop("integer", "Requests per minute."),
                "rpd": prop("integer", "Requests per day."),
                "tpm": prop("integer", "Tokens per minute."),
                "tpd": prop("integer", "Tokens per day."),
                "supports_tools": prop("boolean", "Supports function calling."),
                "supports_vision": prop("boolean", "Accepts images."),
            },
            ["id", "base_url", "model"],
        ),
        category="agents", permission="sensitive",
    )
    def add_provider(id: str, base_url: str, model: str, label: str | None = None,
                     api_key: str = "", audio_model: str = "", tier: str = "standard",
                     rpm: int = 0, rpd: int = 0, tpm: int = 0, tpd: int = 0,
                     supports_tools: bool = True, supports_vision: bool = False,
                     ctx: Any = None) -> dict[str, Any]:
        from ..config import ProviderConfig

        if runtime.settings.provider(id) is not None:
            return {"ok": False, "error": f"A provider with id '{id}' already exists."}
        provider = ProviderConfig(
            id=id, label=label or id.title(), base_url=base_url, api_key=api_key, model=model,
            audio_model=audio_model, tier=tier, rpm=rpm, rpd=rpd, tpm=tpm, tpd=tpd,
            supports_tools=supports_tools, supports_vision=supports_vision,
        )
        runtime.settings.providers.append(provider)
        runtime.settings.save(runtime.paths)
        return {"ok": True, "provider_id": provider.id, "registered": True}

    # ==================================================================
    # Memory
    # ==================================================================
    @registry.tool(
        "memory.remember",
        "Store something durable: a user preference, a folder layout you mapped, a credential "
        "location, a decision and its reason, a system's shape. Scope 'global' makes it visible to "
        "every agent; 'agent' keeps it private; 'team' shares it with your team.",
        obj(
            {
                "content": prop("string", "The fact, written so a stranger could use it."),
                "kind": prop("string", "identity | episodic | semantic | procedural",
                             enum=["identity", "episodic", "semantic", "procedural"]),
                "importance": prop("number", "0-1; higher is retrieved more readily."),
                "scope": prop("string", "agent | team | global", enum=["agent", "team", "global"]),
                "tags": prop("array", "Search tags.", items={"type": "string"}),
            },
            ["content"],
        ),
        category="memory", permission="safe",
    )
    def remember(content: str, kind: str = "semantic", importance: float = 0.6,
                 scope: str | None = None, tags: list[str] | None = None,
                 ctx: Any = None) -> dict[str, Any]:
        agent = _agent(ctx)
        if agent is not None:
            memory_id = agent.remember(
                content, kind=kind, importance=importance, scope=scope, tags=tags or ()
            )
        else:
            memory_id = new_id("mem")
            runtime.store.remember(MemoryRecord(
                id=memory_id, agent_id=ctx.agent_id, kind=kind, content=content,
                tags=tags or [], importance=importance, scope=scope or "agent",
            ))
        return {"stored": True, "id": memory_id, "kind": kind, "scope": scope or "agent"}

    @registry.tool(
        "memory.recall",
        "Search memory. Always do this before expensive or unfamiliar work: the answer may already "
        "be there, along with the user's preferences.",
        obj(
            {
                "query": prop("string", "What you are looking for."),
                "kinds": prop("array", "Restrict to memory kinds.", items={"type": "string"}),
                "limit": prop("integer", "How many memories."),
            },
            ["query"],
        ),
        category="memory", permission="safe",
    )
    def recall(query: str, kinds: list[str] | None = None, limit: int = 8,
               ctx: Any = None) -> dict[str, Any]:
        memories = runtime.store.recall(
            query, agent_id=ctx.agent_id, kinds=kinds, limit=limit
        )
        return {"memories": [
            {"id": memory.id, "kind": memory.kind, "content": memory.content[:1500],
             "scope": memory.scope, "importance": memory.importance,
             "age_hours": round((__import__("time").time() - memory.created_at) / 3600, 1)}
            for memory in memories
        ]}

    @registry.tool(
        "memory.list",
        "Browse stored memories without a search query.",
        obj({"kind": prop("string", "Filter by kind."), "limit": prop("integer", "How many.")}),
        category="memory", permission="safe",
    )
    def list_memories(kind: str | None = None, limit: int = 50, ctx: Any = None) -> dict[str, Any]:
        memories = runtime.store.list_memories(agent_id=None, kind=kind, limit=limit)
        return {"count": len(memories), "memories": [
            {"id": memory.id, "agent_id": memory.agent_id, "kind": memory.kind,
             "content": memory.content[:600], "scope": memory.scope}
            for memory in memories
        ]}

    @registry.tool(
        "memory.forget",
        "Delete a memory that is wrong or obsolete.",
        obj({"memory_id": prop("string", "Memory id.")}, ["memory_id"]),
        category="memory", permission="sensitive",
    )
    def forget(memory_id: str, ctx: Any = None) -> dict[str, Any]:
        runtime.store.forget(memory_id)
        return {"forgotten": memory_id}

    # ==================================================================
    # System
    # ==================================================================
    @registry.tool(
        "system.status",
        "Report the health of the whole runtime: agents, teams, providers, quota, hardware, "
        "plugins, skills and memory size.",
        obj({}), category="system", permission="safe",
    )
    def status(ctx: Any = None) -> dict[str, Any]:
        return runtime.status()

    @registry.tool(
        "system.notify",
        "Send the user a clearly marked notification in the interface, and optionally speak it.",
        obj(
            {
                "message": prop("string", "What to tell the user."),
                "speak": prop("boolean", "Also say it out loud."),
                "severity": prop("string", "info | warning | critical"),
            },
            ["message"],
        ),
        category="system", permission="safe",
    )
    def notify(message: str, speak: bool = False, severity: str = "info",
               ctx: Any = None) -> dict[str, Any]:
        return runtime.notify(message, speak=speak, severity=severity)

    @registry.tool(
        "system.permissions",
        "Check or change the permission posture: the mode (ask/auto/deny) and which tools require "
        "user confirmation.",
        obj(
            {
                "mode": prop("string", "ask | auto | deny"),
                "require_confirmation_for": prop("array", "Tool name patterns.",
                                                 items={"type": "string"}),
            },
        ),
        category="system", permission="sensitive",
    )
    def permissions(mode: str | None = None,
                    require_confirmation_for: list[str] | None = None,
                    ctx: Any = None) -> dict[str, Any]:
        if mode:
            runtime.settings.permission_mode = mode
        if require_confirmation_for is not None:
            runtime.settings.require_confirmation_for = list(require_confirmation_for)
        if mode or require_confirmation_for is not None:
            runtime.settings.save(runtime.paths)
        return {
            "mode": runtime.settings.permission_mode,
            "require_confirmation_for": runtime.settings.require_confirmation_for,
            "fs_allowlist": runtime.guard.describe(),
        }
