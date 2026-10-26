"""Plugin SDK.

A plugin is a folder with a ``plugin.json`` manifest and a Python entrypoint.
The entrypoint receives a :class:`PluginAPI` and registers tools; from then on
those tools are indistinguishable from built-in ones to the agent, the
permission system and the GUI.

Security posture, stated plainly: plugins are **in-process Python**. Installing
one runs code with the same rights as Vyralis itself. That is why installation
is a ``destructive`` permission, requires human confirmation by default, records
a content hash, and can be pinned as trusted. A plugin can only call other
tools through :meth:`PluginAPI.call`, which re-enters the central registry and
therefore the full permission pipeline - plugins do not get a side door.
"""

from __future__ import annotations

import hashlib
import json
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Sequence

log = logging.getLogger("vyralis.plugins")


@dataclass
class PluginManifest:
    id: str
    name: str
    version: str = "0.1.0"
    description: str = ""
    author: str = "Vyralis"
    entrypoint: str = "plugin.py"
    tools: list[str] = field(default_factory=list)
    permissions: list[str] = field(default_factory=list)
    requires: list[str] = field(default_factory=list)
    category: str = "plugin"
    # Whether the plugin was authored by the agent itself at runtime.
    generated: bool = False
    trusted: bool = False

    @classmethod
    def from_dict(cls, raw: dict[str, Any], *, fallback_id: str = "") -> "PluginManifest":
        return cls(
            id=str(raw.get("id") or fallback_id),
            name=str(raw.get("name") or fallback_id),
            version=str(raw.get("version") or "0.1.0"),
            description=str(raw.get("description") or ""),
            author=str(raw.get("author") or "Vyralis"),
            entrypoint=str(raw.get("entrypoint") or "plugin.py"),
            tools=list(raw.get("tools") or []),
            permissions=list(raw.get("permissions") or []),
            requires=list(raw.get("requires") or []),
            category=str(raw.get("category") or "plugin"),
            generated=bool(raw.get("generated", False)),
            trusted=bool(raw.get("trusted", False)),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "version": self.version,
            "description": self.description, "author": self.author,
            "entrypoint": self.entrypoint, "tools": self.tools,
            "permissions": self.permissions, "requires": self.requires,
            "category": self.category, "generated": self.generated, "trusted": self.trusted,
        }


class PluginAPI:
    """Everything a plugin is allowed to touch."""

    def __init__(
        self,
        manifest: PluginManifest,
        registry: Any,
        *,
        settings: Any,
        paths: Any,
        store: Any,
        bus: Any,
        data_dir: Path,
    ) -> None:
        self.manifest = manifest
        self.registry = registry
        self.settings = settings
        self.paths = paths
        self.store = store
        self.bus = bus
        self.data_dir = data_dir
        self.log = logging.getLogger(f"vyralis.plugin.{manifest.id}")
        self._registered: list[str] = []

    # -- tool registration ----------------------------------------------
    def tool(
        self,
        name: str,
        description: str,
        parameters: dict[str, Any] | None = None,
        *,
        permission: str = "safe",
        timeout: float = 120.0,
    ) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
        """Register a tool. The name is namespaced as ``<plugin_id>.<name>`` unless
        it already contains a dot."""
        full_name = name if "." in name else f"{self.manifest.id}.{name}"
        schema = parameters or {"type": "object", "properties": {}, "additionalProperties": False}

        def decorator(handler: Callable[..., Any]) -> Callable[..., Any]:
            self.registry.register(
                _spec(full_name, description, schema, category=self.manifest.category,
                      permission=permission),
                handler, timeout=timeout, overwrite=True, tags=(f"plugin:{self.manifest.id}",),
            )
            self._registered.append(full_name)
            return handler

        return decorator

    @property
    def registered_tools(self) -> list[str]:
        return list(self._registered)

    # -- controlled access to the rest of the runtime --------------------
    async def call(self, tool: str, **args: Any) -> Any:
        """Call another Vyralis tool, going through the normal permission gate."""
        from ..tools.context import ToolContext

        inner = ToolContext(
            agent_id=f"plugin:{self.manifest.id}",
            store=self.store,
            settings=self.settings,
        )
        result = await self.registry.execute(tool, args, inner)
        if not result.ok:
            raise RuntimeError(f"{tool} failed: {result.error}")
        return result.data

    def remember(self, content: str, *, kind: str = "semantic", importance: float = 0.5) -> str:
        from ..memory.store import MemoryRecord, new_id

        memory_id = new_id("mem")
        self.store.remember(MemoryRecord(
            id=memory_id, agent_id=f"plugin:{self.manifest.id}", kind=kind,
            content=content, importance=importance, scope="global", source=self.manifest.id,
        ))
        return memory_id

    def emit(self, type_: str, payload: dict[str, Any]) -> None:
        self.bus.publish(type_, payload)

    def http(self, timeout: float = 30.0) -> Any:
        """An httpx client for network calls."""
        import httpx

        return httpx.Client(timeout=timeout, follow_redirects=True)

    def data_path(self, *parts: str) -> Path:
        path = self.data_dir.joinpath(*parts)
        path.parent.mkdir(parents=True, exist_ok=True)
        return path

    def config(self) -> dict[str, Any]:
        """Plugin-specific settings stored in ``data/config.json``."""
        path = self.data_dir / "config.json"
        if path.exists():
            try:
                return json.loads(path.read_text("utf-8"))
            except (OSError, json.JSONDecodeError):
                return {}
        return {}

    def save_config(self, values: dict[str, Any]) -> None:
        (self.data_dir / "config.json").write_text(json.dumps(values, indent=2), "utf-8")


def _spec(name: str, description: str, parameters: dict[str, Any], *,
          category: str, permission: str) -> Any:
    from ..llm.types import ToolSpec

    return ToolSpec(name=name, description=description, parameters=parameters,
                    category=category, permission=permission)


@dataclass
class LoadedPlugin:
    manifest: PluginManifest
    path: Path
    module: Any = None
    tools: list[str] = field(default_factory=list)
    loaded_at: float = field(default_factory=time.time)
    error: str = ""
    digest: str = ""

    @property
    def ok(self) -> bool:
        return not self.error

    def to_json(self) -> dict[str, Any]:
        return {
            "id": self.manifest.id, "name": self.manifest.name,
            "version": self.manifest.version, "description": self.manifest.description,
            "author": self.manifest.author, "path": str(self.path),
            "tools": self.tools, "loaded_at": self.loaded_at, "ok": self.ok,
            "error": self.error, "digest": self.digest, "generated": self.manifest.generated,
            "trusted": self.manifest.trusted, "category": self.manifest.category,
        }


def digest_directory(path: Path) -> str:
    """Stable content hash of a plugin folder, used to detect tampering."""
    hasher = hashlib.sha256()
    for file in sorted(path.rglob("*")):
        if file.is_file() and not file.name.endswith((".pyc", ".pyo")):
            hasher.update(str(file.relative_to(path)).encode())
            hasher.update(file.read_bytes())
    return hasher.hexdigest()[:32]
