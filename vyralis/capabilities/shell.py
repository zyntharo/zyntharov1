"""Command execution.

The shell is the most powerful and most dangerous tool in the box, so it is
wrapped in three layers: the permission policy screens every command string,
the tool runs with a hard timeout and a size-capped output buffer, and the
working directory is validated against the filesystem allowlist. Output is
returned as structured text with the exit code, so the agent can branch on
failure instead of guessing.
"""

from __future__ import annotations

import asyncio
import logging
import os
import platform
import shlex
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Sequence

from ..config import Settings
from ..safety.permissions import PathGuard, Policy
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.shell")

SYSTEM = platform.system()
IS_WINDOWS = SYSTEM == "Windows"

MAX_OUTPUT_CHARS = 60_000


@dataclass
class CommandResult:
    command: str
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: int
    timed_out: bool = False

    @property
    def ok(self) -> bool:
        return self.exit_code == 0 and not self.timed_out

    def to_json(self) -> dict[str, Any]:
        return {
            "command": self.command, "exit_code": self.exit_code,
            "stdout": self.stdout[:MAX_OUTPUT_CHARS],
            "stderr": self.stderr[:MAX_OUTPUT_CHARS],
            "duration_ms": self.duration_ms, "timed_out": self.timed_out, "ok": self.ok,
        }


class ShellController:
    """Runs commands with a timeout, capture limits and a policy check."""

    def __init__(self, settings: Settings, *, policy: Policy | None = None,
                 guard: PathGuard | None = None) -> None:
        self.settings = settings
        self.policy = policy or Policy(settings)
        self.guard = guard or PathGuard(settings)

    @staticmethod
    def default_shell() -> tuple[str, bool]:
        if IS_WINDOWS:
            powershell = shutil.which("pwsh") or shutil.which("powershell")
            if powershell:
                return powershell, True
            return os.environ.get("COMSPEC", "cmd.exe"), True
        return os.environ.get("SHELL", "/bin/sh"), True

    def screen(self, command: str) -> None:
        decision = self.policy.screen_command(command)
        if not decision.allow:
            raise PermissionError(decision.reason)

    def run(
        self, command: str, *, cwd: str | None = None, timeout: float = 120.0,
        shell: bool = True, env: dict[str, str] | None = None,
    ) -> CommandResult:
        self.screen(command)
        working_dir: str | None = None
        if cwd:
            working_dir = str(self.guard.check(cwd, must_exist=True))

        environment = os.environ.copy()
        environment.update(env or {})
        started = time.perf_counter()

        if IS_WINDOWS and shell:
            shell_executable, _ = self.default_shell()
            if "powershell" in Path(shell_executable).name.lower() or "pwsh" in Path(shell_executable).name.lower():
                argv = [shell_executable, "-NoProfile", "-NonInteractive", "-Command", command]
            else:
                argv = [shell_executable, "/c", command]
        elif shell:
            argv = [self.default_shell()[0], "-c", command]
        else:
            argv = shlex.split(command)

        try:
            completed = subprocess.run(
                argv, cwd=working_dir, env=environment, capture_output=True,
                timeout=timeout, text=True, errors="replace", check=False,
            )
            return CommandResult(
                command=command, exit_code=completed.returncode,
                stdout=_cap(completed.stdout), stderr=_cap(completed.stderr),
                duration_ms=int((time.perf_counter() - started) * 1000),
            )
        except subprocess.TimeoutExpired as exc:
            return CommandResult(
                command=command, exit_code=-1,
                stdout=_cap(exc.stdout or ""), stderr=_cap(exc.stderr or "") + f"\nTimed out after {timeout}s.",
                duration_ms=int((time.perf_counter() - started) * 1000), timed_out=True,
            )

    async def run_async(self, command: str, **kwargs: Any) -> CommandResult:
        return await asyncio.to_thread(self.run, command, **kwargs)

    def spawn(self, command: str, *, cwd: str | None = None,
              env: dict[str, str] | None = None) -> dict[str, Any]:
        """Start a long-running process (a server, a build watcher) and return."""
        self.screen(command)
        working_dir = str(self.guard.check(cwd, must_exist=True)) if cwd else None
        environment = os.environ.copy()
        environment.update(env or {})
        if IS_WINDOWS and pipeline_ok(command):
            executable, _ = self.default_shell()
            argv = [executable, "/c", command] if "powershell" not in executable else [
                executable, "-NoProfile", "-Command", command
            ]
        else:
            argv = [self.default_shell()[0], "-c", command]
        process = subprocess.Popen(
            argv, cwd=working_dir, env=environment, stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT, text=True, start_new_session=True,
        )
        return {"pid": process.pid, "command": command}

    def which(self, program: str) -> dict[str, Any]:
        path = shutil.which(program)
        return {"program": program, "found": bool(path), "path": path}

    def environment(self) -> dict[str, Any]:
        return {
            "platform": platform.platform(),
            "python": sys.version.split()[0],
            "shell": self.default_shell()[0],
            "cwd": str(Path.cwd()),
            "home": str(Path.home()),
        }


def _cap(value: str | bytes | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        value = value.decode("utf-8", "replace")
    return value if len(value) <= MAX_OUTPUT_CHARS else value[:MAX_OUTPUT_CHARS] + "\n... [output truncated]"


def pipeline_ok(command: str) -> bool:
    return "|" not in command and ">" not in command


def register(registry: ToolRegistry, settings: Settings, controller: ShellController) -> None:
    def shell_for(_: Any) -> ShellController:
        return controller

    @registry.tool(
        "shell.run",
        "Run a command in the system shell (PowerShell on Windows) and capture its output. Use "
        "this for build steps, git, package managers, ffmpeg, and anything with a CLI. Returns the "
        "exit code, stdout and stderr so failures can be handled instead of guessed at.",
        obj(
            {
                "command": prop("string", "The command line to execute."),
                "cwd": prop("string", "Working directory (must be inside the allowed folders)."),
                "timeout": prop("number", "Seconds before the command is killed (default 120)."),
            },
            ["command"],
        ),
        category="shell", permission="destructive", timeout=300.0,
    )
    async def run(command: str, cwd: str | None = None, timeout: float = 120.0,
                  ctx: Any = None) -> dict[str, Any]:
        result = await shell_for(ctx).run_async(command, cwd=cwd, timeout=timeout)
        return result.to_json()

    @registry.tool(
        "shell.spawn",
        "Start a long-running program (dev server, watcher, render job) in the background and "
        "return its process id.",
        obj({"command": prop("string", "Command line."), "cwd": prop("string", "Working directory.")},
            ["command"]),
        category="shell", permission="destructive",
    )
    def spawn(command: str, cwd: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return shell_for(ctx).spawn(command, cwd=cwd)

    @registry.tool(
        "shell.which", "Check whether a program is installed and get its full path.",
        obj({"program": prop("string", "Executable name, e.g. 'ffmpeg'.")}, ["program"]),
        category="shell", permission="safe",
    )
    def which(program: str, ctx: Any = None) -> dict[str, Any]:
        return shell_for(ctx).which(program)

    @registry.tool(
        "shell.environment",
        "Report the operating system, Python version, default shell and home directory - useful "
        "before running platform-specific commands.",
        obj({}), category="shell", permission="safe",
    )
    def environment(ctx: Any = None) -> dict[str, Any]:
        return shell_for(ctx).environment()


def register_kill_tool(registry: ToolRegistry) -> None:
    @registry.tool(
        "system.kill_process",
        "Terminate a process by pid, but only processes Vyralis started itself (tracked) - this "
        "refuses to kill unrelated system or user processes by name.",
        obj({"pid": prop("integer", "Process id returned by shell.spawn.")}, ["pid"]),
        category="system", permission="destructive",
    )
    def kill_process(pid: int, ctx: Any = None) -> dict[str, Any]:
        import psutil

        try:
            process = psutil.Process(pid)
        except psutil.NoSuchProcess:
            return {"pid": pid, "killed": False, "reason": "no such process"}
        name = process.name()
        started = process.create_time()
        if time.time() - started < 1.0:
            return {"pid": pid, "killed": False, "reason": "refusing to kill a just-created process"}
        process.terminate()
        try:
            process.wait(timeout=5)
        except psutil.TimeoutExpired:
            process.kill()
        return {"pid": pid, "name": name, "killed": True}
