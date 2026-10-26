"""Tool registry assembly.

:func:`build_toolkit` instantiates every capability controller, registers its
tools, and wires the resulting objects into a :class:`Services` container. The
runtime calls this once at boot; tests call it with a temporary data directory.

Capability modules import :mod:`vyralis.tools.registry`, so this package must
not import them at module scope - doing so creates a circular import. The
imports therefore live inside :func:`build_toolkit`.
"""

from __future__ import annotations

import logging
from typing import Any

from ..config import Paths, Settings
from .context import Services, ToolContext
from .registry import REGISTRY, ToolRegistry, ToolResult, obj, prop

log = logging.getLogger("vyralis.tools")

__all__ = [
    "REGISTRY",
    "Services",
    "ToolContext",
    "ToolRegistry",
    "ToolResult",
    "build_toolkit",
    "obj",
    "prop",
]


def build_toolkit(
    settings: Settings, paths: Paths, *, services: Services | None = None,
    registry: ToolRegistry | None = None,
) -> tuple[ToolRegistry, Services]:
    """Create every controller, register every tool, and return both."""
    from ..capabilities import (
        BrowserController,
        ComputerController,
        FileTools,
        HardwareMonitor,
        OfficeController,
        ShellController,
        VisionEngine,
        WhatsAppController,
    )
    from ..capabilities import browser as browser_module
    from ..capabilities import computer as computer_module
    from ..capabilities import files as files_module
    from ..capabilities import hardware as hardware_module
    from ..capabilities import office as office_module
    from ..capabilities import shell as shell_module
    from ..capabilities import vision as vision_module
    from ..capabilities import whatsapp as whatsapp_module
    from ..safety.permissions import PathGuard, Policy

    registry = registry if registry is not None else REGISTRY
    services = services or Services()
    guard = PathGuard(settings)
    policy = Policy(settings)

    # -- vision + computer ---------------------------------------------
    if services.vision is None:
        services.vision = VisionEngine(settings, paths.screenshots)
    if services.computer is None:
        services.computer = ComputerController(settings)
    vision_module.register(registry, settings, services.vision)
    computer_module.register(registry, settings, services.computer)

    # -- browser (shares vision + computer for chrome UI) ---------------
    if services.browser is None:
        services.browser = BrowserController(
            settings, profiles_dir=paths.profiles,
            downloads_dir=paths.artifacts / "downloads",
            computer=services.computer, vision=services.vision,
        )
    browser_module.register(registry, settings, services.browser)

    # -- files + shell --------------------------------------------------
    file_tools = FileTools(settings, guard)
    files_module.register(registry, settings, file_tools)
    shell_controller = ShellController(settings, policy=policy, guard=guard)
    shell_module.register(registry, settings, shell_controller)
    shell_module.register_kill_tool(registry)

    # -- office ---------------------------------------------------------
    if services.office is None:
        services.office = OfficeController(settings, guard)
    office_module.register(registry, settings, services.office)

    # -- hardware -------------------------------------------------------
    if services.hardware is None:
        services.hardware = HardwareMonitor(settings)
    hardware_module.register(registry, settings, services.hardware)

    # -- whatsapp -------------------------------------------------------
    if services.whatsapp is None:
        services.whatsapp = WhatsAppController(
            settings, services.browser, voice=services.voice, computer=services.computer
        )
    whatsapp_module.register(registry, settings, services.whatsapp)

    if services.artifacts_dir is None:
        services.artifacts_dir = paths.artifacts

    registry.set_parallelism(settings.max_parallel_tools)
    log.info("toolkit ready: %d tools across %d categories",
             len(registry.names()), len(registry.by_category()))
    return registry, services


def _unused(_: Any) -> None:  # pragma: no cover - typing anchor
    return None
