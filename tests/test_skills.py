"""Skill recording, compilation and replay - the fast path."""

from __future__ import annotations

from pathlib import Path

import pytest

from vyralis.bus import EventType
from vyralis.config import Settings
from vyralis.skills import SkillLibrary, SkillStep


@pytest.fixture
def library(tmp_path: Path):
    from vyralis.memory.store import MemoryStore
    from vyralis.tools.registry import ToolRegistry

    store = MemoryStore(tmp_path / "skills.sqlite3")
    registry = ToolRegistry()
    calls: list[tuple[str, dict]] = []

    @registry.tool("files.write", "Write a file.",
                   {"type": "object", "properties": {"path": {"type": "string"},
                                                     "content": {"type": "string"}}},
                   permission="safe")
    def write(path: str = "", content: str = "", ctx=None):  # noqa: ANN001
        calls.append(("files.write", {"path": path, "content": content}))
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        Path(path).write_text(content)
        return {"path": path}

    @registry.tool("browser.click", "Click something.",
                   {"type": "object", "properties": {"text": {"type": "string"}}},
                   permission="safe")
    def click(text: str = "", ctx=None):  # noqa: ANN001
        calls.append(("browser.click", {"text": text}))
        if text == "MISSING":
            raise RuntimeError("button not found")
        return {"clicked": text}

    return SkillLibrary(store, registry, Settings(permission_mode="auto")), registry, calls


def _ctx(settings: Settings, tmp_path: Path):
    from vyralis.memory.store import MemoryStore
    from vyralis.tools.context import ToolContext

    confined = settings.model_copy() if hasattr(settings, "model_copy") else settings
    import dataclasses

    confined = dataclasses.replace(settings, fs_allowlist=[str(tmp_path)])
    return ToolContext(agent_id="recorder", store=MemoryStore(tmp_path / "ctx.sqlite3"),
                       settings=confined)


def test_recording_captures_actions_and_compiles_them(library, tmp_path):
    lib, registry, calls = library
    from vyralis.bus import BUS

    lib.start_recording("recorder", "Export the report")
    BUS.publish(EventType.TOOL_CALL, {"tool": "browser.click", "args": {"text": "Reports"}},
                agent_id="recorder")
    BUS.publish(EventType.TOOL_CALL, {"tool": "vision.look", "args": {}}, agent_id="recorder")
    BUS.publish(EventType.TOOL_CALL, {"tool": "files.write",
                                      "args": {"path": str(tmp_path / "out.csv"),
                                               "content": "a,b"}}, agent_id="recorder")

    status = lib.recorder_status("recorder")
    assert status["recording"] and status["captured_steps"] == 2, "vision steps must be compiled away"

    saved = lib.stop_recording("recorder", name="export_report", description="Exports the report")
    assert saved["saved"], saved
    skill = saved["skill"]
    assert skill["step_count"] == 2
    assert {step["tool"] for step in skill["steps"]} == {"browser.click", "files.write"}
    # Literal values became inputs.
    assert skill["parameters"], "typed/clicked values should be parameterised"


def test_replay_runs_directly_without_vision(library, tmp_path):
    lib, registry, calls = library
    from vyralis.bus import BUS

    lib.start_recording("recorder")
    BUS.publish(EventType.TOOL_CALL, {"tool": "browser.click", "args": {"text": "Send"}},
                agent_id="recorder")
    BUS.publish(EventType.TOOL_CALL, {"tool": "files.write", "args": {"path": str(tmp_path / "x.txt"),
                                                                     "content": "hello"}},
                agent_id="recorder")
    skill_id = lib.stop_recording("recorder", name="send_it", description="Clicks send")["skill"]["id"]

    calls.clear()
    import asyncio

    result = asyncio.run(lib.run(skill_id, {}, _ctx(Settings(permission_mode="auto"), tmp_path)))
    assert result["ok"], result
    assert result["steps_run"] == 2
    assert [name for name, _ in calls] == ["browser.click", "files.write"]
    assert (tmp_path / "x.txt").read_text() == "hello"


def test_inputs_are_substituted_at_replay_time(library, tmp_path):
    lib, registry, calls = library
    from vyralis.bus import BUS

    lib.start_recording("recorder")
    BUS.publish(EventType.TOOL_CALL, {"tool": "files.write",
                                      "args": {"path": str(tmp_path / "fixed.txt"),
                                               "content": "placeholder"}},
                agent_id="recorder")
    saved = lib.stop_recording("recorder", name="write_fixed", description="writes a file")
    skill = saved["skill"]
    param = next(iter(skill["parameters"]))

    import asyncio

    result = asyncio.run(lib.run(skill["id"], {param: "REPLACED"},
                                 _ctx(Settings(permission_mode="auto"), tmp_path)))
    assert result["ok"]
    assert (tmp_path / "fixed.txt").read_text() == "REPLACED"


def test_missing_input_is_reported_without_running(library, tmp_path):
    lib, _, _ = library
    lib.save(_skill_with_input("needs_input"))
    import asyncio

    result = asyncio.run(lib.run("skill_needs_input", {}, _ctx(
        Settings(permission_mode="auto"), tmp_path)))
    assert not result["ok"] and "not provided" in result["error"]


def _skill_with_input(name: str):
    from vyralis.skills import Skill

    return Skill(id="skill_needs_input", name=name, description="needs a value",
                 steps=[SkillStep(tool="browser.click", args={"text": "{{missing}}"})],
                 parameters={"missing": {"type": "string", "description": "a value"}})


def test_failed_step_marks_the_skill_stale(library, tmp_path):
    lib, _, _ = library
    lib.save(_failing_skill())
    import asyncio

    result = asyncio.run(lib.run("skill_failing", {}, _ctx(
        Settings(permission_mode="auto"), tmp_path)))
    assert not result["ok"]
    assert result["failed_at_step"] == 1 and result["failed_tool"] == "browser.click"
    assert "advice" in result
    assert lib.load("skill_failing").stale is True


def _failing_skill():
    from vyralis.skills import Skill

    return Skill(id="skill_failing", name="broken", description="will fail",
                 steps=[SkillStep(tool="browser.click", args={"text": "MISSING"})])


def test_lexical_match_finds_the_right_skill(library, tmp_path):
    lib, _, _ = library
    lib.save(_skill_with_input("export_monthly_report"))
    matches = lib.matches("please export the monthly report for this month")
    assert matches and matches[0].name == "export_monthly_report"


def test_forget_removes_a_skill(library, tmp_path):
    lib, _, _ = library
    lib.save(_skill_with_input("disposable"))
    assert lib.load("skill_needs_input") is not None
    lib.forget("skill_needs_input")
    assert lib.load("skill_needs_input") is None
