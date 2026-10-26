"""Agent-facing plugin tools.

These are what make self-extension real: the agent can look for an existing
plugin, read how to build one, write the code, validate it, install it, and
then call the new capability in the same conversation.
"""

from __future__ import annotations

from typing import Any

from ..tools.registry import ToolRegistry, obj, prop
from .loader import PluginManager


def register(registry: ToolRegistry, settings: Any, manager: PluginManager) -> None:
    @registry.tool(
        "plugins.list",
        "List installed plugins with their tools and health. Check here first: an existing plugin "
        "may already do what you need.",
        obj({"include_errors": prop("boolean", "Include plugins that failed to load.")}),
        category="plugins", permission="safe",
    )
    def list_plugins(include_errors: bool = True, ctx: Any = None) -> dict[str, Any]:
        rows = manager.status()
        if not include_errors:
            rows = [row for row in rows if row.get("ok", True)]
        return {"count": len(rows), "plugins": rows}

    @registry.tool(
        "plugins.guidelines",
        "Read the contract for writing a Vyralis plugin: manifest fields, the register(api) "
        "signature, the tool decorator, and how to call existing capabilities. Call this before "
        "writing plugin code.",
        obj({}), category="plugins", permission="safe",
    )
    def guidelines(ctx: Any = None) -> dict[str, Any]:
        return {
            "layout": {
                "plugin.json": "manifest: id, name, version, description, entrypoint, tools, "
                               "category, permissions, requires",
                "plugin.py": "must define register(api) or a PLUGIN object with .register(api)",
                "README.md": "optional",
            },
            "api_surface": {
                "api.tool(name, description, parameters, permission=..., timeout=...)":
                    "decorator registering an agent tool; namespaced as <plugin_id>.<name>",
                "api.call(tool, **args)": "async; calls any existing Vyralis tool through the "
                                          "normal permission pipeline",
                "api.remember(content, kind=...)": "persist to long-term memory",
                "api.http(timeout)": "httpx client for network calls",
                "api.data_path(*parts)": "per-plugin writable data file path",
                "api.config() / api.save_config(dict)": "plugin-local settings",
                "api.emit(type, payload)": "publish an event to the HUD",
                "api.log": "logger",
            },
            "rules": [
                "Tools return plain JSON-serialisable data (dict, list, str, number, bool).",
                "Never block the event loop: long work belongs in a plain function; the registry "
                "runs synchronous handlers in a worker thread.",
                "Parameter schemas must be valid JSON Schema with 'type': 'object'.",
                "Raise exceptions with a clear message; the registry converts them into a tool "
                "error the agent can read and recover from.",
                "Prefer calling existing tools over reimplementing them.",
            ],
            "example": (
                "from typing import Any\n\n"
                "def register(api) -> None:\n"
                "    @api.tool('slugify', 'Convert text to a URL slug.',\n"
                "              {'type': 'object', 'properties': {'text': {'type': 'string'}},\n"
                "               'required': ['text'], 'additionalProperties': False})\n"
                "    def slugify(text: str, ctx: Any = None) -> dict[str, Any]:\n"
                "        return {'slug': text.lower().replace(' ', '-')}\n"
            ),
        }

    @registry.tool(
        "plugins.scaffold",
        "Create a new plugin folder from the built-in template, ready to be filled in. Use this "
        "for your very first plugin of a given kind; later, extend the existing plugin instead.",
        obj(
            {
                "id": prop("string", "Plugin id, e.g. 'invoice_tools'."),
                "name": prop("string", "Human-readable name."),
                "description": prop("string", "What it does and when to use it."),
                "tool_name": prop("string", "Name of the first tool to define."),
                "tool_description": prop("string", "What that first tool does."),
            },
            ["id", "name", "description"],
        ),
        category="plugins", permission="sensitive",
    )
    def scaffold(id: str, name: str, description: str, tool_name: str = "do_thing",
                 tool_description: str = "Describe what this tool does.",
                 ctx: Any = None) -> dict[str, Any]:
        path = manager.write_template(
            manager.paths.plugins, plugin_id=id, name=name, description=description,
            tool_name=tool_name, tool_description=tool_description,
        )
        return {
            "path": str(path),
            "next": "Write plugin.py with your tool implementations, then call plugins.install.",
        }

    @registry.tool(
        "plugins.install",
        "Install a plugin folder into Vyralis and load it immediately. Installing runs Python code "
        "with the same rights as Vyralis itself, so this is confirmed by the user by default.",
        obj(
            {
                "source": prop("string", "Absolute path to the plugin folder."),
                "trusted": prop("boolean", "Mark the plugin as reviewed by the user."),
            },
            ["source"],
        ),
        category="plugins", permission="destructive",
    )
    def install(source: str, trusted: bool = False, ctx: Any = None) -> dict[str, Any]:
        from pathlib import Path

        return manager.install(Path(source), trusted=trusted)

    @registry.tool(
        "plugins.generate",
        "Create and install a plugin directly from code you have written. This is the "
        "self-extension path: write real Python, validate it, load it, and use the new tool. "
        "Call plugins.guidelines first so the code matches the SDK.",
        obj(
            {
                "id": prop("string", "Plugin id (lowercase, underscores)."),
                "code": prop("string", "Full Python source defining register(api)."),
                "name": prop("string", "Human-readable name."),
                "description": prop("string", "What it does and when the agent should use it."),
                "tools": prop("array", "Tool names it registers.", items={"type": "string"}),
                "validate_only": prop("boolean", "Only check the code; do not install."),
            },
            ["id", "code"],
        ),
        category="plugins", permission="destructive",
    )
    def generate(id: str, code: str, name: str | None = None, description: str = "",
                 tools: list[str] | None = None, validate_only: bool = False,
                 ctx: Any = None) -> dict[str, Any]:
        return manager.scaffold_and_install(
            id, code, name=name, description=description, tools=tools or (),
            validate_only=validate_only,
        )

    @registry.tool(
        "plugins.validate",
        "Syntax-check and statically review generated plugin code before installing it.",
        obj({"code": prop("string", "Python source to check."), "id": prop("string", "Plugin id.")},
            ["code"]),
        category="plugins", permission="safe",
    )
    def validate(code: str, id: str = "generated_plugin", ctx: Any = None) -> dict[str, Any]:
        return manager.validate(code, plugin_id=id)

    @registry.tool(
        "plugins.reload",
        "Reload a plugin after editing its files, without restarting Vyralis.",
        obj({"id": prop("string", "Plugin id.")}, ["id"]),
        category="plugins", permission="sensitive",
    )
    def reload(id: str, ctx: Any = None) -> dict[str, Any]:
        return manager.reload(id)

    @registry.tool(
        "plugins.uninstall",
        "Unload a plugin, remove its tools and delete its folder.",
        obj({"id": prop("string", "Plugin id.")}, ["id"]),
        category="plugins", permission="destructive",
    )
    def uninstall(id: str, ctx: Any = None) -> dict[str, Any]:
        return manager.uninstall(id)
