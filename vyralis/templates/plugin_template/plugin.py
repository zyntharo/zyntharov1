"""{{name}} - the canonical Vyralis plugin template.

The agent reads this file the first time it needs to write a plugin; after that
its own memory and previous plugins are the reference. Keep the
``register(api)`` contract: the loader calls it once, at load time.

Ways to reach the rest of the system (all permission-checked):
    api.call("files.read", path="...")      run any existing Vyralis tool
    api.remember("...", kind="semantic")    persist a durable fact
    api.http()                              httpx client for network calls
    api.data_path("state.json")             a writable per-plugin file
    api.config() / api.save_config({...})   plugin-local settings
    api.emit("my.event", {...})             publish to the live HUD
"""

from __future__ import annotations

from typing import Any


def register(api) -> None:
    """Called once when the plugin loads. Register tools here."""

    @api.tool(
        "{{tool_name}}",
        "{{tool_description}}",
        {
            "type": "object",
            "properties": {
                "input": {"type": "string", "description": "What to act on."}
            },
            "required": ["input"],
            "additionalProperties": False,
        },
    )
    def {{tool_name}}(input: str, ctx: Any = None) -> dict[str, Any]:
        # Synchronous handlers run in a worker thread, so blocking work is safe.
        # Raise an exception with a clear message to report a failure the agent
        # can read and recover from.
        return {"ok": True, "input": input}
