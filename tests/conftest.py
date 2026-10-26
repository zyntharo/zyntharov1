"""Shared test fixtures.

Every test gets its own data directory, its own runtime and a scripted model
client, so the suite never touches the developer's real Vyralis state and never
makes a network call.
"""

from __future__ import annotations

import asyncio
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

import pytest

from vyralis import config
from vyralis.config import ProviderConfig, Settings
from vyralis.llm.types import ChatMessage, LLMResponse, ToolCall, Usage


class FakeClient:
    """A model client that returns scripted responses in order.

    Each queued item is either a string (a plain assistant reply) or a
    ``(text, [tool calls])`` tuple. When the queue empties it returns a stop
    message, so an agent loop always terminates.
    """

    def __init__(self, script: Sequence[Any] | None = None) -> None:
        self.script: list[Any] = list(script or [])
        self.calls: list[dict[str, Any]] = []
        self.closed = False

    def queue(self, *items: Any) -> "FakeClient":
        self.script.extend(items)
        return self

    async def stream_chat(self, provider: ProviderConfig, model: str, messages: Sequence[ChatMessage],
                          *, tools=None, temperature: float = 0.3, max_tokens: int = 4096,
                          on_token=None, extra: dict[str, Any] | None = None) -> LLMResponse:
        self.calls.append({
            "provider": provider.id, "model": model,
            "messages": [message.to_wire() for message in messages],
            "tools": [tool.name for tool in tools or []],
            "has_tools": bool(tools),
        })
        item = self.script.pop(0) if self.script else "done"
        text, calls = (item if isinstance(item, tuple) else (item, []))
        if on_token and text:
            on_token(text)
        tool_calls = [
            ToolCall(id=f"call_{index}", name=name, arguments=args,
                     raw_arguments=json.dumps(args))
            for index, (name, args) in enumerate(calls)
        ]
        return LLMResponse(
            content=text or "", tool_calls=tool_calls,
            usage=Usage(tokens_in=120, tokens_out=40), model=model, provider_id=provider.id,
            finish_reason="tool_calls" if tool_calls else "stop",
        )

    async def chat(self, *args: Any, **kwargs: Any) -> LLMResponse:
        return await self.stream_chat(*args, **kwargs)

    async def list_models(self, provider: ProviderConfig) -> list[str]:
        return ["fake-model"]

    async def aclose(self) -> None:
        self.closed = True


@pytest.fixture(autouse=True)
def isolated_bus():
    """The event bus is process-wide; clear its replay buffer between tests so
    one test never consumes another's events."""
    from vyralis.bus import BUS

    BUS._history.clear()  # noqa: SLF001 - deliberate test isolation
    BUS._listeners.clear()  # noqa: SLF001
    BUS._subscribers.clear()  # noqa: SLF001
    yield
    BUS._history.clear()  # noqa: SLF001
    BUS._listeners.clear()  # noqa: SLF001
    BUS._subscribers.clear()  # noqa: SLF001


@dataclass
class Harness:
    runtime: Any
    client: FakeClient = field(default_factory=FakeClient)
    data_dir: Path = Path(".")

    @property
    def store(self) -> Any:
        return self.runtime.store

    async def ask(self, text: str) -> Any:
        return await self.runtime.orchestrator.handle_user(text, channel="test")


def make_settings(tmp_path: Path, *, permission_mode: str = "auto", providers: int = 1) -> Settings:
    config.reset(tmp_path / "data")
    settings = config.settings()
    settings.permission_mode = permission_mode
    settings.voice_enabled = False
    # Keep every test inside its own temp directory instead of the real home.
    settings.fs_allowlist = [str(tmp_path)]
    settings.providers = []
    for index in range(providers):
        settings.providers.append(ProviderConfig(
            id="primary" if index == 0 else f"backup{index}",
            label="Primary" if index == 0 else f"Backup {index}",
            base_url="https://example.invalid/v1",
            api_key="test-key",
            model="fake-model",
            tier="frontier" if index == 0 else "standard",
            priority=10 + index * 10,
            supports_tools=True,
            supports_vision=True,
            rpm=60,
            rpd=1000,
        ))
    config.set_settings(settings)
    return settings


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    return make_settings(tmp_path)


@pytest.fixture
def harness(tmp_path: Path) -> Any:
    """A booted runtime wired to a scripted model client."""

    async def build(**kwargs: Any) -> Harness:
        from vyralis.runtime import Runtime

        settings = make_settings(tmp_path, **kwargs)
        client = FakeClient()
        runtime = Runtime(settings, config.paths(), client=client)
        await runtime.boot(start_watchdogs=False)
        runtime.registry.set_parallelism(4)
        return Harness(runtime=runtime, client=client, data_dir=tmp_path)

    return build


@pytest.fixture
def runway(tmp_path: Path) -> Any:
    """Synchronous helper: a booted runtime without any model scripting."""
    from vyralis.runtime import Runtime

    settings = make_settings(tmp_path)
    runtime = Runtime(settings, config.paths(), client=FakeClient())
    return runtime



