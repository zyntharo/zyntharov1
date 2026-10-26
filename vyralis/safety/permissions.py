"""Safety policy: who may do what, and when the human must be asked.

Three concentric controls:

1. **Permission classes** per tool (``safe`` / ``sensitive`` / ``destructive``).
2. **Agent grants** - the orchestrator hands each subagent an explicit tool
   allowlist and can revoke individual tools at any time. A worker that only
   needs to read a spreadsheet cannot delete a folder.
3. **Human confirmation** - destructive actions, or anything in
   ``settings.require_confirmation_for``, block on a real answer from the user
   before they run. In every non-interactive context the answer defaults to
   *no*, so nothing destructive can happen by accident.

Plus :class:`PathGuard`, which keeps filesystem tools inside the configured
allowlist (which defaults to the user's home plus a scratch area).
"""

from __future__ import annotations

import fnmatch
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from ..config import Settings

log = logging.getLogger("vyralis.safety")

PERMISSION_RANK = {"safe": 0, "sensitive": 1, "destructive": 2}

# Tools that are always blocked regardless of grants. Kept tiny and explicit:
# this is the "never automate this" list, not a general policy knob.
NEVER = {
    "system.raw_disk_write",
}

SHELL_ALLOW_DEFAULT = {
    # Read-mostly introspection commands used by the shell tool in strict mode.
    "dir", "ls", "cat", "type", "echo", "pwd", "cd", "where", "which", "whoami",
    "ipconfig", "ifconfig", "tasklist", "ps", "systeminfo", "ver", "date", "time",
    "ping", "tracert", "nslookup", "wmic", "git", "python", "python3", "pip", "node",
    "npm", "npx", "ffmpeg", "magick", "7z", "tar",
}

SHELL_DENY_PATTERNS = (
    "rm -rf /", "rm -rf ~", "del /f /s /q c:\\", "format ", "diskpart",
    "mkfs", ":(){:|:&};:", "shutdown /r /t 0 --force", "reg delete hklm",
    "net user ", "vssadmin delete", "cipher /w", "bcdedit",
)


@dataclass
class Decision:
    allow: bool
    ask: bool = False
    reason: str = ""

    @classmethod
    def allowed(cls, reason: str = "") -> "Decision":
        return cls(True, False, reason)

    @classmethod
    def needs_human(cls, reason: str) -> "Decision":
        return cls(True, True, reason)

    @classmethod
    def blocked(cls, reason: str) -> "Decision":
        return cls(False, False, reason)


class Policy:
    """Decides whether a tool call may proceed."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    # -- authorization --------------------------------------------------
    def authorize(
        self,
        tool: str,
        args: dict,
        *,
        agent_role: str = "employee",
        agent_grants: Iterable[str] | None = None,
    ) -> Decision:
        if tool in NEVER:
            return Decision.blocked(f"'{tool}' is permanently disabled.")

        if agent_grants is not None and tool not in set(agent_grants):
            return Decision.blocked(f"'{tool}' is outside this agent's grant.")

        mode = (self.settings.permission_mode or "ask").lower()
        if mode == "deny":
            return Decision.blocked("Permission mode is set to 'deny'.")

        must_confirm = any(
            fnmatch.fnmatch(tool, pattern) for pattern in self.settings.require_confirmation_for
        )
        if must_confirm:
            return Decision.needs_human(
                f"'{tool}' is on the confirmation list ({self.settings.permission_mode} mode)."
            )

        if mode == "auto":
            return Decision.allowed("auto mode")

        # mode == "ask": only destructive/high-impact work stops for a human.
        return Decision.allowed("ask mode: safe/sensitive action")

    def classify(self, tool: str, permission: str) -> Decision:
        if PERMISSION_RANK.get(permission, 0) >= PERMISSION_RANK["destructive"]:
            return Decision.needs_human(f"'{tool}' is destructive.")
        return Decision.allowed()

    # -- shell screening ------------------------------------------------
    def screen_command(self, command: str) -> Decision:
        lowered = command.lower().strip()
        for pattern in SHELL_DENY_PATTERNS:
            if pattern in lowered:
                return Decision.blocked(f"Command matches forbidden pattern '{pattern}'.")
        if self.settings.permission_mode == "auto":
            return Decision.allowed("auto mode")
        return Decision.needs_human("Shell commands require confirmation in 'ask' mode.")


class PathGuard:
    """Confines filesystem tools to an allowlist of directories."""

    def __init__(self, settings: Settings) -> None:
        roots = settings.fs_allowlist or [str(Path.home())]
        self.roots = [Path(root).expanduser().resolve() for root in roots]

    def add_root(self, path: str | Path) -> None:
        resolved = Path(path).expanduser().resolve()
        if resolved not in self.roots:
            self.roots.append(resolved)

    def check(self, path: str | Path, *, must_exist: bool = False) -> Path:
        candidate = Path(path).expanduser()
        try:
            resolved = candidate.resolve(strict=must_exist)
        except (OSError, RuntimeError) as exc:
            raise PermissionError(f"Cannot resolve path '{path}': {exc}") from exc

        for root in self.roots:
            if resolved == root or root in resolved.parents:
                return resolved
        raise PermissionError(
            f"Path '{resolved}' is outside the allowed directories: "
            f"{', '.join(str(root) for root in self.roots)}. "
            f"Add it in Settings -> Permissions to allow it."
        )

    def describe(self) -> list[str]:
        return [str(root) for root in self.roots]


def env_path_extra() -> list[str]:
    """Extra roots from env (used by tests and portable installs)."""
    raw = os.environ.get("VYRALIS_FS_ALLOWLIST", "")
    return [part for part in raw.split(os.pathsep) if part.strip()]
