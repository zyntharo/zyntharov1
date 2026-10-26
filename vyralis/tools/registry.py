"""Tool registry.

Tools are the *only* way an agent touches the world. Each tool carries

* a JSON schema (what the model sees),
* a permission class (``safe`` | ``sensitive`` | ``destructive``),
* a handler (sync or async).

The registry owns the execution pipeline: authorise -> run (off the event loop
for blocking work) -> time-box -> convert exceptions into structured results ->
publish events for the HUD. Handlers therefore never need to worry about
safety, timeouts or logging.
"""

from __future__ import annotations

import asyncio
import inspect
import logging
import time
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Iterable, Sequence

from ..bus import BUS, EventType
from ..llm.types import ToolSpec
from .context import ToolContext

log = logging.getLogger("vyralis.tools")

Handler = Callable[..., Any]


# ---------------------------------------------------------------------------
# Schema helpers (terse JSON-schema authoring for tool definitions)
# ---------------------------------------------------------------------------
def prop(kind: str, desc: str, **extra: Any) -> dict[str, Any]:
    return {"type": kind, "description": desc, **extra}


def obj(properties: dict[str, Any], required: Sequence[str] = (), **extra: Any) -> dict[str, Any]:
    schema: dict[str, Any] = {
        "type": "object",
        "properties": properties,
        "additionalProperties": False,
    }
    if required:
        schema["required"] = list(required)
    schema.update(extra)
    return schema


# ---------------------------------------------------------------------------
# Results
# ---------------------------------------------------------------------------
@dataclass
class ToolResult:
    ok: bool
    tool: str
    data: Any = None
    error: str = ""
    duration_ms: int = 0
    artifacts: list[str] = field(default_factory=list)
    # Set when the agent should look at a screenshot before continuing.
    image: str | None = None
    meta: dict[str, Any] = field(default_factory=dict)

    def to_model_text(self, limit: int = 6000) -> str:
        """Compact textual form fed back to the model."""
        if not self.ok:
            return f"ERROR: {self.error}"
        import json

        if isinstance(self.data, str):
            text = self.data
        else:
            try:
                text = json.dumps(self.data, ensure_ascii=False, default=str)
            except (TypeError, ValueError):
                text = str(self.data)
        if len(text) > limit:
            text = text[:limit] + f"\n... [truncated, {len(text)} chars total]"
        return text

    def to_json(self) -> dict[str, Any]:
        return {
            "ok": self.ok, "tool": self.tool, "error": self.error,
            "duration_ms": self.duration_ms, "artifacts": self.artifacts,
            "meta": self.meta, "has_image": bool(self.image),
        }


@dataclass
class Tool:
    spec: ToolSpec
    handler: Handler
    timeout: float = 120.0
    needs_thread: bool = True
    tags: tuple[str, ...] = ()

    @property
    def name(self) -> str:
        return self.spec.name


class ToolNotFound(KeyError):
    pass


class ToolRegistry:
    """Name -> :class:`Tool`, with the execution pipeline."""

    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}
        self._max_parallel = 4
        self._sem: asyncio.Semaphore | None = None

    # -- registration ---------------------------------------------------
    def register(
        self,
        spec: ToolSpec,
        handler: Handler,
        *,
        timeout: float = 120.0,
        needs_thread: bool | None = None,
        tags: Sequence[str] = (),
        overwrite: bool = False,
    ) -> Tool:
        if spec.name in self._tools and not overwrite:
            raise ValueError(f"tool '{spec.name}' is already registered")
        if needs_thread is None:
            needs_thread = not inspect.iscoroutinefunction(handler)
        tool = Tool(spec=spec, handler=handler, timeout=timeout,
                    needs_thread=needs_thread, tags=tuple(tags))
        self._tools[spec.name] = tool
        return tool

    def tool(
        self,
        name: str,
        description: str,
        parameters: dict[str, Any],
        *,
        category: str = "general",
        permission: str = "safe",
        requires_vision: bool = False,
        timeout: float = 120.0,
        tags: Sequence[str] = (),
        overwrite: bool = False,
    ) -> Callable[[Handler], Handler]:
        """Decorator form: ``@registry.tool("files.read", "...", schema)``."""

        def decorator(handler: Handler) -> Handler:
            self.register(
                ToolSpec(
                    name=name, description=description, parameters=parameters,
                    category=category, permission=permission, requires_vision=requires_vision,
                ),
                handler, timeout=timeout, tags=tags, overwrite=overwrite,
            )
            return handler

        return decorator

    def unregister_prefix(self, prefix: str) -> int:
        """Remove tools belonging to a plugin (or a whole namespace)."""
        doomed = [name for name in self._tools if name.startswith(prefix)]
        for name in doomed:
            self._tools.pop(name, None)
        return len(doomed)

    # -- introspection --------------------------------------------------
    def get(self, name: str) -> Tool:
        try:
            return self._tools[name]
        except KeyError as exc:
            raise ToolNotFound(name) from exc

    def has(self, name: str) -> bool:
        return name in self._tools

    def names(self) -> list[str]:
        return sorted(self._tools)

    def all(self) -> list[Tool]:
        return [self._tools[name] for name in self.names()]

    def by_category(self) -> dict[str, list[Tool]]:
        out: dict[str, list[Tool]] = {}
        for tool in self.all():
            out.setdefault(tool.spec.category, []).append(tool)
        return out

    def specs(self, *, allow: Iterable[str] | None = None, deny: Iterable[str] | None = None,
              categories: Iterable[str] | None = None) -> list[ToolSpec]:
        """Specs to advertise to a model, already filtered by permission."""
        allow_set = set(allow) if allow is not None else None
        deny_set = set(deny or ())
        category_set = set(categories) if categories else None
        out: list[ToolSpec] = []
        for tool in self.all():
            if allow_set is not None and tool.name not in allow_set:
                continue
            if tool.name in deny_set:
                continue
            if category_set is not None and tool.spec.category not in category_set:
                continue
            out.append(tool.spec)
        return out

    def describe(self) -> list[dict[str, Any]]:
        return [
            {
                "name": tool.name,
                "description": tool.spec.description,
                "category": tool.spec.category,
                "permission": tool.spec.permission,
                "parameters": tool.spec.parameters,
            }
            for tool in self.all()
        ]

    # -- execution ------------------------------------------------------
    def set_parallelism(self, value: int) -> None:
        self._max_parallel = max(1, value)
        self._sem = None

    def _semaphore(self) -> asyncio.Semaphore:
        if self._sem is None:
            self._sem = asyncio.Semaphore(self._max_parallel)
        return self._sem

    async def execute(self, name: str, args: dict[str, Any] | None, ctx: ToolContext) -> ToolResult:
        """Authorise and run one tool call. Never raises for tool-level errors."""
        args = args or {}
        started = time.perf_counter()

        try:
            tool = self.get(name)
        except ToolNotFound:
            return ToolResult(False, name, error=f"Unknown tool '{name}'.")

        # --- permission gate -------------------------------------------
        if ctx.allowed_tools is not None and name not in ctx.allowed_tools:
            BUS.publish(
                EventType.TOOL_DENIED,
                {"tool": name, "reason": "not in this agent's tool grant"},
                agent_id=ctx.agent_id, task_id=ctx.task_id,
            )
            return ToolResult(
                False, name,
                error=f"Permission denied: this agent is not granted '{name}'. "
                      f"Ask the main agent for the capability.",
            )
        if name in ctx.denied_tools:
            BUS.publish(
                EventType.TOOL_DENIED, {"tool": name, "reason": "explicitly revoked"},
                agent_id=ctx.agent_id, task_id=ctx.task_id,
            )
            return ToolResult(False, name, error=f"Permission denied: '{name}' was revoked for this agent.")

        # --- policy + human confirmation ------------------------------
        policy = getattr(ctx, "policy", None)
        if policy is not None:
            decision = policy.authorize(name, args)
            if not decision.allow:
                BUS.publish(
                    EventType.TOOL_DENIED, {"tool": name, "reason": decision.reason},
                    agent_id=ctx.agent_id, task_id=ctx.task_id,
                )
                return ToolResult(False, name, error=f"Blocked by policy: {decision.reason}")
            if not decision.ask and tool.spec.permission == "destructive":
                decision = policy.classify(name, tool.spec.permission)
            if decision.ask:
                BUS.publish(
                    EventType.CONFIRM_REQUEST,
                    {"tool": name, "args": _redact(args), "reason": decision.reason,
                     "permission": tool.spec.permission},
                    agent_id=ctx.agent_id, task_id=ctx.task_id,
                )
                approved = await ctx.request_confirmation(name, args, decision.reason)
                if not approved:
                    BUS.publish(
                        EventType.TOOL_DENIED,
                        {"tool": name, "reason": "the user did not approve this action"},
                        agent_id=ctx.agent_id, task_id=ctx.task_id,
                    )
                    return ToolResult(
                        False, name,
                        error=(
                            f"'{name}' was not approved. Do not retry it; tell the user what you "
                            f"wanted to do and why (reason given: {decision.reason})."
                        ),
                    )

        BUS.publish(
            EventType.TOOL_CALL,
            {"tool": name, "args": _redact(args), "permission": tool.spec.permission,
             "category": tool.spec.category},
            agent_id=ctx.agent_id, task_id=ctx.task_id,
        )

        # --- run -------------------------------------------------------
        try:
            async with self._semaphore():
                result = await self._invoke(tool, args, ctx)
        except asyncio.TimeoutError:
            result = ToolResult(False, name, error=f"Tool '{name}' timed out after {tool.timeout:.0f}s.")
        except Exception as exc:  # noqa: BLE001 - a tool must never kill the agent
            log.exception("tool %s failed", name)
            result = ToolResult(False, name, error=f"{type(exc).__name__}: {exc}")

        result.duration_ms = int((time.perf_counter() - started) * 1000)
        BUS.publish(
            EventType.TOOL_RESULT,
            {"tool": name, "ok": result.ok, "error": result.error[:300],
             "duration_ms": result.duration_ms, "artifacts": result.artifacts,
             "meta": _jsonable(result.meta)},
            agent_id=ctx.agent_id, task_id=ctx.task_id,
        )
        try:
            ctx.store.trace(
                "tool.result",
                {"tool": name, "ok": result.ok, "error": result.error[:300],
                 "duration_ms": result.duration_ms},
                agent_id=ctx.agent_id, task_id=ctx.task_id,
            )
        except Exception:  # noqa: BLE001
            pass
        return result

    async def _invoke(self, tool: Tool, args: dict[str, Any], ctx: ToolContext) -> ToolResult:
        if tool.needs_thread:
            raw = await asyncio.wait_for(
                asyncio.to_thread(tool.handler, ctx=ctx, **args), timeout=tool.timeout
            )
        else:
            outcome = tool.handler(ctx=ctx, **args)
            raw = await asyncio.wait_for(outcome, timeout=tool.timeout) if inspect.isawaitable(outcome) else outcome

        if isinstance(raw, ToolResult):
            return raw
        return ToolResult(True, tool.name, data=raw)

    async def execute_many(
        self, calls: Sequence[tuple[str, dict[str, Any]]], ctx: ToolContext
    ) -> list[ToolResult]:
        """Run independent calls concurrently (bounded by the semaphore)."""
        return list(await asyncio.gather(*(self.execute(name, args, ctx) for name, args in calls)))


def _redact(args: dict[str, Any], secret_keys: tuple[str, ...] = ("api_key", "token", "password",
                                                                  "secret", "authorization")) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in args.items():
        if any(secret in key.lower() for secret in secret_keys):
            out[key] = "***"
        elif isinstance(value, str) and len(value) > 2000:
            out[key] = value[:2000] + f"...(+{len(value) - 2000})"
        else:
            out[key] = value
    return out


def _jsonable(value: Any) -> Any:
    import json

    try:
        json.dumps(value)
        return value
    except (TypeError, ValueError):
        return str(value)[:2000]


# The process-wide registry. Capability modules register into it on import.
REGISTRY = ToolRegistry()


def registry() -> ToolRegistry:
    return REGISTRY
