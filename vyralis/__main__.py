"""Vyralis command line.

    vyralis              start the app (backend + interface window)
    vyralis serve        backend only (headless / remote GUI)
    vyralis doctor       check the install and report exactly what is missing
    vyralis chat         talk to VYRA in the terminal
    vyralis skills       list, run and inspect recorded skills
    vyralis plugins      list, install and inspect plugins
    vyralis config       show effective settings and provider status
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import platform
import sys
import threading
import time
import webbrowser
from pathlib import Path
from typing import Any

from . import CODENAME, TAGLINE, __version__
from .config import is_frozen, paths, settings
from .logging_setup import setup as setup_logging
from .runtime import Runtime

BANNER = f"""
  VYRALIS  v{__version__}
  {TAGLINE}
  {CODENAME}
"""


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="vyralis", description=f"{TAGLINE} ({CODENAME})")
    parser.add_argument("--version", action="version", version=f"Vyralis {__version__}")
    parser.add_argument("--verbose", "-v", action="store_true", help="debug-level logging")
    sub = parser.add_subparsers(dest="command")

    run = sub.add_parser("run", help="start the backend and open the interface window")
    run.add_argument("--no-window", action="store_true", help="do not open a window")
    run.add_argument("--browser", action="store_true", help="open in the default web browser instead")
    run.add_argument("--host", default=None)
    run.add_argument("--port", type=int, default=None)

    serve = sub.add_parser("serve", help="run the backend only")
    serve.add_argument("--host", default=None)
    serve.add_argument("--port", type=int, default=None)
    serve.add_argument("--reload", action="store_true")

    sub.add_parser("doctor", help="diagnose the installation")

    chat = sub.add_parser("chat", help="terminal conversation with VYRA")
    chat.add_argument("--say", help="send a single message and exit")

    skills = sub.add_parser("skills", help="inspect recorded skills")
    skills.add_argument("action", nargs="?", default="list", choices=["list", "run", "forget"])
    skills.add_argument("--id", dest="skill_id")
    skills.add_argument("--inputs", default="{}")

    plugins = sub.add_parser("plugins", help="inspect and manage plugins")
    plugins.add_argument("action", nargs="?", default="list",
                         choices=["list", "reload", "uninstall", "install"])
    plugins.add_argument("--id", dest="plugin_id")
    plugins.add_argument("--path")

    sub.add_parser("config", help="show effective configuration")
    sub.add_parser("tools", help="list every registered tool")
    return parser


# ---------------------------------------------------------------------------
async def _boot(start_watchdogs: bool = True) -> Runtime:
    runtime = Runtime()
    await runtime.boot(start_watchdogs=start_watchdogs)
    return runtime


def command_run(args: argparse.Namespace) -> int:
    import uvicorn

    from .server.app import create_app

    settings_obj = settings()
    host = args.host or settings_obj.host
    port = args.port or settings_obj.port
    settings_obj.host, settings_obj.port = host, port
    settings_obj.save(paths())

    runtime = Runtime(settings_obj, paths())
    app = create_app(runtime)

    @app.on_event("startup")
    async def _startup() -> None:
        await runtime.boot()

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        await runtime.shutdown()

    url = f"http://{host}:{port}/?token={settings_obj.token}"
    config = uvicorn.Config(app, host=host, port=port, log_level="warning", access_log=False)
    server = uvicorn.Server(config)

    if args.no_window:
        print(BANNER)
        print(f"Interface: {url}")
        print("Press Ctrl+C to stop.")
        return _run_server_blocking(server)

    opened = False
    if not args.browser:
        opened = _open_webview(url, settings_obj)
    if not opened:
        print(BANNER)
        print(f"Opening the interface in your browser: {url}")
        webbrowser.open(url)
    return _run_server_blocking(server)


def _run_server_blocking(server: Any) -> int:
    try:
        server.run()
    except KeyboardInterrupt:
        print("\nVyralis stopped.")
    return 0


def _open_webview(url: str, settings_obj: Any) -> bool:
    """Open a native window using the OS webview engine (no bundled Chromium)."""
    try:
        import webview  # type: ignore
    except Exception:  # noqa: BLE001
        return False
    try:
        window = webview.create_window(
            title=f"VYRALIS - {TAGLINE}",
            url=url,
            width=1440,
            height=920,
            min_size=(1080, 720),
            background_color="#05070D",
            text_select=False,
        )
        # The server runs on the main thread's event loop below; pywebview needs
        # its own loop, so start it non-blocking and let uvicorn own the main one.
        webview.start(debug=False, private_mode=False)
        return window is not None
    except Exception:  # noqa: BLE001
        return False


def command_serve(args: argparse.Namespace) -> int:
    return command_run(argparse.Namespace(
        host=args.host, port=args.port, no_window=True, browser=False
    ))


# ---------------------------------------------------------------------------
def command_doctor(args: argparse.Namespace) -> int:
    print(BANNER)
    checks: list[tuple[str, bool, str]] = []

    python_ok = sys.version_info >= (3, 11)
    checks.append(("Python 3.11+", python_ok, platform.python_version()))

    import importlib.util

    for module, label, extra in (
        ("fastapi", "Server framework (fastapi)", "core"),
        ("uvicorn", "ASGI server (uvicorn)", "core"),
        ("httpx", "HTTP client (httpx)", "core"),
        ("psutil", "System metrics (psutil)", "core"),
        ("pyautogui", "Mouse/keyboard control (pyautogui)", "desktop"),
        ("PIL", "Screen capture (pillow)", "desktop"),
        ("pyperclip", "Clipboard (pyperclip)", "desktop"),
        ("playwright", "Browser control (playwright)", "browser"),
        ("docx", "Word (python-docx)", "office"),
        ("openpyxl", "Excel (openpyxl)", "office"),
        ("pptx", "PowerPoint (python-pptx)", "office"),
        ("pypdf", "PDF (pypdf)", "office"),
        ("webview", "Desktop window (pywebview)", "gui"),
        ("sounddevice", "Microphone capture (sounddevice)", "voice"),
        ("faster_whisper", "Local speech recognition (faster-whisper)", "voice"),
        ("wmi", "Windows sensor telemetry (wmi)", "hardware"),
    ):
        present = importlib.util.find_spec(module) is not None
        hint = "" if present else f"pip install 'vyralis[{extra}]'"
        checks.append((label, present, hint))

    width = max(len(label) for label, _, _ in checks) + 2
    for label, present, detail in checks:
        mark = "OK  " if present else "--  "
        print(f"  {mark}{label.ljust(width)}{detail if not present else ''}")

    print("\nRuntime configuration")
    runtime_paths = paths()
    print(f"  data directory : {runtime_paths.root}")
    settings_obj = settings()
    print(f"  listening on   : {settings_obj.host}:{settings_obj.port}")
    print(f"  permission mode: {settings_obj.permission_mode}")
    providers = settings_obj.providers
    if not providers:
        print("  providers      : NONE CONFIGURED")
    for provider in providers:
        key = "key set" if provider.resolved_key() else "NO KEY"
        state = "enabled" if provider.enabled else "disabled"
        print(f"  provider       : {provider.id:<10} {state:<9} {key:<8} {provider.base_url}")

    try:
        runtime = Runtime(settings_obj, runtime_paths)
        status = runtime.status()
        print(f"\nCapabilities: {len(runtime.registry.names())} tools registered")
        caps = status["capabilities"]
        print(f"  vision  : capture={caps['vision']['pillow']} ocr={caps['vision']['ocr']}")
        print(f"  computer: available={caps['computer']['pyautogui']} ({caps['computer']['platform']})")
        browser_caps = caps["browser"]
        installed = [name for name, ok in browser_caps["installed_browsers"].items() if ok]
        print(f"  browser : playwright={browser_caps['playwright']} installed={installed or 'none'}")
        print(f"  office  : {json.dumps({k: v for k, v in caps['office'].items() if isinstance(v, bool)})}")
        print(f"  hardware: {json.dumps(runtime.services.hardware.discover_sources())}")
        gaps = runtime.missing_setup()
        print("\nStill to do:")
        if gaps:
            for gap in gaps:
                print(f"  - {gap}")
        else:
            print("  - nothing, you are ready")
        runtime.store.close()
    except Exception as exc:  # noqa: BLE001
        print(f"\nCould not build the runtime: {type(exc).__name__}: {exc}")
    return 0


# ---------------------------------------------------------------------------
def command_chat(args: argparse.Namespace) -> int:
    async def run() -> int:
        runtime = await _boot(start_watchdogs=False)
        print(BANNER)
        if not runtime.settings.active_providers:
            print("No provider is configured. Add one with:")
            print("  set VYRALIS_PRIMARY_BASE_URL / VYRALIS_PRIMARY_API_KEY / VYRALIS_PRIMARY_MODEL")
            print("or use the interface's Settings panel.\n")
        try:
            if args.say:
                result = await runtime.orchestrator.handle_user(args.say, channel="cli")
                print(result.report or result.error)
                return 0 if result.ok else 1
            print("Type your request. 'exit' to quit.\n")
            while True:
                try:
                    text = input("you > ").strip()
                except (EOFError, KeyboardInterrupt):
                    break
                if text.lower() in {"exit", "quit", ":q"}:
                    break
                if not text:
                    continue
                result = await runtime.orchestrator.handle_user(text, channel="cli")
                print()
                print(result.report or f"ERROR: {result.error}")
                print(f"\n[{result.steps} steps · {result.model} · "
                      f"{result.tokens_in + result.tokens_out} tokens · {result.duration_s:.1f}s]\n")
        finally:
            await runtime.shutdown()
        return 0

    return asyncio.run(run())


def command_skills(args: argparse.Namespace) -> int:
    async def run() -> int:
        runtime = await _boot(start_watchdogs=False)
        try:
            if args.action == "list":
                skills = runtime.skills.list()
                if not skills:
                    print("No skills recorded yet. Ask VYRA to record one while it works.")
                for skill in skills:
                    print(f"\n{skill.name}  [{skill.id}]")
                    print(f"  {skill.description[:160]}")
                    print(f"  steps={len(skill.steps)} uses={skill.uses} "
                          f"reliability={skill.reliability:.0%} stale={skill.stale}")
                    print(f"  inputs={list(skill.parameters)}")
            elif args.action == "run":
                if not args.skill_id:
                    print("--id is required")
                    return 2
                from .tools.context import ToolContext

                context = ToolContext(
                    agent_id="cli", store=runtime.store, settings=runtime.settings,
                    services=runtime.services, confirm=runtime.confirm,
                )
                inputs = json.loads(args.inputs)
                print(json.dumps(await runtime.skills.run(args.skill_id, inputs, context), indent=2))
            elif args.action == "forget":
                if not args.skill_id:
                    print("--id is required")
                    return 2
                print(runtime.skills.forget(args.skill_id))
        finally:
            await runtime.shutdown()
        return 0

    return asyncio.run(run())


def command_plugins(args: argparse.Namespace) -> int:
    async def run() -> int:
        runtime = await _boot(start_watchdogs=False)
        try:
            if args.action == "list":
                rows = runtime.plugins.status()
                if not rows:
                    print("No plugins installed.")
                for row in rows:
                    mark = "OK  " if row.get("ok", True) else "FAIL"
                    print(f"{mark} {row['id']:<24} v{row.get('version', '?')}  "
                          f"{len(row.get('tools') or [])} tool(s)")
                    if row.get("error"):
                        print(f"       {row['error'][:160]}")
            elif args.action == "reload":
                if not args.plugin_id:
                    print("--id is required")
                    return 2
                print(json.dumps(runtime.plugins.reload(args.plugin_id), indent=2))
            elif args.action == "uninstall":
                if not args.plugin_id:
                    print("--id is required")
                    return 2
                print(json.dumps(runtime.plugins.uninstall(args.plugin_id), indent=2))
            elif args.action == "install":
                if not args.path:
                    print("--path is required")
                    return 2
                print(json.dumps(runtime.plugins.install(Path(args.path)), indent=2))
        finally:
            await runtime.shutdown()
        return 0

    return asyncio.run(run())


def command_config(args: argparse.Namespace) -> int:
    settings_obj = settings()
    payload = settings_obj.redacted()
    print(f"data directory: {paths().root}")
    print(json.dumps(payload, indent=2, default=str))
    return 0


def command_tools(args: argparse.Namespace) -> int:
    async def run() -> int:
        runtime = await _boot(start_watchdogs=False)
        try:
            for category, tools in sorted(runtime.registry.by_category().items()):
                print(f"\n{category}  ({len(tools)})")
                for tool in tools:
                    print(f"  {tool.name:<34} {tool.spec.permission:<12} {tool.spec.description[:80]}")
        finally:
            await runtime.shutdown()
        return 0

    return asyncio.run(run())


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    setup_logging(logging.DEBUG if args.verbose else logging.INFO,
                  to_bus=args.command not in {None, "doctor"})

    command = args.command or "run"
    if command == "run" and not hasattr(args, "no_window"):
        args.no_window = False
        args.browser = False
        args.host = None
        args.port = None

    dispatch = {
        "run": command_run,
        "serve": command_serve,
        "doctor": command_doctor,
        "chat": command_chat,
        "skills": command_skills,
        "plugins": command_plugins,
        "config": command_config,
        "tools": command_tools,
    }
    handler = dispatch.get(command, command_run)
    try:
        return handler(args)
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
