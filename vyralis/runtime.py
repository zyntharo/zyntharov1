"""The runtime container.

One object that owns every subsystem and their wiring, so the server, the CLI
and the tests all boot the same system:

    settings -> store -> ledger -> router -> client
                      -> tool registry + capability services
                      -> plugin manager, skill library, voice
                      -> orchestrator (main agent) + manager (watchdog)

Boot is idempotent and shutdown is total: nothing keeps clicking, sampling or
calling a model after the window closes.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any

from . import CODENAME, TAGLINE, __version__
from .agents import ManagerAgent, Orchestrator
from .bus import BUS, EventType
from .config import Paths, Settings, paths as default_paths, settings as default_settings
from .llm import ModelRouter, ProviderClient, QuotaLedger
from .memory.store import MemoryStore
from .plugins import PluginManager
from .safety.permissions import PathGuard, Policy
from .skills import SkillLibrary
from .tools import Services, ToolRegistry, build_toolkit
from .voice import VoiceService

log = logging.getLogger("vyralis.runtime")


@dataclass
class RuntimeInfo:
    version: str = __version__
    codename: str = CODENAME
    tagline: str = TAGLINE
    started_at: float = field(default_factory=time.time)
    platform: str = ""


class Runtime:
    """Holds the live system."""

    def __init__(
        self,
        settings: Settings | None = None,
        paths: Paths | None = None,
        *,
        registry=None,
        client: ProviderClient | None = None,
    ) -> None:
        self.settings = settings or default_settings()
        self.paths = paths or default_paths()
        self.version = __version__
        self.info = RuntimeInfo(platform=__import__("platform").platform())

        # Core stores and model plumbing.
        self.store = MemoryStore(self.paths.db)
        self.ledger = QuotaLedger(self.store, self.settings)
        self.router = ModelRouter(self.settings, self.ledger)
        # Each runtime owns its client so tests and multi-instance use never
        # share connection pools or provider state.
        self.client = client or ProviderClient(timeout=120.0)

        # Safety.
        self.guard = PathGuard(self.settings)
        self.policy = Policy(self.settings)

        # Capabilities + tools. A fresh registry per runtime keeps the process
        # free of global mutable state (important for tests and for reloads).
        self.services = Services()
        self.registry = registry if registry is not None else ToolRegistry()
        self.registry, self.services = build_toolkit(
            self.settings, self.paths, services=self.services, registry=self.registry
        )

        # Voice.
        self.services.voice = self.services.voice or VoiceService(self.settings, self.paths.artifacts)
        self.voice: VoiceService = self.services.voice

        # Self-extension.
        self.plugins = PluginManager(registry=self.registry, settings=self.settings,
                                     paths=self.paths, store=self.store, bus=BUS)
        self.skills = SkillLibrary(self.store, self.registry, self.settings)

        # Agents.
        self.orchestrator = Orchestrator(self)
        self.manager = ManagerAgent(self, self.orchestrator)

        # Late-bound tool registrations that need the runtime itself.
        from .agents import tools as agent_tools
        from .plugins import tools as plugin_tools
        from .skills import register as register_skill_tools

        agent_tools.register(self.registry, self, self.orchestrator, self.manager)
        register_skill_tools(self.registry, self.settings, self.skills)
        plugin_tools.register(self.registry, self.settings, self.plugins)

        self._booted = False
        self._hardware_task: asyncio.Task[Any] | None = None
        self._manager_task: asyncio.Task[Any] | None = None
        self._notifications: list[dict[str, Any]] = []

    # -- lifecycle ------------------------------------------------------
    async def boot(self, *, start_watchdogs: bool = True) -> "Runtime":
        if self._booted:
            return self
        loaded = self.plugins.load_all()
        failures = [item for item in loaded if not item.get("ok")]
        if failures:
            log.warning("%d plugin(s) failed to load", len(failures))
        self.orchestrator.ensure_main()
        self.manager.ensure_agent()
        if start_watchdogs:
            self._hardware_task = self.services.hardware.start_watch()
            self._manager_task = self.manager.start()
        self._booted = True
        BUS.publish(EventType.LOG, {
            "level": "INFO", "logger": "runtime",
            "message": f"Vyralis {self.version} ({CODENAME}) online: "
                       f"{len(self.registry.names())} tools, "
                       f"{len(self.settings.providers)} provider(s), "
                       f"{len(self.plugins.status())} plugin(s)",
        })
        log.info("runtime booted: %d tools, %d providers",
                 len(self.registry.names()), len(self.settings.providers))
        return self

    async def shutdown(self) -> dict[str, Any]:
        await self.orchestrator.shutdown()
        await self.manager.stop()
        await self.services.hardware.stop_watch()
        if self.services.browser is not None:
            try:
                await self.services.browser.stop()
            except Exception:  # noqa: BLE001
                pass
        try:
            await self.client.aclose()
        except Exception:  # noqa: BLE001
            pass
        self.store.prune_traces()
        self.store.prune_quota(time.time() - 86400 * 7)
        self.store.close()
        self._booted = False
        return {"stopped": True}

    @property
    def permission_mode(self) -> str:
        return self.settings.permission_mode

    # -- confirmations --------------------------------------------------
    async def confirm(self, tool: str, args: dict[str, Any], reason: str) -> bool:
        """Permission callback handed to every tool context."""
        return await self.orchestrator.request_confirmation(
            tool, args, reason, agent_id=self.orchestrator.main.id if self.orchestrator.main else None
        )

    # -- notifications --------------------------------------------------
    def notify(self, message: str, *, speak: bool = False, severity: str = "info") -> dict[str, Any]:
        entry = {"message": message, "severity": severity, "ts": time.time()}
        self._notifications.append(entry)
        del self._notifications[:-100]
        BUS.publish(EventType.LOG if severity == "info" else EventType.ERROR, {
            "level": severity.upper(), "logger": "notify", "message": message,
        })
        if speak and self.voice is not None:
            try:
                asyncio.get_running_loop().create_task(self.voice.speak(message))
            except RuntimeError:
                pass
        return entry

    def notifications(self, limit: int = 50) -> list[dict[str, Any]]:
        return self._notifications[-limit:]

    # -- status ---------------------------------------------------------
    def status(self) -> dict[str, Any]:
        hardware_verdict: dict[str, Any] = {"verdict": "unknown"}
        try:
            hardware_verdict = self.services.hardware.health_verdict()
        except Exception:  # noqa: BLE001
            pass
        return {
            "info": {
                "version": self.version, "codename": CODENAME, "tagline": TAGLINE,
                "started_at": self.info.started_at,
                "uptime_s": round(time.time() - self.info.started_at, 1),
                "platform": self.info.platform,
            },
            "agents": self.orchestrator.stats(),
            "model": self.router.headroom(),
            "providers": self.router.describe(),
            "hardware": hardware_verdict,
            "permissions": {
                "mode": self.settings.permission_mode,
                "fs_allowlist": self.guard.describe(),
                "require_confirmation_for": self.settings.require_confirmation_for,
            },
            "tools": {
                "count": len(self.registry.names()),
                "categories": {name: len(items) for name, items in self.registry.by_category().items()},
            },
            "services": self.services.available(),
            "memory": self.store.stats(),
            "plugins": self.plugins.status(),
            "skills": len(self.skills.list()),
            "voice": {"enabled": self.settings.voice_enabled, "engine": self.settings.voice_engine,
                      "capabilities": VoiceService.capabilities()},
            "capabilities": {
                "vision": self.services.vision.capabilities(),
                "computer": self.services.computer.capabilities(),
                "browser": self.services.browser.capabilities(),
                "office": self.services.office.capabilities(),
                "hardware": self.services.hardware.capabilities() if self.services.hardware else {},
            },
        }

    # -- convenience for the CLI ---------------------------------------
    def missing_setup(self) -> list[str]:
        """Human-readable list of what still needs configuring before first use."""
        gaps: list[str] = []
        if not self.settings.active_providers:
            gaps.append(
                "No model provider is configured. Add one in Settings -> Providers, or set "
                "VYRALIS_PRIMARY_BASE_URL / VYRALIS_PRIMARY_API_KEY / VYRALIS_PRIMARY_MODEL."
            )
        caps = self.services.browser.capabilities() if self.services.browser else {}
        if caps and not caps.get("playwright"):
            gaps.append("Browser control needs Playwright: pip install playwright")
        if not caps.get("installed_browsers", {}).get("chrome"):
            gaps.append("No Chrome/Edge detected - install one, or set VYRALIS_BROWSER_CHANNEL.")
        computer = self.services.computer.capabilities() if self.services.computer else {}
        if computer and not computer.get("pyautogui"):
            gaps.append(
                "Desktop mouse/keyboard control is unavailable: pip install pyautogui pillow pyperclip"
            )
        return gaps
