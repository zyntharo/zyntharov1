"""The permission pipeline: grants, confirmation prompts and shell screening."""

from __future__ import annotations

import pytest

from vyralis.config import Settings
from vyralis.llm.types import ToolSpec
from vyralis.safety.permissions import Decision, PathGuard, Policy
from vyralis.tools.context import ToolContext
from vyralis.tools.registry import ToolRegistry


def make_registry(permission: str = "safe") -> ToolRegistry:
    registry = ToolRegistry()

    @registry.tool("demo.delete_everything", "A dangerous demo tool.",
                   {"type": "object", "properties": {}}, permission=permission)
    def dangerous(ctx=None):  # noqa: ANN001
        return {"deleted": True}

    @registry.tool("demo.echo", "A harmless demo tool.",
                   {"type": "object", "properties": {}}, permission="safe")
    def echo(ctx=None):  # noqa: ANN001
        return {"ok": True}

    return registry


def make_context(tmp_path, settings: Settings, *, confirm=None, granted=None, denied=()):
    from vyralis.memory.store import MemoryStore

    store = MemoryStore(tmp_path / "m.sqlite3")
    return ToolContext(
        agent_id="tester", store=store, settings=settings, policy=Policy(settings),
        confirm=confirm, allowed_tools=granted, denied_tools=set(denied),
    )


def test_safe_tools_run_without_confirmation(tmp_path):
    settings = Settings(permission_mode="ask")
    registry = make_registry("safe")
    context = make_context(tmp_path, settings)
    import asyncio

    outcome = asyncio.run(registry.execute("demo.echo", {}, context))
    assert outcome.ok and outcome.data == {"ok": True}


def test_destructive_tool_waits_for_the_human_and_honours_denial(tmp_path):
    settings = Settings(permission_mode="ask")
    registry = make_registry("destructive")
    asked: list[str] = []

    async def deny(tool, args, reason):
        asked.append(tool)
        return False

    context = make_context(tmp_path, settings, confirm=deny)
    import asyncio

    outcome = asyncio.run(registry.execute("demo.delete_everything", {}, context))
    assert asked == ["demo.delete_everything"]
    assert not outcome.ok
    assert "not approved" in outcome.error


def test_destructive_tool_runs_once_approved(tmp_path):
    settings = Settings(permission_mode="ask")
    registry = make_registry("destructive")

    async def approve(tool, args, reason):
        return True

    context = make_context(tmp_path, settings, confirm=approve)
    import asyncio

    outcome = asyncio.run(registry.execute("demo.delete_everything", {}, context))
    assert outcome.ok and outcome.data == {"deleted": True}


def test_destructive_tool_is_refused_when_there_is_no_human(tmp_path):
    settings = Settings(permission_mode="ask")
    registry = make_registry("destructive")
    context = make_context(tmp_path, settings, confirm=None)
    import asyncio

    outcome = asyncio.run(registry.execute("demo.delete_everything", {}, context))
    assert not outcome.ok, "a destructive action must never run without a human to confirm it"


def test_deny_mode_blocks_everything(tmp_path):
    settings = Settings(permission_mode="deny")
    registry = make_registry("safe")
    context = make_context(tmp_path, settings)
    import asyncio

    outcome = asyncio.run(registry.execute("demo.echo", {}, context))
    assert not outcome.ok and "deny" in outcome.error.lower()


def test_grant_limits_what_an_agent_can_call(tmp_path):
    settings = Settings(permission_mode="auto")
    registry = make_registry("safe")
    context = make_context(tmp_path, settings, granted={"demo.echo"})
    import asyncio

    assert asyncio.run(registry.execute("demo.echo", {}, context)).ok
    blocked = asyncio.run(registry.execute("demo.delete_everything", {}, context))
    assert not blocked.ok and "not granted" in blocked.error


def test_revoked_tool_is_refused(tmp_path):
    settings = Settings(permission_mode="auto")
    registry = make_registry("safe")
    context = make_context(tmp_path, settings, denied={"demo.echo"})
    import asyncio

    outcome = asyncio.run(registry.execute("demo.echo", {}, context))
    assert not outcome.ok and "revoked" in outcome.error


def test_unknown_tool_is_reported_not_raised(tmp_path):
    settings = Settings(permission_mode="auto")
    registry = make_registry()
    context = make_context(tmp_path, settings)
    import asyncio

    outcome = asyncio.run(registry.execute("does.not.exist", {}, context))
    assert not outcome.ok and "Unknown tool" in outcome.error


def test_shell_screen_blocks_catastrophic_commands():
    policy = Policy(Settings(permission_mode="auto"))
    assert not policy.screen_command("rm -rf /").allow
    assert not policy.screen_command("mkfs.ext4 /dev/sda1").allow
    assert policy.screen_command("ls -la").allow


def test_shell_screen_asks_in_ask_mode():
    policy = Policy(Settings(permission_mode="ask"))
    decision = policy.screen_command("python -V")
    assert decision.allow and decision.ask


def test_path_guard_allows_children_only(tmp_path):
    allowed = tmp_path / "allowed"
    allowed.mkdir()
    guard = PathGuard(Settings(fs_allowlist=[str(allowed)]))
    inside = allowed / "sub" / "file.txt"
    inside.parent.mkdir()
    inside.write_text("ok")
    assert guard.check(inside) == inside.resolve()
    with pytest.raises(PermissionError):
        guard.check(tmp_path / "outside.txt")


def test_never_list_is_always_blocked():
    policy = Policy(Settings(permission_mode="auto"))
    decision = policy.authorize("system.raw_disk_write", {})
    assert decision == Decision(False, False, decision.reason)
    assert not decision.allow
