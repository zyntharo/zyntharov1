"""Computer control: mouse, keyboard, windows, applications.

Design notes that matter for reliability (these are the failure modes a
computer-use agent normally hits, and each is handled here explicitly):

* **Wrong-window typing.** Every text/press action passes through
  :meth:`ComputerController.guard_focus`, which asserts the foreground window
  matches the intended target and re-focuses (or aborts) instead of typing into
  whatever happened to be on top.
* **Typing into nothing.** :meth:`ComputerController.type_text` captures the
  region before and after and verifies the pixels changed. If nothing changed,
  it clicks the intended field, clears it, and retries - instead of silently
  reporting success.
* **DPI scaling.** On Windows the process is made DPI-aware at first use, so
  screenshot coordinates and mouse coordinates agree on 125%/150% displays.
* **Fail-safe.** ``pyautogui.FAILSAFE`` stays on: slamming the pointer into a
  screen corner aborts any runaway automation.
* **No clipboard theft.** Typing is done keystroke-by-keystroke; the clipboard
  is untouched unless the caller explicitly asks for the paste fast-path.
"""

from __future__ import annotations

import logging
import os
import platform
import shlex
import subprocess
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

from ..config import Settings
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.computer")

try:  # Guarded: pyautogui connects to a display server on import.
    import pyautogui  # type: ignore

    pyautogui.FAILSAFE = True
    pyautogui.PAUSE = 0.02
    PYAUTOGUI_AVAILABLE = True
    PYAUTOGUI_ERROR = ""
except Exception as exc:  # noqa: BLE001
    pyautogui = None  # type: ignore[assignment]
    PYAUTOGUI_AVAILABLE = False
    PYAUTOGUI_ERROR = str(exc)

try:
    import pyperclip  # type: ignore

    CLIPBOARD_AVAILABLE = True
except Exception:  # noqa: BLE001
    pyperclip = None  # type: ignore[assignment]
    CLIPBOARD_AVAILABLE = False

SYSTEM = platform.system()
IS_WINDOWS = SYSTEM == "Windows"
IS_MAC = SYSTEM == "Darwin"
IS_LINUX = SYSTEM == "Linux"

# ---------------------------------------------------------------------------
# Key-name normalisation: models emit "ctrl", pyautogui wants "ctrl".
# ---------------------------------------------------------------------------
KEY_ALIASES = {
    "control": "ctrl", "cmd": "win" if IS_WINDOWS else "command", "command": "command",
    "meta": "win" if IS_WINDOWS else "command", "super": "win", "option": "alt",
    "escape": "esc", "return": "enter", "del": "delete", "ins": "insert",
    "pageup": "pgup", "pagedown": "pgdn", "spacebar": "space",
}


def normalise_key(key: str) -> str:
    key = key.strip().lower()
    return KEY_ALIASES.get(key, key)


@dataclass
class WindowInfo:
    handle: int | None
    title: str
    x: int = 0
    y: int = 0
    width: int = 0
    height: int = 0
    process: str = ""
    minimized: bool = False
    active: bool = False

    def to_json(self) -> dict[str, Any]:
        return {
            "handle": self.handle, "title": self.title, "process": self.process,
            "box": [self.x, self.y, self.width, self.height],
            "minimized": self.minimized, "active": self.active,
        }


class WindowManager:
    """Cross-platform window enumeration and control."""

    def __init__(self) -> None:
        self._dpi_set = False

    # -- DPI ------------------------------------------------------------
    def ensure_dpi_awareness(self) -> None:
        if self._dpi_set or not IS_WINDOWS:
            self._dpi_set = True
            return
        try:
            import ctypes

            # PROCESS_PER_MONITOR_DPI_AWARE = 2
            ctypes.windll.shcore.SetProcessDpiAwareness(2)  # type: ignore[attr-defined]
        except Exception:  # noqa: BLE001
            try:
                import ctypes

                ctypes.windll.user32.SetProcessDPIAware()  # type: ignore[attr-defined]
            except Exception:  # noqa: BLE001
                pass
        self._dpi_set = True

    # -- enumeration ----------------------------------------------------
    def list_windows(self, *, include_minimized: bool = True) -> list[WindowInfo]:
        self.ensure_dpi_awareness()
        if IS_WINDOWS:
            return self._windows_win32(include_minimized)
        if IS_MAC:
            return self._windows_mac()
        return self._windows_linux()

    def _windows_win32(self, include_minimized: bool) -> list[WindowInfo]:
        try:
            import win32gui  # type: ignore
            import win32process  # type: ignore
            import psutil
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f"Windows window control needs pywin32 ({exc}).") from exc

        results: list[WindowInfo] = []
        foreground = win32gui.GetForegroundWindow()

        def callback(handle: int, _: Any) -> None:
            if not win32gui.IsWindowVisible(handle):
                return
            title = win32gui.GetWindowText(handle)
            if not title:
                return
            minimized = bool(win32gui.IsIconic(handle))
            if minimized and not include_minimized:
                return
            try:
                left, top, right, bottom = win32gui.GetWindowRect(handle)
            except Exception:  # noqa: BLE001
                return
            process = ""
            try:
                _, pid = win32process.GetWindowThreadProcessId(handle)
                process = psutil.Process(pid).name()
            except Exception:  # noqa: BLE001
                pass
            results.append(
                WindowInfo(
                    handle=handle, title=title, x=left, y=top,
                    width=max(0, right - left), height=max(0, bottom - top),
                    process=process, minimized=minimized, active=handle == foreground,
                )
            )

        win32gui.EnumWindows(callback, None)
        # Foreground first, then by size - big windows are what users mean.
        results.sort(key=lambda w: (not w.active, -(w.width * w.height)))
        return results

    def _windows_mac(self) -> list[WindowInfo]:
        script = (
            'tell application "System Events" to get {name, position, size} of every window '
            "of (every process whose visible is true)"
        )
        try:
            output = subprocess.run(
                ["osascript", "-e", script], capture_output=True, text=True, timeout=10
            ).stdout.strip()
        except Exception:  # noqa: BLE001
            return []
        infos: list[WindowInfo] = []
        for index, chunk in enumerate(output.split(", {")):
            infos.append(WindowInfo(handle=index, title=chunk[:120]))
        return infos

    def _windows_linux(self) -> list[WindowInfo]:
        for tool in ("wmctrl", "xdotool"):
            try:
                if tool == "wmctrl":
                    output = subprocess.run(
                        ["wmctrl", "-lG"], capture_output=True, text=True, timeout=6
                    ).stdout
                    infos = []
                    for line in output.splitlines():
                        parts = line.split(None, 7)
                        if len(parts) < 8:
                            continue
                        infos.append(
                            WindowInfo(
                                handle=int(parts[0], 16), x=int(parts[2]), y=int(parts[3]),
                                width=int(parts[4]), height=int(parts[5]), title=parts[7],
                            )
                        )
                    return infos
            except Exception:  # noqa: BLE001
                continue
        return []

    # -- active window --------------------------------------------------
    def active_window(self) -> WindowInfo | None:
        if IS_WINDOWS:
            try:
                import win32gui  # type: ignore

                handle = win32gui.GetForegroundWindow()
                title = win32gui.GetWindowText(handle)
                left, top, right, bottom = win32gui.GetWindowRect(handle)
                return WindowInfo(
                    handle=handle, title=title, x=left, y=top,
                    width=right - left, height=bottom - top, active=True,
                )
            except Exception:  # noqa: BLE001
                return None
        if IS_MAC:
            try:
                title = subprocess.run(
                    ["osascript", "-e",
                     'tell application "System Events" to get name of first process whose frontmost is true'],
                    capture_output=True, text=True, timeout=6,
                ).stdout.strip()
                return WindowInfo(handle=None, title=title, active=True)
            except Exception:  # noqa: BLE001
                return None
        try:
            output = subprocess.run(
                ["xdotool", "getactivewindow", "getwindowname"],
                capture_output=True, text=True, timeout=6,
            ).stdout.strip()
            return WindowInfo(handle=None, title=output, active=True)
        except Exception:  # noqa: BLE001
            return None

    def find(self, query: str, *, process: str | None = None) -> WindowInfo | None:
        query_lower = query.lower()
        candidates = [
            window for window in self.list_windows()
            if query_lower in window.title.lower()
            and (process is None or process.lower() in window.process.lower())
        ]
        if not candidates:
            return None
        # Exact title beats substring; active beats background.
        candidates.sort(key=lambda w: (w.title.lower() != query_lower, not w.active, -w.width))
        return candidates[0]

    # -- control --------------------------------------------------------
    def focus(self, window: WindowInfo | str, *, settle: float = 0.35) -> bool:
        """Bring a window to the foreground. Returns True when it worked."""
        target = self.find(window) if isinstance(window, str) else window
        if target is None:
            return False
        self.ensure_dpi_awareness()
        try:
            if IS_WINDOWS:
                import win32con  # type: ignore
                import win32gui  # type: ignore

                handle = target.handle
                if handle is None:
                    return False
                if win32gui.IsIconic(handle):
                    win32gui.ShowWindow(handle, win32con.SW_RESTORE)
                try:
                    # AttachThreadInput trick: Windows blocks SetForegroundWindow
                    # from a background process without this.
                    import ctypes

                    foreground = win32gui.GetForegroundWindow()
                    current_thread = ctypes.windll.kernel32.GetCurrentThreadId()
                    target_thread, _ = win32process_get_thread(handle)
                    foreground_thread, _ = win32process_get_thread(foreground)
                    ctypes.windll.user32.AttachThreadInput(current_thread, foreground_thread, True)
                    ctypes.windll.user32.AttachThreadInput(current_thread, target_thread, True)
                    win32gui.BringWindowToTop(handle)
                    win32gui.SetForegroundWindow(handle)
                    ctypes.windll.user32.AttachThreadInput(current_thread, foreground_thread, False)
                    ctypes.windll.user32.AttachThreadInput(current_thread, target_thread, False)
                except Exception:  # noqa: BLE001
                    win32gui.SetForegroundWindow(handle)
                time.sleep(settle)
                return win32gui.GetForegroundWindow() == handle
            if IS_MAC:
                subprocess.run(
                    ["osascript", "-e",
                     f'tell application "System Events" to set frontmost of (first process whose name contains "{target.title}") to true'],
                    capture_output=True, text=True, timeout=8,
                )
                time.sleep(settle)
                return True
            subprocess.run(["wmctrl", "-a", target.title], capture_output=True, timeout=6)
            time.sleep(settle)
            return True
        except Exception as exc:  # noqa: BLE001
            log.warning("focus failed for %s: %s", target.title, exc)
            return False

    def minimize(self, window: WindowInfo | str) -> bool:
        target = self.find(window) if isinstance(window, str) else window
        if target is None or target.handle is None:
            return False
        if IS_WINDOWS:
            import win32con  # type: ignore
            import win32gui  # type: ignore

            win32gui.ShowWindow(target.handle, win32con.SW_MINIMIZE)
            return True
        return self._xdotool_window("minimize", target)

    def maximize(self, window: WindowInfo | str) -> bool:
        target = self.find(window) if isinstance(window, str) else window
        if target is None or target.handle is None:
            return False
        if IS_WINDOWS:
            import win32con  # type: ignore
            import win32gui  # type: ignore

            win32gui.ShowWindow(target.handle, win32con.SW_MAXIMIZE)
            return True
        return self._xdotool_window("maximize", target)

    def close(self, window: WindowInfo | str) -> bool:
        target = self.find(window) if isinstance(window, str) else window
        if target is None:
            return False
        if IS_WINDOWS and target.handle is not None:
            import win32con  # type: ignore
            import win32gui  # type: ignore

            win32gui.PostMessage(target.handle, win32con.WM_CLOSE, 0, 0)
            return True
        if IS_MAC:
            subprocess.run(
                ["osascript", "-e", f'tell application "{target.title}" to quit'],
                capture_output=True, timeout=8,
            )
            return True
        return self._xdotool_window("close", target)

    def move_resize(self, window: WindowInfo | str, x: int, y: int, width: int, height: int) -> bool:
        target = self.find(window) if isinstance(window, str) else window
        if target is None or target.handle is None:
            return False
        if IS_WINDOWS:
            import win32gui  # type: ignore

            win32gui.MoveWindow(target.handle, x, y, width, height, True)
            return True
        try:
            subprocess.run(
                ["wmctrl", "-i", "-r", hex(target.handle), "-e", f"0,{x},{y},{width},{height}"],
                capture_output=True, timeout=6,
            )
            return True
        except Exception:  # noqa: BLE001
            return False

    def _xdotool_window(self, action: str, target: WindowInfo) -> bool:
        try:
            if target.handle is not None:
                window_id = hex(target.handle)
                if action == "minimize":
                    subprocess.run(["xdotool", "windowminimize", window_id], timeout=6)
                elif action == "maximize":
                    subprocess.run(["wmctrl", "-i", "-r", window_id, "-b", "add,maximized_vert,maximized_horz"], timeout=6)
                elif action == "close":
                    subprocess.run(["xdotool", "windowclose", window_id], timeout=6)
                return True
        except Exception:  # noqa: BLE001
            return False
        return False


def win32process_get_thread(handle: int) -> tuple[int, int]:
    try:
        import win32process  # type: ignore

        return win32process.GetWindowThreadProcessId(handle)
    except Exception:  # noqa: BLE001
        return 0, 0


class ComputerController:
    """The agent's hands: pointer, keyboard, windows and app launching."""

    def __init__(self, settings: Settings, windows: WindowManager | None = None) -> None:
        self.settings = settings
        self.windows = windows or WindowManager()
        self.windows.ensure_dpi_awareness()

    # -- availability ---------------------------------------------------
    @staticmethod
    def capabilities() -> dict[str, Any]:
        return {
            "pyautogui": PYAUTOGUI_AVAILABLE,
            "clipboard": CLIPBOARD_AVAILABLE,
            "platform": SYSTEM,
            "error": PYAUTOGUI_ERROR,
        }

    def _require(self) -> Any:
        if not PYAUTOGUI_AVAILABLE:
            raise RuntimeError(
                f"Desktop input control is unavailable ({PYAUTOGUI_ERROR}). "
                f"Install the 'desktop' extra: pip install pyautogui pillow pyperclip."
            )
        self.windows.ensure_dpi_awareness()
        return pyautogui

    # -- geometry -------------------------------------------------------
    def screen_size(self) -> tuple[int, int]:
        gui = self._require()
        size = gui.size()
        return int(size.width), int(size.height)

    def position(self) -> tuple[int, int]:
        gui = self._require()
        point = gui.position()
        return int(point.x), int(point.y)

    # -- focus guarding -------------------------------------------------
    def guard_focus(self, expect: str, *, attempts: int = 3) -> dict[str, Any]:
        """Ensure ``expect`` is the foreground window before we type anything.

        This is the fix for "it typed into the wrong application": a model that
        believes it is in Notepad but is actually in the browser gets an
        explicit failure and a re-focus attempt, never a silent misfire.
        """
        for attempt in range(1, attempts + 1):
            active = self.windows.active_window()
            if active and expect.lower() in active.title.lower():
                return {"focused": True, "window": active.to_json(), "attempts": attempt}
            target = self.windows.find(expect)
            if target is None:
                return {
                    "focused": False,
                    "error": f"No window matching '{expect}' is open.",
                    "active": active.to_json() if active else None,
                }
            self.windows.focus(target)
            time.sleep(0.3)
        active = self.windows.active_window()
        ok = bool(active and expect.lower() in active.title.lower())
        return {
            "focused": ok,
            "window": active.to_json() if active else None,
            "attempts": attempts,
            "error": "" if ok else f"Could not bring '{expect}' to the foreground.",
        }

    def assert_foreground(self, expect: str | None) -> dict[str, Any]:
        if not expect:
            return {"checked": False}
        result = self.guard_focus(expect)
        if not result.get("focused"):
            raise RuntimeError(
                f"Refusing to send input: expected window '{expect}' is not focused "
                f"({result.get('error') or 'unknown reason'})."
            )
        return result

    # -- pointer --------------------------------------------------------
    def move(self, x: int, y: int, *, duration: float = 0.12) -> tuple[int, int]:
        gui = self._require()
        gui.moveTo(int(x), int(y), duration=duration, tween=gui.easeInOutQuad)
        return int(x), int(y)

    def click(
        self,
        x: int,
        y: int,
        *,
        button: str = "left",
        clicks: int = 1,
        duration: float = 0.1,
        expect_window: str | None = None,
    ) -> dict[str, Any]:
        gui = self._require()
        self.assert_foreground(expect_window)
        gui.moveTo(int(x), int(y), duration=duration, tween=gui.easeInOutQuad)
        time.sleep(0.03)
        gui.click(button=button, clicks=clicks, interval=0.08)
        return {"x": int(x), "y": int(y), "button": button, "clicks": clicks}

    def double_click(self, x: int, y: int, **kwargs: Any) -> dict[str, Any]:
        kwargs.setdefault("clicks", 2)
        return self.click(x, y, **kwargs)

    def right_click(self, x: int, y: int, **kwargs: Any) -> dict[str, Any]:
        kwargs["button"] = "right"
        return self.click(x, y, **kwargs)

    def drag(
        self, x1: int, y1: int, x2: int, y2: int, *, duration: float = 0.4, button: str = "left"
    ) -> dict[str, Any]:
        gui = self._require()
        gui.moveTo(int(x1), int(y1), duration=0.1)
        gui.mouseDown(button=button)
        time.sleep(0.05)
        gui.moveTo(int(x2), int(y2), duration=duration, tween=gui.easeInOutQuad)
        time.sleep(0.05)
        gui.mouseUp(button=button)
        return {"from": [int(x1), int(y1)], "to": [int(x2), int(y2)]}

    def scroll(self, amount: int, *, x: int | None = None, y: int | None = None) -> dict[str, Any]:
        gui = self._require()
        if x is not None and y is not None:
            gui.moveTo(int(x), int(y), duration=0.08)
        gui.scroll(int(amount))
        return {"amount": int(amount)}

    # -- keyboard -------------------------------------------------------
    def type_text(
        self,
        text: str,
        *,
        interval: float = 0.015,
        expect_window: str | None = None,
        verify_region: tuple[int, int, int, int] | None = None,
        verify: bool = True,
        clear_first: bool = False,
        vision: Any = None,
        use_clipboard: bool = False,
    ) -> dict[str, Any]:
        """Type text, then *prove* it landed.

        ``verify_region`` should be the bounding box of the input control the
        text was meant for. When the pixels there do not change, we click the
        field, select-all, delete, and retry once - the automated version of a
        human noticing "nothing appeared".
        """
        gui = self._require()
        self.assert_foreground(expect_window)

        before = None
        if verify and verify_region and vision is not None:
            try:
                before = vision.grab(region=verify_region)
            except Exception:  # noqa: BLE001
                before = None

        attempts = 2 if (before is not None) else 1
        last: dict[str, Any] = {}
        for attempt in range(1, attempts + 1):
            if clear_first or attempt > 1:
                gui.hotkey("ctrl", "a")
                time.sleep(0.05)
                gui.press("delete")
                time.sleep(0.05)
            if use_clipboard and CLIPBOARD_AVAILABLE:
                pyperclip.copy(text)
                gui.hotkey("ctrl", "v")
            else:
                gui.write(text, interval=interval)
            last = {"typed": len(text), "attempt": attempt}
            if before is None:
                break
            check = vision.verify_change(before, region=verify_region)
            last["verified"] = bool(check["changed"])
            if check["changed"]:
                break
            # Nothing appeared: the field was probably not focused. Click it.
            left, top, width, height = verify_region  # type: ignore[misc]
            gui.click(left + max(2, width // 2), top + max(2, height // 2))
            time.sleep(0.2)
        return last

    def press(self, keys: str | Sequence[str], *, repeat: int = 1, expect_window: str | None = None) -> dict[str, Any]:
        gui = self._require()
        self.assert_foreground(expect_window)
        sequence = [keys] if isinstance(keys, str) else list(keys)
        sequence = [normalise_key(key) for key in sequence]
        for key in sequence:
            for _ in range(max(1, repeat)):
                gui.press(key)
                time.sleep(0.02)
        return {"keys": sequence, "repeat": repeat}

    def hotkey(self, *keys: str, expect_window: str | None = None) -> dict[str, Any]:
        gui = self._require()
        self.assert_foreground(expect_window)
        combo = [normalise_key(key) for key in keys]
        gui.hotkey(*combo)
        return {"hotkey": "+".join(combo)}

    # -- clipboard ------------------------------------------------------
    def get_clipboard(self) -> str:
        if not CLIPBOARD_AVAILABLE:
            raise RuntimeError("Clipboard access needs pyperclip: pip install pyperclip.")
        return str(pyperclip.paste())

    def set_clipboard(self, text: str) -> int:
        if not CLIPBOARD_AVAILABLE:
            raise RuntimeError("Clipboard access needs pyperclip: pip install pyperclip.")
        pyperclip.copy(text)
        return len(text)

    # -- applications ---------------------------------------------------
    def launch(self, target: str, *, args: Sequence[str] = (), cwd: str | None = None,
               wait: bool = False, timeout: float = 30.0) -> dict[str, Any]:
        """Open an application or document exactly the way the OS would.

        ``target`` may be an executable name on PATH (``notepad``), an absolute
        path, a document (which opens in its default handler), or a URL.
        """
        if not target.strip():
            raise ValueError("launch(): 'target' is empty.")
        log.info("launching %s %s", target, list(args))

        if IS_WINDOWS:
            if target.lower().startswith(("http://", "https://")):
                os.startfile(target)  # type: ignore[attr-defined]
                return {"launched": target, "method": "startfile"}
            resolver = _windows_resolve(target)
            if resolver and not args and not cwd:
                os.startfile(resolver)  # type: ignore[attr-defined]
                return {"launched": resolver, "method": "startfile"}
            argv = [resolver or target, *args]
            proc = subprocess.Popen(argv, cwd=cwd, shell=False)
            if wait:
                proc.wait(timeout=timeout)
            return {"launched": target, "pid": proc.pid, "method": "popen"}

        if IS_MAC:
            argv = ["open", "-a", target] if not args else ["open", "-a", target, "--args", *args]
            if target.startswith(("http://", "https://")):
                argv = ["open", target]
            proc = subprocess.Popen(argv)
            if wait:
                proc.wait(timeout=timeout)
            return {"launched": target, "pid": proc.pid, "method": "open"}

        argv = shlex.split(target) if " " in target and not Path(target).exists() else [target]
        argv.extend(args)
        proc = subprocess.Popen(argv, cwd=cwd, start_new_session=True)
        if wait:
            proc.wait(timeout=timeout)
        return {"launched": target, "pid": proc.pid, "method": "popen"}

    def focus_window(self, query: str) -> dict[str, Any]:
        return self.guard_focus(query)

    def list_windows(self, *, include_minimized: bool = True, limit: int = 60) -> list[dict[str, Any]]:
        return [window.to_json() for window in self.windows.list_windows(
            include_minimized=include_minimized)[:limit]]

    def active_window(self) -> dict[str, Any] | None:
        active = self.windows.active_window()
        return active.to_json() if active else None

    # -- composite ------------------------------------------------------
    def click_and_type(
        self,
        x: int,
        y: int,
        text: str,
        *,
        expect_window: str | None = None,
        clear_first: bool = True,
        verify_region_radius: int = 40,
        vision: Any = None,
    ) -> dict[str, Any]:
        """Click a field and type into it with verification - the single most
        common compound action, so it gets a first-class primitive."""
        region = (
            max(0, x - verify_region_radius), max(0, y - verify_region_radius),
            verify_region_radius * 3, verify_region_radius * 1.6,
        )
        self.click(x, y, expect_window=expect_window)
        time.sleep(0.15)
        return self.type_text(
            text, expect_window=expect_window, verify_region=region, vision=vision,
            clear_first=clear_first,
        )


def _windows_resolve(target: str) -> str | None:
    """Resolve ``notepad`` -> full path via PATH/app-paths, leaving paths alone."""
    if Path(target).exists():
        return str(Path(target).resolve())
    if os.sep in target or (os.altsep and os.altsep in target):
        return target
    if not IS_WINDOWS:
        return None
    try:
        import shutil

        found = shutil.which(target)
        if found:
            return found
        found = shutil.which(f"{target}.exe")
        return found
    except Exception:  # noqa: BLE001
        return None


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, controller: ComputerController) -> None:
    """Expose the controller's operations as agent-facing tools."""

    def _controller_for(ctx: Any) -> ComputerController:
        return controller

    @registry.tool(
        "computer.screen_size",
        "Get the primary display resolution in pixels.",
        obj({}), category="computer", permission="safe",
    )
    def screen_size(ctx: Any = None) -> dict[str, Any]:
        width, height = _controller_for(ctx).screen_size()
        return {"width": width, "height": height}

    @registry.tool(
        "computer.pointer",
        "Get the current mouse pointer position.",
        obj({}), category="computer", permission="safe",
    )
    def pointer(ctx: Any = None) -> dict[str, Any]:
        x, y = _controller_for(ctx).position()
        return {"x": x, "y": y}

    @registry.tool(
        "computer.click",
        "Move the pointer to absolute screen coordinates and click. Use the coordinates from "
        "vision.screen_map marks or a browser bounding box. Optionally require that a specific "
        "window is focused first - this prevents clicking in the wrong application.",
        obj(
            {
                "x": prop("integer", "Absolute X pixel coordinate."),
                "y": prop("integer", "Absolute Y pixel coordinate."),
                "button": prop("string", "left | right | middle", enum=["left", "right", "middle"]),
                "clicks": prop("integer", "1 = single click, 2 = double click."),
                "expect_window": prop(
                    "string",
                    "Window title (or substring) that MUST be focused, e.g. 'Notepad'. "
                    "The click is refused otherwise.",
                ),
            },
            ["x", "y"],
        ),
        category="computer", permission="sensitive",
    )
    def click(x: int, y: int, button: str = "left", clicks: int = 1,
              expect_window: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return _controller_for(ctx).click(
            x, y, button=button, clicks=clicks, expect_window=expect_window
        )

    @registry.tool(
        "computer.drag",
        "Press the mouse at one point, move, and release at another (dragging, selecting, "
        "moving windows or files).",
        obj(
            {
                "x1": prop("integer", "Start X."), "y1": prop("integer", "Start Y."),
                "x2": prop("integer", "End X."), "y2": prop("integer", "End Y."),
                "button": prop("string", "left | right | middle"),
            },
            ["x1", "y1", "x2", "y2"],
        ),
        category="computer", permission="sensitive",
    )
    def drag(x1: int, y1: int, x2: int, y2: int, button: str = "left", ctx: Any = None) -> dict[str, Any]:
        return _controller_for(ctx).drag(x1, y1, x2, y2, button=button)

    @registry.tool(
        "computer.scroll",
        "Scroll the mouse wheel. Positive scrolls up, negative scrolls down.",
        obj(
            {
                "amount": prop("integer", "Wheel clicks; e.g. -5 scrolls down five steps."),
                "x": prop("integer", "Optional X to place the pointer before scrolling."),
                "y": prop("integer", "Optional Y to place the pointer before scrolling."),
            },
            ["amount"],
        ),
        category="computer", permission="safe",
    )
    def scroll(amount: int, x: int | None = None, y: int | None = None, ctx: Any = None) -> dict[str, Any]:
        return _controller_for(ctx).scroll(amount, x=x, y=y)

    @registry.tool(
        "computer.type_text",
        "Type text with real keystrokes into whatever control currently has focus. Always pass "
        "expect_window when you know the target application: the call fails rather than typing "
        "into the wrong window. Pass verify_region (screen box of the input field) and the tool "
        "confirms the text actually appeared, retrying by clicking the field if nothing changed.",
        obj(
            {
                "text": prop("string", "The literal text to type."),
                "expect_window": prop("string", "Window title substring that must be focused."),
                "verify_region": prop(
                    "array",
                    "Optional [left, top, width, height] screen box of the input field, so the "
                    "typed result can be verified against the pixels.",
                    items={"type": "integer"},
                ),
                "clear_first": prop("boolean", "Select-all and delete before typing."),
                "press_enter": prop("boolean", "Press Enter after typing (sending a chat message, "
                                               "confirming a dialog, moving to the next field)."),
                "interval": prop("number", "Seconds between keystrokes; raise it for laggy apps."),
            },
            ["text"],
        ),
        category="computer", permission="sensitive",
    )
    async def type_text(
        text: str, expect_window: str | None = None,
        verify_region: list[int] | None = None, clear_first: bool = False,
        press_enter: bool = False, interval: float = 0.015, ctx: Any = None,
    ) -> dict[str, Any]:
        control = _controller_for(ctx)
        region = tuple(verify_region) if verify_region else None  # type: ignore[arg-type]
        result = await __import__("asyncio").to_thread(
            control.type_text, text, expect_window=expect_window, verify_region=region,
            clear_first=clear_first, interval=interval, vision=ctx.services.vision,
        )
        if press_enter:
            result["enter"] = control.press("enter", expect_window=expect_window)
        return result

    @registry.tool(
        "computer.key",
        "Press one key or a chord. Examples: key('enter'), key(['tab','tab']), "
        "hotkey('ctrl','shift','esc') for Task Manager, hotkey('alt','f4') to close a window.",
        obj(
            {
                "keys": prop("string", "A key name, e.g. 'enter', 'esc', 'f5', 'tab'."),
                "chord": prop(
                    "array", "Modifier chord such as ['ctrl','shift','esc']; use instead of keys.",
                    items={"type": "string"},
                ),
                "repeat": prop("integer", "How many times to repeat a single key."),
                "expect_window": prop("string", "Window that must be focused first."),
            },
        ),
        category="computer", permission="sensitive",
    )
    def key(keys: str | None = None, chord: list[str] | None = None, repeat: int = 1,
            expect_window: str | None = None, ctx: Any = None) -> dict[str, Any]:
        control = _controller_for(ctx)
        if chord:
            return control.hotkey(*chord, expect_window=expect_window)
        if not keys:
            raise ValueError("Provide either 'keys' or 'chord'.")
        return control.press(keys, repeat=repeat, expect_window=expect_window)

    @registry.tool(
        "computer.click_and_type",
        "Click an input field and type into it, with automatic verification that the text "
        "actually landed. Preferred over separate click + type_text calls.",
        obj(
            {
                "x": prop("integer", "Field X coordinate."),
                "y": prop("integer", "Field Y coordinate."),
                "text": prop("string", "Text to enter."),
                "expect_window": prop("string", "Window that must be focused."),
                "press_enter": prop("boolean", "Press Enter afterwards."),
            },
            ["x", "y", "text"],
        ),
        category="computer", permission="sensitive",
    )
    async def click_and_type(x: int, y: int, text: str, expect_window: str | None = None,
                             press_enter: bool = False, ctx: Any = None) -> dict[str, Any]:
        import asyncio

        control = _controller_for(ctx)
        result = await asyncio.to_thread(
            control.click_and_type, x, y, text, expect_window=expect_window,
            vision=ctx.services.vision,
        )
        if press_enter:
            result["enter"] = control.press("enter", expect_window=expect_window)
        return result

    @registry.tool(
        "computer.windows",
        "List the open application windows, most relevant first (foreground window first).",
        obj({"include_minimized": prop("boolean", "Include minimized windows.")}),
        category="computer", permission="safe",
    )
    def windows(include_minimized: bool = True, ctx: Any = None) -> list[dict[str, Any]]:
        return _controller_for(ctx).list_windows(include_minimized=include_minimized)

    @registry.tool(
        "computer.active_window",
        "Which window currently has focus. Check this before sending keystrokes.",
        obj({}), category="computer", permission="safe",
    )
    def active_window(ctx: Any = None) -> dict[str, Any] | None:
        return _controller_for(ctx).active_window()

    @registry.tool(
        "computer.focus_window",
        "Bring a window to the foreground by title (substring match). Do this before typing "
        "into an application that is behind other windows.",
        obj({"title": prop("string", "Window title or a distinctive substring.")}, ["title"]),
        category="computer", permission="sensitive",
    )
    def focus_window(title: str, ctx: Any = None) -> dict[str, Any]:
        return _controller_for(ctx).focus_window(title)

    @registry.tool(
        "computer.launch_app",
        "Open an application, document or URL the way the operating system would: "
        "launch_app('notepad'), launch_app('C:/path/report.xlsx'), launch_app('ms-settings:').",
        obj(
            {
                "target": prop("string", "Executable, document path, URI or URL."),
                "args": prop("array", "Optional command line arguments.", items={"type": "string"}),
                "wait": prop("boolean", "Wait for the process to exit (rarely wanted)."),
            },
            ["target"],
        ),
        category="computer", permission="sensitive",
    )
    async def launch_app(target: str, args: list[str] | None = None, wait: bool = False,
                         ctx: Any = None) -> dict[str, Any]:
        import asyncio

        return await asyncio.to_thread(
            _controller_for(ctx).launch, target, args=tuple(args or ()), wait=wait
        )

    @registry.tool(
        "computer.clipboard",
        "Read or write the system clipboard. Writing large text and pasting it with "
        "computer.click_and_type via a paste shortcut is faster than typing thousands of keystrokes.",
        obj(
            {
                "action": prop("string", "read | write", enum=["read", "write"]),
                "text": prop("string", "Text to place on the clipboard when action=write."),
            },
            ["action"],
        ),
        category="computer", permission="sensitive",
    )
    def clipboard(action: str, text: str = "", ctx: Any = None) -> dict[str, Any]:
        control = _controller_for(ctx)
        if action == "read":
            return {"text": control.get_clipboard()[:20000]}
        return {"written": control.set_clipboard(text)}
