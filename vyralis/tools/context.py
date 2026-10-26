"""Tool execution context and the shared service container.

Kept separate from the registry so capability modules can import it without
creating an import cycle. Everything a tool needs is reachable through
``ctx`` - and nothing else - which makes tools trivially testable with a fake
context.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Awaitable, Callable, Protocol

from ..config import Settings
from ..memory.store import MemoryStore

Confirmer = Callable[[str, dict[str, Any], str], Awaitable[bool]]


class Emitter(Protocol):
    def emit(self, message: str, **extra: Any) -> None: ...


@dataclass
class Services:
    """Lazily-attached runtime singletons.

    Attributes are ``None`` until the runtime wires them, so a tool that needs
    the browser can fail with a clean, actionable message instead of an
    ImportError when Playwright is not installed on this machine.
    """

    computer: Any = None       # vyralis.capabilities.computer.ComputerController
    browser: Any = None        # vyralis.capabilities.browser.BrowserController
    vision: Any = None         # vyralis.capabilities.vision.VisionEngine
    office: Any = None         # vyralis.capabilities.office.OfficeController
    hardware: Any = None       # vyralis.capabilities.hardware.HardwareMonitor
    whatsapp: Any = None       # vyralis.capabilities.whatsapp.WhatsAppBridge
    plugins: Any = None        # vyralis.plugins.loader.PluginManager
    orchestrator: Any = None   # vyralis.agents.orchestrator.Orchestrator
    voice: Any = None          # vyralis.voice.VoiceService
    artifacts_dir: Path | None = None

    def require(self, name: str) -> Any:
        value = getattr(self, name, None)
        if value is None:
            raise RuntimeError(
                f"The '{name}' subsystem is not available in this install. "
                f"Install the matching extra (pip install 'vyralis[{name}]') and retry."
            )
        return value

    def available(self) -> list[str]:
        return [
            name for name in ("computer", "browser", "vision", "office", "hardware",
                              "whatsapp", "plugins", "orchestrator", "voice")
            if getattr(self, name, None) is not None
        ]


@dataclass
class ToolContext:
    """Per-call execution context handed to every tool handler."""

    agent_id: str
    store: MemoryStore
    settings: Settings
    services: Services = field(default_factory=Services)
    # Decides whether a tool may run and whether a human must approve it first.
    policy: Any = None
    confirm: Confirmer | None = None
    allowed_tools: set[str] | None = None   # None = all tools this agent may use
    denied_tools: set[str] = field(default_factory=set)
    task_id: str | None = None
    emit: Emitter | None = None
    # Per-agent scratch space (browser handles, last screenshot, ...).
    scratch: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        # Fail closed: every context gets a policy even if the caller forgot.
        if self.policy is None:
            from ..safety.permissions import Policy

            self.policy = Policy(self.settings)

    async def request_confirmation(self, tool: str, args: dict[str, Any], reason: str) -> bool:
        if self.confirm is None:
            # No interactive channel available (headless test / CI): fail safe.
            return False
        return await self.confirm(tool, args, reason)

    def note(self, message: str) -> None:
        if self.emit is not None:
            self.emit(message, agent_id=self.agent_id)
