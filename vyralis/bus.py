"""In-process event bus.

Every observable thing the runtime does is published here as an
:class:`Event` and fanned out to:

* WebSocket GUI clients (live HUD, wiring graph, speech state),
* the Manager agent's watchdog (quota, failures, hardware alerts),
* the persisted trace log (so a task can be replayed after a crash).

The bus keeps a bounded ring buffer so a GUI that connects late still gets the
recent context instead of a blank screen.
"""

from __future__ import annotations

import asyncio
import contextlib
import time
from collections import deque
from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, AsyncIterator, Callable


class EventType(str, Enum):
    """Canonical event types. The GUI switches on these strings."""

    # agent lifecycle
    AGENT_SPAWNED = "agent.spawned"
    AGENT_STATE = "agent.state"
    AGENT_REPORT = "agent.report"
    AGENT_RETIRED = "agent.retired"
    TEAM_FORMED = "team.formed"

    # cognition
    THOUGHT = "agent.thought"
    TOKEN = "agent.token"
    PLAN = "agent.plan"
    SPEECH_START = "voice.speak.start"
    SPEECH_END = "voice.speak.end"
    LISTEN_START = "voice.listen.start"
    LISTEN_END = "voice.listen.end"
    USER_INPUT = "user.input"

    # actions
    TOOL_CALL = "tool.call"
    TOOL_RESULT = "tool.result"
    TOOL_DENIED = "tool.denied"
    CONFIRM_REQUEST = "permission.request"
    CONFIRM_RESULT = "permission.result"

    # infrastructure
    MEMORY_WRITE = "memory.write"
    MEMORY_READ = "memory.read"
    QUOTA_UPDATE = "quota.update"
    QUOTA_EVENT = "quota.event"
    MODEL_SELECTED = "model.selected"
    PROVIDER_FAILOVER = "provider.failover"
    HARDWARE_SAMPLE = "hardware.sample"
    HARDWARE_ALERT = "hardware.alert"
    PLUGIN_INSTALLED = "plugin.installed"
    PLUGIN_LOADED = "plugin.loaded"
    PLUGIN_ERROR = "plugin.error"
    BROWSER_SESSION = "browser.session"
    BROWSER_TAB = "browser.tab"
    WHATSAPP_STATE = "whatsapp.state"
    LOG = "log"
    ERROR = "error"


@dataclass(slots=True)
class Event:
    type: str
    payload: dict[str, Any] = field(default_factory=dict)
    agent_id: str | None = None
    task_id: str | None = None
    ts: float = field(default_factory=time.time)
    seq: int = 0

    def to_json(self) -> dict[str, Any]:
        data = asdict(self)
        return data


class EventBus:
    """Async fan-out with history replay and a sync publish escape hatch."""

    def __init__(self, history: int = 400) -> None:
        self._subscribers: set[asyncio.Queue[Event]] = set()
        self._history: deque[Event] = deque(maxlen=history)
        self._seq = 0
        self._listeners: list[Callable[[Event], None]] = []
        self._lock = asyncio.Lock()

    # -- subscription ---------------------------------------------------
    @contextlib.asynccontextmanager
    async def subscribe(self, *, replay: int = 60) -> AsyncIterator[asyncio.Queue[Event]]:
        queue: asyncio.Queue[Event] = asyncio.Queue(maxsize=1024)
        if replay:
            for event in list(self._history)[-replay:]:
                with contextlib.suppress(asyncio.QueueFull):
                    queue.put_nowait(event)
        async with self._lock:
            self._subscribers.add(queue)
        try:
            yield queue
        finally:
            async with self._lock:
                self._subscribers.discard(queue)

    def add_listener(self, callback: Callable[[Event], None]) -> None:
        """Register a synchronous observer (used by the Manager watchdog)."""
        self._listeners.append(callback)

    def remove_listener(self, callback: Callable[[Event], None]) -> None:
        with contextlib.suppress(ValueError):
            self._listeners.remove(callback)

    # -- publishing -----------------------------------------------------
    def publish(self, type: EventType | str, payload: dict[str, Any] | None = None, **meta: Any) -> Event:
        self._seq += 1
        event = Event(
            type=type.value if isinstance(type, EventType) else type,
            payload=payload or {},
            agent_id=meta.get("agent_id"),
            task_id=meta.get("task_id"),
            seq=self._seq,
        )
        self._history.append(event)
        for queue in tuple(self._subscribers):
            try:
                queue.put_nowait(event)
            except asyncio.QueueFull:
                # A slow GUI must never stall the agent runtime.
                with contextlib.suppress(asyncio.QueueEmpty):
                    queue.get_nowait()
                with contextlib.suppress(asyncio.QueueFull):
                    queue.put_nowait(event)
        for listener in tuple(self._listeners):
            try:
                listener(event)
            except Exception:  # noqa: BLE001 - observers must not break the bus
                pass
        return event

    async def stream(self, *, replay: int = 60) -> AsyncIterator[Event]:
        async with self.subscribe(replay=replay) as queue:
            while True:
                yield await queue.get()

    def recent(self, limit: int = 100) -> list[dict[str, Any]]:
        return [event.to_json() for event in list(self._history)[-limit:]]


# The runtime uses one bus for the whole process; tests build their own.
BUS = EventBus()


def bus() -> EventBus:
    return BUS
