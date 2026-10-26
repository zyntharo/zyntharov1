"""HTTP + WebSocket API and the GUI host.

One process serves three things:

* ``/api/*``   - REST for status, configuration and one-shot actions,
* ``/ws``      - the live event stream that drives the HUD (thoughts, tool calls,
                 wiring, quotas, hardware alerts, confirmations, speech),
* ``/``        - the built GUI, served from the package so the installed app has
                 no external dependencies.

Security: the server binds to loopback by default and every request must carry
the runtime token (header, query parameter or WebSocket subprotocol). CORS is
restricted to loopback origins so the Vite dev server works during development
without opening the API to the network.
"""

from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import time
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .. import CODENAME, TAGLINE, __version__
from ..bus import BUS, EventType
from ..config import bundled_gui_dir
from ..runtime import Runtime

log = logging.getLogger("vyralis.server")

LOOPBACK_ORIGINS = [
    "http://127.0.0.1", "http://localhost", "http://[::1]",
]


def create_app(runtime: Runtime) -> FastAPI:
    app = FastAPI(
        title="Vyralis",
        version=__version__,
        description=f"{TAGLINE} ({CODENAME})",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )
    app.state.runtime = runtime

    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^https?://(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -- auth ----------------------------------------------------------
    def require_token(request: Request) -> None:
        token = runtime.settings.token
        if not token:
            return
        supplied = (
            request.headers.get("x-vyralis-token")
            or request.query_params.get("token")
            or _bearer(request.headers.get("authorization", ""))
        )
        if supplied != token:
            raise HTTPException(status_code=401, detail="Invalid or missing Vyralis token.")

    # ==============================================================
    # Status and introspection
    # ==============================================================
    @app.get("/api/health")
    async def health() -> dict[str, Any]:
        return {"ok": True, "version": __version__, "uptime_s": round(time.time() - runtime.info.started_at, 1)}

    @app.get("/api/status", dependencies=[Depends(require_token)])
    async def status() -> dict[str, Any]:
        return runtime.status()

    @app.get("/api/tools", dependencies=[Depends(require_token)])
    async def tools() -> dict[str, Any]:
        return {
            "tools": runtime.registry.describe(),
            "categories": sorted(runtime.registry.by_category()),
            "count": len(runtime.registry.names()),
        }

    @app.get("/api/roles", dependencies=[Depends(require_token)])
    async def roles() -> dict[str, Any]:
        from ..agents.roles import all_roles

        return {"roles": all_roles()}

    @app.get("/api/agents", dependencies=[Depends(require_token)])
    async def agents() -> dict[str, Any]:
        return {"agents": runtime.orchestrator.list_agents(), "stats": runtime.orchestrator.stats(),
                "teams": runtime.orchestrator.list_teams()}

    @app.get("/api/agents/{agent_id}", dependencies=[Depends(require_token)])
    async def agent_detail(agent_id: str) -> dict[str, Any]:
        return runtime.orchestrator.inspect(agent_id)

    @app.post("/api/agents/{agent_id}/retire", dependencies=[Depends(require_token)])
    async def agent_retire(agent_id: str) -> dict[str, Any]:
        return runtime.orchestrator.retire(agent_id)

    @app.get("/api/memory", dependencies=[Depends(require_token)])
    async def memory(query: str = "", kind: str | None = None, limit: int = 60) -> dict[str, Any]:
        if query:
            rows = runtime.store.recall(query, limit=limit, kinds=[kind] if kind else None)
        else:
            rows = runtime.store.list_memories(kind=kind, limit=limit)
        return {"memories": [
            {"id": row.id, "agent_id": row.agent_id, "kind": row.kind, "scope": row.scope,
             "content": row.content[:1200], "importance": row.importance,
             "created_at": row.created_at, "access_count": row.access_count,
             "tags": row.tags}
            for row in rows
        ]}

    @app.delete("/api/memory/{memory_id}", dependencies=[Depends(require_token)])
    async def memory_forget(memory_id: str) -> dict[str, Any]:
        runtime.store.forget(memory_id)
        return {"forgotten": memory_id}

    @app.get("/api/skills", dependencies=[Depends(require_token)])
    async def skills() -> dict[str, Any]:
        return {"skills": [skill.to_json() for skill in runtime.skills.list()]}

    @app.post("/api/skills/{skill_id}/run", dependencies=[Depends(require_token)])
    async def run_skill(skill_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        from ..tools.context import ToolContext

        context = ToolContext(
            agent_id=runtime.orchestrator.main.id if runtime.orchestrator.main else "operator",
            store=runtime.store, settings=runtime.settings, services=runtime.services,
            confirm=runtime.confirm,
        )
        return await runtime.skills.run(skill_id, (payload or {}).get("inputs", {}), context)

    @app.delete("/api/skills/{skill_id}", dependencies=[Depends(require_token)])
    async def forget_skill(skill_id: str) -> dict[str, Any]:
        return runtime.skills.forget(skill_id)

    @app.get("/api/plugins", dependencies=[Depends(require_token)])
    async def plugins() -> dict[str, Any]:
        return {"plugins": runtime.plugins.status()}

    @app.post("/api/plugins/{plugin_id}/reload", dependencies=[Depends(require_token)])
    async def plugin_reload(plugin_id: str) -> dict[str, Any]:
        return runtime.plugins.reload(plugin_id)

    @app.delete("/api/plugins/{plugin_id}", dependencies=[Depends(require_token)])
    async def plugin_uninstall(plugin_id: str) -> dict[str, Any]:
        return runtime.plugins.uninstall(plugin_id)

    @app.get("/api/tasks", dependencies=[Depends(require_token)])
    async def tasks(limit: int = 60) -> dict[str, Any]:
        return {"tasks": [
            {"id": task.id, "title": task.title, "status": task.status, "agent_id": task.agent_id,
             "parent_id": task.parent_id, "result": task.result[:1500],
             "created_at": task.created_at, "updated_at": task.updated_at}
            for task in runtime.store.list_tasks(limit=limit)
        ]}

    @app.get("/api/traces", dependencies=[Depends(require_token)])
    async def traces(limit: int = 200) -> dict[str, Any]:
        return {"traces": runtime.store.recent_traces(limit)}

    @app.get("/api/notifications", dependencies=[Depends(require_token)])
    async def notifications() -> dict[str, Any]:
        return {"notifications": runtime.notifications()}

    # ==============================================================
    # Providers and quota
    # ==============================================================
    @app.get("/api/providers", dependencies=[Depends(require_token)])
    async def providers() -> dict[str, Any]:
        return {"providers": runtime.router.describe(), "headroom": runtime.router.headroom()}

    @app.post("/api/providers", dependencies=[Depends(require_token)])
    async def add_provider(payload: dict[str, Any]) -> dict[str, Any]:
        from ..config import ProviderConfig

        provider_id = str(payload.get("id") or "").strip()
        base_url = str(payload.get("base_url") or "").strip()
        model = str(payload.get("model") or "").strip()
        if not provider_id or not base_url or not model:
            raise HTTPException(400, "id, base_url and model are required")
        if runtime.settings.provider(provider_id) is not None:
            raise HTTPException(409, f"Provider '{provider_id}' already exists")
        provider = ProviderConfig(
            id=provider_id, label=str(payload.get("label") or provider_id.title()),
            base_url=base_url, model=model, api_key=str(payload.get("api_key") or ""),
            api_key_env=str(payload.get("api_key_env") or ""),
            audio_model=str(payload.get("audio_model") or ""),
            tier=str(payload.get("tier") or "standard"),
            rpm=int(payload.get("rpm") or 0), rpd=int(payload.get("rpd") or 0),
            tpm=int(payload.get("tpm") or 0), tpd=int(payload.get("tpd") or 0),
            priority=int(payload.get("priority") or 100),
            supports_tools=bool(payload.get("supports_tools", True)),
            supports_vision=bool(payload.get("supports_vision", False)),
            supports_audio=bool(payload.get("supports_audio", False)),
            enabled=bool(payload.get("enabled", True)),
        )
        runtime.settings.providers.append(provider)
        runtime.settings.save(runtime.paths)
        return {"added": provider.id}

    @app.patch("/api/providers/{provider_id}", dependencies=[Depends(require_token)])
    async def update_provider(provider_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        provider = runtime.settings.provider(provider_id)
        if provider is None:
            raise HTTPException(404, f"Unknown provider '{provider_id}'")
        for field_name in (
            "label", "base_url", "api_key", "api_key_env", "model", "audio_model", "tier",
            "enabled", "supports_tools", "supports_vision", "supports_audio",
        ):
            if field_name in payload:
                setattr(provider, field_name, payload[field_name])
        for field_name in ("rpm", "rpd", "tpm", "tpd", "priority"):
            if field_name in payload and payload[field_name] is not None:
                setattr(provider, field_name, int(payload[field_name]))
        runtime.settings.save(runtime.paths)
        runtime.ledger.clear(provider_id)
        return {"updated": provider_id}

    @app.delete("/api/providers/{provider_id}", dependencies=[Depends(require_token)])
    async def delete_provider(provider_id: str) -> dict[str, Any]:
        before = len(runtime.settings.providers)
        runtime.settings.providers = [
            provider for provider in runtime.settings.providers if provider.id != provider_id
        ]
        if len(runtime.settings.providers) == before:
            raise HTTPException(404, f"Unknown provider '{provider_id}'")
        runtime.settings.save(runtime.paths)
        return {"removed": provider_id}

    @app.post("/api/providers/{provider_id}/models", dependencies=[Depends(require_token)])
    async def provider_models(provider_id: str) -> dict[str, Any]:
        provider = runtime.settings.provider(provider_id)
        if provider is None:
            raise HTTPException(404, f"Unknown provider '{provider_id}'")
        return {"models": await runtime.client.list_models(provider)}

    @app.post("/api/providers/{provider_id}/test", dependencies=[Depends(require_token)])
    async def provider_test(provider_id: str) -> dict[str, Any]:
        provider = runtime.settings.provider(provider_id)
        if provider is None:
            raise HTTPException(404, f"Unknown provider '{provider_id}'")
        from ..llm.types import ChatMessage, LLMError

        try:
            response = await runtime.client.chat(
                provider, provider.model, [ChatMessage(role="user", content="Reply with the single word: ready")]
            )
            return {"ok": True, "reply": response.content[:200], "model": response.model,
                    "tokens": response.usage.total}
        except LLMError as exc:
            return {"ok": False, "error": str(exc)[:400]}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": f"{type(exc).__name__}: {exc}"}

    # ==============================================================
    # Conversation and voice
    # ==============================================================
    @app.post("/api/message", dependencies=[Depends(require_token)])
    async def message(payload: dict[str, Any]) -> dict[str, Any]:
        text = str(payload.get("text") or "").strip()
        if not text:
            raise HTTPException(400, "text is required")
        channel = str(payload.get("channel") or "chat")
        if runtime.voice is not None:
            runtime.voice.note_user(text, source=channel)
        background = bool(payload.get("background", False))
        if background:
            asyncio.create_task(runtime.orchestrator.handle_user(text, channel=channel))
            return {"accepted": True, "background": True}
        result = await runtime.orchestrator.handle_user(text, channel=channel)
        return {"accepted": True, "result": result.to_json(),
                "spoken": runtime.orchestrator._spoken_form(result)}  # noqa: SLF001

    @app.post("/api/stop", dependencies=[Depends(require_token)])
    async def stop() -> dict[str, Any]:
        main = runtime.orchestrator.main
        if main is not None:
            main.cancel()
        count = 0
        for agent in runtime.orchestrator.agents.values():
            if agent.record.status in {"thinking", "acting"}:
                agent.cancel()
                count += 1
        return {"cancelled": count + (1 if main else 0)}

    @app.post("/api/speech", dependencies=[Depends(require_token)])
    async def speech(payload: dict[str, Any]) -> dict[str, Any]:
        text = str(payload.get("text") or "")
        if not text:
            raise HTTPException(400, "text is required")
        if runtime.voice is None:
            raise HTTPException(503, "Voice service is not available")
        return await runtime.voice.speak(text, wait=bool(payload.get("wait", False)))

    @app.get("/api/transcript", dependencies=[Depends(require_token)])
    async def transcript(limit: int = 60) -> dict[str, Any]:
        return {"transcript": runtime.voice.recent(limit) if runtime.voice else []}

    # ==============================================================
    # Settings, permissions, hardware
    # ==============================================================
    @app.get("/api/settings", dependencies=[Depends(require_token)])
    async def get_settings() -> dict[str, Any]:
        return runtime.settings.redacted()

    @app.patch("/api/settings", dependencies=[Depends(require_token)])
    async def update_settings(payload: dict[str, Any]) -> dict[str, Any]:
        allowed = {
            "permission_mode", "fs_allowlist", "require_confirmation_for", "voice_enabled",
            "voice_engine", "voice_name", "input_mode", "browser_channel", "browser_headless",
            "browser_profile", "max_subagents", "max_parallel_tools", "max_steps_per_task",
            "vision_set_of_marks", "vision_grid_overlay", "gui_particle_count",
            "gui_show_wiring", "gui_reduced_motion", "watch_interval_seconds",
        }
        changed: list[str] = []
        for key, value in (payload or {}).items():
            if key not in allowed:
                continue
            setattr(runtime.settings, key, value)
            changed.append(key)
        if "hardware" in payload and isinstance(payload["hardware"], dict):
            for key, value in payload["hardware"].items():
                if hasattr(runtime.settings.hardware, key):
                    setattr(runtime.settings.hardware, key, value)
                    changed.append(f"hardware.{key}")
        if changed:
            runtime.settings.save(runtime.paths)
            runtime.registry.set_parallelism(runtime.settings.max_parallel_tools)
        return {"changed": changed, "settings": runtime.settings.redacted()}

    @app.get("/api/permissions", dependencies=[Depends(require_token)])
    async def permissions() -> dict[str, Any]:
        return {
            "mode": runtime.settings.permission_mode,
            "require_confirmation_for": runtime.settings.require_confirmation_for,
            "fs_allowlist": runtime.guard.describe(),
            "pending": runtime.orchestrator.pending_confirmations(),
        }

    @app.get("/api/confirmations", dependencies=[Depends(require_token)])
    async def confirmations() -> dict[str, Any]:
        return {"pending": runtime.orchestrator.pending_confirmations()}

    @app.post("/api/confirmations/{confirmation_id}", dependencies=[Depends(require_token)])
    async def resolve(confirmation_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        approved = bool(payload.get("approved", False))
        return runtime.orchestrator.resolve_confirmation(confirmation_id, approved)

    @app.get("/api/hardware", dependencies=[Depends(require_token)])
    async def hardware(processes: int = 6, history: bool = False) -> dict[str, Any]:
        monitor = runtime.services.hardware
        sample = monitor.sample(include_processes=processes)
        payload = sample.to_json() | {"summary": sample.summary(),
                                      "verdict": monitor.health_verdict()}
        if history:
            payload["history"] = monitor.history(40)
            payload["alerts"] = monitor.recent_alerts(20)
        return payload

    @app.get("/api/hardware/trend", dependencies=[Depends(require_token)])
    async def hardware_trend(sensor: str, limit: int = 60) -> dict[str, Any]:
        return {"sensor": sensor, "points": runtime.services.hardware.trend(sensor, limit)}

    @app.get("/api/history", dependencies=[Depends(require_token)])
    async def history(limit: int = 120) -> dict[str, Any]:
        return {"events": BUS.recent(limit)}

    @app.get("/api/config/probe", dependencies=[Depends(require_token)])
    async def probe() -> dict[str, Any]:
        return {"missing_setup": runtime.missing_setup()}

    # ==============================================================
    # WebSocket: the live channel
    # ==============================================================
    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket) -> None:
        token = runtime.settings.token
        supplied = (
            websocket.query_params.get("token")
            or websocket.headers.get("x-vyralis-token")
            or _bearer(websocket.headers.get("authorization", ""))
        )
        if token and supplied != token:
            await websocket.close(code=4401)
            return
        await websocket.accept()
        await websocket.send_text(json.dumps({
            "type": "hello",
            "payload": {
                "version": __version__, "codename": CODENAME,
                "settings": runtime.settings.redacted(),
                "status": runtime.status(),
            },
            "ts": time.time(),
        }))

        stop_event = asyncio.Event()

        async def pump() -> None:
            async for event in BUS.stream(replay=80):
                if stop_event.is_set():
                    return
                try:
                    await websocket.send_text(json.dumps(event.to_json(), default=str))
                except Exception:  # noqa: BLE001
                    stop_event.set()
                    return

        pump_task = asyncio.create_task(pump())
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    command = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                await _handle_command(runtime, websocket, command)
        except WebSocketDisconnect:
            pass
        except Exception as exc:  # noqa: BLE001
            log.debug("websocket closed: %s", exc)
        finally:
            stop_event.set()
            pump_task.cancel()
            with contextlib.suppress(asyncio.CancelledError, Exception):
                await pump_task

    # ==============================================================
    # GUI static hosting
    # ==============================================================
    gui_dir = bundled_gui_dir()
    if (gui_dir / "index.html").exists():
        app.mount("/assets", StaticFiles(directory=gui_dir / "assets"), name="assets")

        @app.get("/", response_class=HTMLResponse, include_in_schema=False)
        async def index() -> Any:
            return FileResponse(gui_dir / "index.html")

        @app.get("/{path:path}", include_in_schema=False)
        async def spa(path: str) -> Any:
            candidate = (gui_dir / path).resolve()
            if gui_dir.resolve() in candidate.parents and candidate.is_file():
                return FileResponse(candidate)
            return FileResponse(gui_dir / "index.html")
    else:
        @app.get("/", response_class=HTMLResponse, include_in_schema=False)
        async def placeholder() -> Any:
            return HTMLResponse(
                _placeholder_html(runtime), status_code=200
            )

    return app


# ---------------------------------------------------------------------------
async def _handle_command(runtime: Runtime, websocket: WebSocket, command: dict[str, Any]) -> None:
    """Inbound WebSocket commands from the GUI."""
    kind = command.get("type")
    payload = command.get("payload") or {}
    try:
        if kind == "user.message":
            text = str(payload.get("text") or "").strip()
            if not text:
                return
            if runtime.voice is not None:
                runtime.voice.note_user(text, source=str(payload.get("channel") or "chat"))
            asyncio.create_task(runtime.orchestrator.handle_user(
                text, channel=str(payload.get("channel") or "chat")
            ))
        elif kind == "confirm":
            runtime.orchestrator.resolve_confirmation(
                str(payload.get("id")), bool(payload.get("approved"))
            )
        elif kind == "cancel":
            for agent in runtime.orchestrator.agents.values():
                if agent.record.status in {"thinking", "acting"}:
                    agent.cancel()
        elif kind == "speak.done":
            BUS.publish(EventType.SPEECH_END, {"text": str(payload.get("text") or "")[:500]})
        elif kind == "probe":
            await websocket.send_text(json.dumps({
                "type": "probe", "payload": runtime.status(), "ts": time.time(),
            }, default=str))
    except Exception as exc:  # noqa: BLE001
        await websocket.send_text(json.dumps({
            "type": "error", "payload": {"command": kind, "error": str(exc)[:300]},
            "ts": time.time(),
        }))


def _bearer(header: str) -> str:
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return ""


def _placeholder_html(runtime: Runtime) -> str:
    """Shown when the GUI has not been built yet (source checkout)."""
    gaps = runtime.missing_setup()
    items = "".join(f"<li>{gap}</li>" for gap in gaps) or "<li>Nothing missing - you are ready.</li>"
    return f"""<!doctype html>
<html><head><meta charset="utf-8"><title>Vyralis</title>
<style>
 body {{ background:#05070d; color:#cfe6ff; font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
        display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }}
 .card {{ max-width:720px; padding:32px; border:1px solid #16324a; border-radius:16px;
          background:radial-gradient(circle at 50% 0%,#0b1a2b,#05070d 70%); }}
 h1 {{ letter-spacing:.4em; font-size:20px; margin:0 0 4px; color:#7cf; }}
 p.tag {{ color:#4d7ea8; margin:0 0 24px; letter-spacing:.1em; font-size:12px; }}
 code {{ color:#9df; }}
</style></head><body><div class="card">
<h1>VYRALIS</h1><p class="tag">{TAGLINE} &middot; {CODENAME} v{__version__}</p>
<p>The agent backend is running. The graphical interface has not been built in this checkout.</p>
<p>Build it once with:</p>
<p><code>cd ui &amp;&amp; npm install &amp;&amp; npm run build</code></p>
<p>then restart Vyralis, or run <code>npm run dev</code> and open the Vite URL.</p>
<p>Setup still outstanding:</p><ul>{items}</ul>
</div></body></html>"""
