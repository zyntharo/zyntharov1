"""Self-extension: scaffolding, validating, installing and unloading plugins."""

from __future__ import annotations

from pathlib import Path

import pytest

from vyralis.plugins import PluginManager
from vyralis.plugins.loader import MANIFEST_NAME
from vyralis.tools.registry import ToolRegistry

GOOD_PLUGIN = '''
"""A generated plugin used by the test suite."""
from __future__ import annotations
from typing import Any


def register(api) -> None:
    @api.tool(
        "shout",
        "Uppercase some text.",
        {"type": "object", "properties": {"text": {"type": "string"}},
         "required": ["text"], "additionalProperties": False},
    )
    def shout(text: str, ctx: Any = None) -> dict[str, Any]:
        return {"shouted": text.upper()}
'''


@pytest.fixture
def manager(tmp_path, settings):
    from vyralis.memory.store import MemoryStore

    store = MemoryStore(tmp_path / "plugins.sqlite3")
    registry = ToolRegistry()
    return PluginManager(registry=registry, settings=settings, paths=_paths(tmp_path),
                         store=store), registry


def _paths(tmp_path: Path):
    from vyralis.config import Paths

    root = tmp_path / "runtime"
    return Paths(root).ensure()


def test_template_scaffold_writes_a_loadable_plugin(manager, tmp_path):
    mgr, registry = manager
    folder = mgr.write_template(tmp_path / "out", plugin_id="invoice_tools",
                                name="Invoice Tools", description="Handle invoices.")
    assert (folder / MANIFEST_NAME).exists()
    assert (folder / "plugin.py").read_text().startswith('"""')

    plugin = mgr.load(folder)
    assert plugin.ok, plugin.error
    assert "invoice_tools.do_thing" in registry.names()


def test_generate_and_install_gives_the_agent_a_new_tool(manager):
    mgr, registry = manager
    result = mgr.scaffold_and_install("text_tools", GOOD_PLUGIN, name="Text Tools",
                                      description="Case helpers.", tools=["shout"])
    assert result["ok"], result["error"]
    assert registry.has("text_tools.shout")

    import asyncio

    from vyralis.config import Settings
    from vyralis.tools.context import ToolContext
    from vyralis.memory.store import MemoryStore

    context = ToolContext(agent_id="a", store=MemoryStore(":memory:"),
                          settings=Settings(permission_mode="auto"))
    outcome = asyncio.run(registry.execute("text_tools.shout", {"text": "quiet"}, context))
    assert outcome.ok and outcome.data == {"shouted": "QUIET"}


def test_broken_plugin_fails_loudly_without_crashing(manager):
    mgr, registry = manager
    result = mgr.scaffold_and_install("broken", "def register(api)\n    pass\n")
    assert not result["ok"]
    assert "SyntaxError" in result["error"] or "error" in result
    assert not registry.names(), "a broken plugin must not register anything"


def test_validate_catches_missing_register_and_reports_tools(manager):
    mgr, _ = manager
    report = mgr.validate("x = 1\n")
    assert report["valid"] is False
    assert any("register" in error for error in report["errors"])

    good = mgr.validate(GOOD_PLUGIN, plugin_id="text_tools")
    assert good["valid"] is True
    assert good["tools"] == ["shout"]


def test_uninstall_removes_tools_and_folder(manager):
    mgr, registry = manager
    mgr.scaffold_and_install("text_tools", GOOD_PLUGIN, tools=["shout"])
    assert registry.has("text_tools.shout")

    result = mgr.uninstall("text_tools")
    assert result["uninstalled"]
    assert not registry.has("text_tools.shout")
    assert not (mgr.paths.plugins / "text_tools").exists()


def test_reload_picks_up_edited_code(manager):
    mgr, registry = manager
    mgr.scaffold_and_install("text_tools", GOOD_PLUGIN, tools=["shout"])
    entrypoint = mgr.paths.plugins / "text_tools" / "plugin.py"
    entrypoint.write_text(GOOD_PLUGIN.replace('"shouted": text.upper()', '"shouted": text.upper() + "!"'))

    reloaded = mgr.reload("text_tools")
    assert reloaded["ok"], reloaded.get("error")
    assert registry.has("text_tools.shout")


def test_status_merges_loader_state_with_the_store(manager):
    mgr, _ = manager
    mgr.scaffold_and_install("text_tools", GOOD_PLUGIN, tools=["shout"])
    rows = mgr.status()
    assert any(row["id"] == "text_tools" and row["tools"] for row in rows)
