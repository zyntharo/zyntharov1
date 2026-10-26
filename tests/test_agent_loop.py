"""The agent loop, orchestration, delegation and supervision."""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest


async def test_main_agent_runs_a_tool_then_reports(harness, tmp_path):
    env = await harness()
    target = tmp_path / "report.txt"
    env.client.queue(
        ("Writing the file now.", [("files.write", {"path": str(target), "content": "net 42"})]),
        "DONE: wrote the report\nOUTPUT: report.txt\nVERIFIED: read it back\nISSUES: none",
    )
    result = await env.ask("Write a report file")
    assert result.ok, result.error
    assert "DONE" in result.report
    assert target.read_text() == "net 42"
    assert result.tool_calls == 1
    assert result.outputs == [str(target)]
    assert env.client.calls[0]["has_tools"] is True


async def test_agent_recovers_from_a_broken_tool_call(harness):
    env = await harness()
    env.client.queue(
        ("Trying.", [("files.read", {"path": "/etc/shadow"})]),
        "I could not read that path; it is outside the allowlist.",
    )
    result = await env.ask("Read a file outside the sandbox")
    assert result.ok
    assert result.tool_calls == 1


async def test_step_budget_stops_a_looping_agent(harness):
    env = await harness()
    # Always ask for another tool call: the loop must terminate on its own.
    for _ in range(40):
        env.client.queue((None, [("computer.pointer", {})]))
    main = env.runtime.orchestrator.main
    main.budget["max_steps"] = 4
    result = await env.ask("Loop forever")
    assert not result.ok
    assert "budget" in result.error.lower()
    assert result.steps == 4


async def test_failover_switches_provider_and_keeps_going(harness):
    env = await harness(providers=2)
    calls: list[str] = []

    async def flaky(provider, model, messages, **kwargs):
        calls.append(provider.id)
        if provider.id == "primary":
            from vyralis.llm.types import RateLimited

            raise RateLimited("429 from primary", retry_after=1.0)
        from vyralis.llm.types import LLMResponse, Usage

        return LLMResponse(content="Handled by the backup provider.", usage=Usage(10, 5),
                           model="fake-model", provider_id=provider.id)

    env.client.stream_chat = flaky  # type: ignore[assignment]
    result = await env.ask("Do something")
    assert result.ok, result.error
    assert calls[0] == "primary" and "backup1" in calls
    assert result.provider == "backup1"


async def test_no_provider_configured_is_reported_clearly(harness):
    env = await harness(providers=0)
    result = await env.ask("Hello")
    assert not result.ok
    assert "no model is available" in result.error.lower()


async def test_subagent_spawn_assign_and_report(harness, tmp_path):
    env = await harness()
    notes = tmp_path / "notes.md"

    # 1) main agent spawns a worker and assigns it a task
    env.client.queue(
        ("Delegating.", [("agents.spawn", {"role": "employee", "name": "Kestrel",
                                           "mandate": "Write the notes file",
                                           "grant": ["files"],
                                           "max_steps": 5})]),
        "Spawned an operator.",
    )
    first = await env.ask("Hire someone to write notes")
    assert first.ok
    workers = [a for a in env.runtime.orchestrator.list_agents() if a["role"] == "employee"]
    assert len(workers) == 1
    assert workers[0]["name"] == "Kestrel"

    # 2) the worker itself runs with the same loop
    worker = env.runtime.orchestrator.get(workers[0]["id"])
    assert worker is not None and worker.grant is not None
    assert "files.write" in worker.grant
    assert not any(name.startswith("computer.") for name in worker.grant)

    env.client.queue(
        ("Writing.", [("files.write", {"path": str(notes), "content": "# notes"})]),
        "DONE: wrote notes\nOUTPUT: notes.md\nVERIFIED: file exists\nISSUES: none",
    )
    outcome = await env.runtime.orchestrator.assign(
        worker, title="Write the notes file", brief="Create notes.md in the workspace."
    )
    assert outcome.ok
    assert notes.read_text() == "# notes"


async def test_team_formation_wires_a_head_and_members(harness):
    env = await harness()
    team = env.runtime.orchestrator.form_team(objective="Produce a market brief", members=2)
    assert team["size"] == 3
    agents = env.runtime.orchestrator.list_agents()
    roles = [agent["role"] for agent in agents]
    assert roles.count("head") == 1 and roles.count("employee") == 2

    head = env.runtime.orchestrator.get(team["head_id"])
    member = env.runtime.orchestrator.get(team["members"][0])
    assert member.record.parent_id == head.id
    assert member.record.rank < head.record.rank, "authority must not escalate"


async def test_confirmation_flow_blocks_until_the_user_answers(harness):
    env = await harness(permission_mode="ask")
    env.runtime.settings.require_confirmation_for = ["files.write"]
    env.client.queue(
        ("Writing.", [("files.write", {"path": "/tmp/never.txt", "content": "x"})]),
        "The write was not approved.",
    )

    ask = asyncio.create_task(env.ask("Write a file"))
    pending: list[dict] = []
    for _ in range(200):
        pending = env.runtime.orchestrator.pending_confirmations()
        if pending:
            break
        await asyncio.sleep(0.01)
    assert pending, "the tool should have raised a confirmation request"
    assert pending[0]["tool"] == "files.write"

    env.runtime.orchestrator.resolve_confirmation(pending[0]["id"], False)
    result = await ask
    assert result.ok
    assert not Path("/tmp/never.txt").exists(), "a denied action must not have run"


async def test_manager_reassigns_an_agent_off_a_failing_provider(harness):
    env = await harness(providers=2)
    agent = env.runtime.orchestrator.spawn(
        role="employee", name="Halcyon", mandate="test", provider_id="primary"
    )
    env.runtime.ledger.mark_failure("primary", "429", rate_limited=True)
    report = await env.runtime.manager.cycle()
    assert report["status"] in {"degraded", "critical"}
    moves = [event for event in report["events"] if event["kind"] == "model_reassigned"]
    assert moves, report["events"]
    assert env.runtime.orchestrator.get(agent.id).record.provider_id == "backup1"


async def test_manager_disables_a_repeatedly_rate_limited_provider(harness):
    env = await harness(providers=2)
    for _ in range(4):
        env.runtime.ledger.mark_failure("primary", "429", rate_limited=True)
    await env.runtime.manager.cycle()
    assert env.runtime.settings.provider("primary").enabled is False


async def test_agents_cannot_exceed_their_parent_rank(harness):
    env = await harness()
    main = env.runtime.orchestrator.main
    worker = env.runtime.orchestrator.spawn(role="employee", name="Wren", mandate="x", parent=main)
    assert worker.record.rank < main.record.rank
    with pytest.raises(PermissionError):
        env.runtime.orchestrator.spawn(role="employee", mandate="x", parent=worker)


async def test_memory_written_by_one_agent_is_recallable_by_the_main_agent(harness):
    env = await harness()
    worker = env.runtime.orchestrator.spawn(role="employee", name="Echo", mandate="learn things")
    worker.remember("The reporting portal lives at intranet.example.com/reports",
                    kind="semantic", scope="global", importance=0.9)
    hits = env.runtime.store.recall("where is the reporting portal", agent_id="main")
    assert hits and "intranet.example.com" in hits[0].content


async def test_inspect_exposes_what_an_agent_actually_did(harness):
    env = await harness()
    worker = env.runtime.orchestrator.spawn(role="employee", name="Lyra", mandate="click things")
    env.client.queue(("Trying.", [("computer.pointer", {})]), "Stopped.")
    await env.runtime.orchestrator.assign(worker, title="Probe the desktop", brief="Check the pointer.")
    inspected = env.runtime.orchestrator.inspect(worker.id)
    assert inspected["steps_taken"] == 1
    assert inspected["recent_actions"][0]["tool"] == "computer.pointer"


async def test_retire_stops_and_removes_a_worker_from_the_listing(harness):
    env = await harness()
    worker = env.runtime.orchestrator.spawn(role="employee", name="Dune", mandate="x")
    assert env.runtime.orchestrator.retire(worker.id)["retired"] is True
    assert all(agent["id"] != worker.id for agent in env.runtime.orchestrator.list_agents())
    assert env.runtime.orchestrator.retire(env.runtime.orchestrator.main.id)["retired"] is False


async def test_subagent_limit_is_enforced(harness):
    env = await harness()
    env.runtime.settings.max_subagents = 2
    env.runtime.orchestrator.spawn(role="employee", name="A1", mandate="x")
    env.runtime.orchestrator.spawn(role="employee", name="A2", mandate="x")
    with pytest.raises(RuntimeError):
        env.runtime.orchestrator.spawn(role="employee", name="A3", mandate="x")
