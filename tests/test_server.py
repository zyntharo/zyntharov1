"""The HTTP/WebSocket surface: auth, status, conversation, confirmations."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from vyralis.config import Settings
from vyralis.runtime import Runtime
from vyralis.server.app import create_app

from .conftest import FakeClient, make_settings


@pytest.fixture
def api(tmp_path, monkeypatch):
    settings = make_settings(tmp_path)
    client = FakeClient()
    runtime = Runtime(settings, __import__("vyralis.config", fromlist=["paths"]).paths(), client=client)
    app = create_app(runtime)
    with TestClient(app) as test_client:
        yield test_client, runtime, client, settings


def _auth(settings: Settings) -> dict[str, str]:
    return {"x-vyralis-token": settings.token}


def test_health_is_open_but_status_requires_the_token(api):
    client, runtime, _, settings = api
    assert client.get("/api/health").status_code == 200
    assert client.get("/api/status").status_code == 401
    assert client.get("/api/status", headers=_auth(settings)).status_code == 200


def test_status_reports_the_whole_system(api):
    client, _, _, settings = api
    payload = client.get("/api/status", headers=_auth(settings)).json()
    assert payload["info"]["tagline"]
    assert payload["tools"]["count"] > 100
    assert "agents" in payload and "providers" in payload and "hardware" in payload
    assert payload["permissions"]["mode"] == "auto"


def test_tool_catalogue_lists_capability_families(api):
    client, _, _, settings = api
    payload = client.get("/api/tools", headers=_auth(settings)).json()
    names = {tool["name"] for tool in payload["tools"]}
    assert {"computer.click", "browser.snapshot", "files.edit", "office.excel_write",
            "hardware.report", "agents.spawn", "skills.run", "plugins.generate"} <= names


def test_message_endpoint_runs_the_agent_and_returns_a_result(api):
    client, _, model, settings = api
    model.queue("All set. Nothing needed doing.")
    response = client.post("/api/message", json={"text": "Say hello"}, headers=_auth(settings))
    assert response.status_code == 200
    payload = response.json()
    assert payload["result"]["ok"] is True
    assert "All set" in payload["result"]["report"]


def test_message_rejects_an_empty_body(api):
    client, _, _, settings = api
    assert client.post("/api/message", json={"text": "  "}, headers=_auth(settings)).status_code == 400


def test_provider_crud(api):
    client, runtime, _, settings = api
    created = client.post("/api/providers", headers=_auth(settings), json={
        "id": "groq", "label": "Groq", "base_url": "https://api.groq.com/openai/v1",
        "model": "llama-3.3-70b", "api_key": "secret", "rpm": 30,
    })
    assert created.status_code == 200

    listed = client.get("/api/providers", headers=_auth(settings)).json()
    assert any(provider["id"] == "groq" for provider in listed["providers"])
    groq = next(provider for provider in listed["providers"] if provider["id"] == "groq")
    assert groq["has_key"] is True and "secret" not in str(listed)

    updated = client.patch("/api/providers/groq", headers=_auth(settings), json={"enabled": False})
    assert updated.status_code == 200
    assert runtime.settings.provider("groq").enabled is False

    assert client.delete("/api/providers/groq", headers=_auth(settings)).status_code == 200
    assert runtime.settings.provider("groq") is None
    assert client.delete("/api/providers/groq", headers=_auth(settings)).status_code == 404


def test_provider_creation_validates_required_fields(api):
    client, _, _, settings = api
    response = client.post("/api/providers", headers=_auth(settings), json={"id": "x"})
    assert response.status_code == 400


def test_settings_update_is_restricted_to_known_keys(api):
    client, runtime, _, settings = api
    response = client.patch("/api/settings", headers=_auth(settings), json={
        "permission_mode": "ask", "voice_enabled": False, "token": "hacked", "nonsense": 1,
    })
    assert response.status_code == 200
    assert runtime.settings.permission_mode == "ask"
    assert "token" not in response.json()["changed"]
    assert runtime.settings.token != "hacked"


async def test_confirmation_blocks_until_it_is_resolved(api):
    _, runtime, _, _ = api
    import asyncio

    waiter = asyncio.create_task(
        runtime.orchestrator.request_confirmation("files.delete", {"path": "/tmp/x"}, "test")
    )
    for _ in range(100):
        pending = runtime.orchestrator.pending_confirmations()
        if pending:
            break
        await asyncio.sleep(0.01)
    assert pending, "a confirmation request should be pending"

    runtime.orchestrator.resolve_confirmation(pending[0]["id"], True)
    assert await waiter is True

    denied = asyncio.create_task(
        runtime.orchestrator.request_confirmation("files.delete", {"path": "/tmp/y"}, "test")
    )
    for _ in range(100):
        rows = runtime.orchestrator.pending_confirmations()
        if len(rows) >= 1 and rows[0]["args"].get("path") == "/tmp/y":
            break
        await asyncio.sleep(0.01)
    runtime.orchestrator.resolve_confirmation(rows[0]["id"], False)
    assert await denied is False


def test_confirmation_endpoints_expose_and_resolve_pending_requests(api):
    client, runtime, _, settings = api
    runtime.store.add_confirmation("confirm_test", "files.delete", {"path": "/tmp/z"},
                                   "agent_x", "unit test")
    listed = client.get("/api/confirmations", headers=_auth(settings)).json()
    assert any(item["id"] == "confirm_test" for item in listed["pending"])

    resolved = client.post("/api/confirmations/confirm_test",
                           headers=_auth(settings), json={"approved": False})
    assert resolved.status_code == 200
    assert resolved.json()["approved"] is False
    assert client.get("/api/confirmations", headers=_auth(settings)).json()["pending"] == []


def test_websocket_streams_events_and_accepts_a_message(api):
    client, runtime, model, settings = api
    model.queue("Understood.")
    with client.websocket_connect(f"/ws?token={settings.token}") as socket:
        hello = socket.receive_json()
        assert hello["type"] == "hello"
        assert hello["payload"]["status"]["tools"]["count"] > 0

        socket.send_json({"type": "user.message", "payload": {"text": "hi", "channel": "chat"}})
        seen: set[str] = set()
        for _ in range(400):
            event = socket.receive_json()
            seen.add(event["type"])
            if event["type"] == "agent.report":
                break
        assert "user.input" in seen
        assert "agent.report" in seen
        # Nothing was approved, so no destructive tool may have run.
        assert "tool.denied" not in seen


def test_websocket_rejects_a_bad_token(api):
    client, _, _, _ = api
    with pytest.raises(Exception):
        with client.websocket_connect("/ws?token=wrong") as socket:
            socket.receive_json()


def test_hardware_endpoint_returns_a_verdict(api):
    client, _, _, settings = api
    payload = client.get("/api/hardware", headers=_auth(settings)).json()
    assert "verdict" in payload and "cpu" in payload and "memory" in payload


def test_probe_reports_missing_setup(api):
    client, _, _, settings = api
    payload = client.get("/api/config/probe", headers=_auth(settings)).json()
    assert isinstance(payload["missing_setup"], list)
