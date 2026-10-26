"""Browser control.

Three deliberate decisions:

**1. Drive the browser the user already has.** Vyralis never ships or downloads
    a browser. :meth:`BrowserController.start` launches the installed Chrome /
    Edge / Brave through Playwright's ``channel`` mechanism, using a
    persistent profile directory under the Vyralis data folder. If the user
    already has a Chrome running with ``--remote-debugging-port``, we attach to
    it over CDP instead, which means their real logged-in sessions, extensions
    and tabs are all available.

**2. Two equivalent senses.** Any web page can be understood either as pixels
    (:meth:`screenshot` -> a vision model) or as structure
    (:meth:`snapshot` -> a numbered list of every interactive element with its
    role, accessible name, current value and screen coordinates). A model with
    no vision at all still knows exactly where the search box is and can click
    it by reference. The snapshot marks and the screenshot marks are the same
    set of objects, so switching between the two mid-task is seamless.

**3. The browser chrome is not the page.** Refresh, extension icons, the Lens
    button, the profile avatar and the three-dot menu live in browser UI that
    no DOM query can reach. :meth:`chrome_menu` and :meth:`chrome_shortcut`
    handle those through the real keyboard (Alt+F, F5, Ctrl+T ...) plus a
    screen map the agent can click into - the "mix vision and browser control"
    behaviour the product is specified to have.
"""

from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import platform
import shutil
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

from ..config import Settings
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.browser")

try:
    from playwright.async_api import (  # type: ignore
        Browser,
        BrowserContext,
        Page,
        Playwright,
        TimeoutError as PlaywrightTimeout,
        async_playwright,
    )

    PLAYWRIGHT_AVAILABLE = True
except Exception as exc:  # noqa: BLE001
    PLAYWRIGHT_AVAILABLE = False
    PLAYWRIGHT_IMPORT_ERROR = str(exc)
else:
    PLAYWRIGHT_IMPORT_ERROR = ""

# Chromium-family channels Playwright can launch without downloading anything.
KNOWN_CHANNELS = ("chrome", "msedge", "chromium", "chrome-beta", "msedge-beta", "brave")

CHROME_ACTION_KEYS: dict[str, list[str]] = {
    "new_tab": ["ctrl", "t"],
    "close_tab": ["ctrl", "w"],
    "reopen_tab": ["ctrl", "shift", "t"],
    "next_tab": ["ctrl", "tab"],
    "prev_tab": ["ctrl", "shift", "tab"],
    "reload": ["f5"],
    "hard_reload": ["ctrl", "shift", "r"],
    "stop": ["esc"],
    "back": ["alt", "left"],
    "forward": ["alt", "right"],
    "address_bar": ["ctrl", "l"],
    "find": ["ctrl", "f"],
    "print": ["ctrl", "p"],
    "devtools": ["f12"],
    "history": ["ctrl", "h"],
    "downloads": ["ctrl", "j"],
    "bookmarks": ["ctrl", "shift", "o"],
    "extensions": ["ctrl", "shift", "e"] if platform.system() != "Darwin" else ["command", "shift", "e"],
    "menu": ["alt", "f"],
    "fullscreen": ["f11"],
    "zoom_in": ["ctrl", "+"],
    "zoom_out": ["ctrl", "-"],
    "zoom_reset": ["ctrl", "0"],
}

# JS that tags every interactive node with a stable ref and returns its geometry.
_SNAPSHOT_JS = """
(refPrefix) => {
  const SELECTOR = [
    'a[href]', 'button', 'input:not([type=hidden])', 'select', 'textarea',
    '[role=button]', '[role=link]', '[role=tab]', '[role=menuitem]', '[role=checkbox]',
    '[role=radio]', '[role=combobox]', '[contenteditable=true]', 'summary', 'option'
  ].join(',');

  const nodes = Array.from(document.querySelectorAll(SELECTOR));
  const out = [];
  let index = 0;

  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
    if (rect.width < 2 || rect.height < 2) return false;
    return rect.bottom > 0 && rect.right > 0 &&
           rect.top < (window.innerHeight + 400) && rect.left < (window.innerWidth + 400);
  };

  const nameOf = (el) => {
    const candidates = [
      el.getAttribute('aria-label'),
      el.getAttribute('placeholder'),
      el.getAttribute('title'),
      el.getAttribute('alt'),
      el.labels && el.labels.length ? el.labels[0].innerText : '',
      el.innerText,
      el.value,
      el.getAttribute('name'),
      el.id
    ];
    for (const c of candidates) {
      if (c && String(c).trim()) return String(c).trim().replace(/\\s+/g, ' ').slice(0, 120);
    }
    return '';
  };

  for (const el of nodes) {
    if (!visible(el)) continue;
    const rect = el.getBoundingClientRect();
    const ref = refPrefix + (++index);
    el.setAttribute('data-vyralis-ref', ref);
    const tag = el.tagName.toLowerCase();
    let role = el.getAttribute('role') || tag;
    if (tag === 'input') role = 'input:' + (el.getAttribute('type') || 'text');
    out.push({
      ref: ref,
      role: role,
      name: nameOf(el),
      value: (el.value !== undefined && el.value !== null && String(el.value).length < 200) ? String(el.value) : '',
      checked: el.checked === true,
      disabled: el.disabled === true,
      href: el.getAttribute('href') || '',
      box: {
        x: Math.round(rect.x), y: Math.round(rect.y),
        width: Math.round(rect.width), height: Math.round(rect.height)
      },
      inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight
    });
  }
  return {
    url: location.href,
    title: document.title,
    scrollY: window.scrollY,
    scrollHeight: document.documentElement.scrollHeight,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    devicePixelRatio: window.devicePixelRatio,
    elements: out.slice(0, 400)
  };
}
"""


@dataclass
class TabInfo:
    index: int
    page_id: int
    title: str
    url: str
    active: bool = False

    def to_json(self) -> dict[str, Any]:
        return {
            "index": self.index, "id": self.page_id, "title": self.title,
            "url": self.url, "active": self.active,
        }


@dataclass
class PageSnapshot:
    url: str
    title: str
    viewport: dict[str, int]
    elements: list[dict[str, Any]] = field(default_factory=list)
    text: str = ""
    scroll: dict[str, Any] = field(default_factory=dict)
    image_path: str | None = None
    captured_at: float = field(default_factory=time.time)

    # -- lookup helpers used by the agent loop --------------------------
    def find(self, needle: str) -> list[dict[str, Any]]:
        lowered = needle.lower()
        hits = []
        for element in self.elements:
            haystack = f"{element.get('name', '')} {element.get('role', '')} {element.get('href', '')}".lower()
            if lowered in haystack:
                hits.append(element)
        return hits

    def best(self, needle: str) -> dict[str, Any] | None:
        hits = self.find(needle)
        if not hits:
            return None
        # Prefer exact accessible-name matches that are actually on screen.
        hits.sort(key=lambda e: (
            e.get("name", "").lower() != needle.lower(),
            not e.get("inViewport"),
            not e.get("box", {}).get("width"),
        ))
        return hits[0]

    def by_ref(self, ref: str) -> dict[str, Any] | None:
        for element in self.elements:
            if element.get("ref") == ref:
                return element
        return None

    def to_text(self, *, limit: int = 200, include_text: bool = True) -> str:
        lines = [
            f"PAGE  {self.title}",
            f"URL   {self.url}",
            f"viewport {self.viewport.get('width')}x{self.viewport.get('height')}  "
            f"scrollY {self.scroll.get('y')} / {self.scroll.get('height')}",
            f"interactive elements: {len(self.elements)}",
        ]
        for element in self.elements[:limit]:
            name = element.get("name") or "(unnamed)"
            box = element.get("box") or {}
            flags = []
            if element.get("checked"):
                flags.append("checked")
            if element.get("disabled"):
                flags.append("disabled")
            if element.get("value"):
                flags.append(f"value={element['value']!r}")
            flag_text = f" [{', '.join(flags)}]" if flags else ""
            lines.append(
                f"  <{element.get('ref')}> {element.get('role')} \"{name}\""
                f" @({box.get('x', 0)},{box.get('y', 0)},{box.get('width', 0)}x{box.get('height', 0)})"
                f"{flag_text}"
            )
        if include_text and self.text:
            lines.append("VISIBLE TEXT:")
            lines.append(self.text[:4000])
        return "\n".join(lines)

    def to_json(self) -> dict[str, Any]:
        return {
            "url": self.url, "title": self.title, "viewport": self.viewport,
            "scroll": self.scroll, "elements": self.elements[:200],
            "text": self.text[:6000], "image_path": self.image_path,
        }


class BrowserController:
    """Playwright driver bound to the machine's real browser."""

    def __init__(self, settings: Settings, *, profiles_dir: Path, downloads_dir: Path,
                 computer: Any = None, vision: Any = None) -> None:
        self.settings = settings
        self.profiles_dir = Path(profiles_dir)
        self.downloads_dir = Path(downloads_dir)
        self.computer = computer
        self.vision = vision
        self._playwright: Playwright | None = None
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None
        self._lock = asyncio.Lock()
        self._downloads: list[dict[str, Any]] = []
        self.attached_via_cdp = False

    # -- availability ---------------------------------------------------
    @staticmethod
    def capabilities() -> dict[str, Any]:
        installed = {
            channel: bool(_find_browser_executable(channel))
            for channel in ("chrome", "msedge", "brave", "chromium")
        }
        return {
            "playwright": PLAYWRIGHT_AVAILABLE,
            "import_error": PLAYWRIGHT_IMPORT_ERROR,
            "installed_browsers": installed,
            "configured_channel": None,
        }

    def _require(self) -> None:
        if not PLAYWRIGHT_AVAILABLE:
            raise RuntimeError(
                "Browser control needs Playwright: pip install playwright "
                "(the browser itself is your installed Chrome - no download required)."
            )

    # -- lifecycle ------------------------------------------------------
    async def start(self, *, channel: str | None = None, headless: bool | None = None,
                    cdp_url: str | None = None) -> dict[str, Any]:
        self._require()
        async with self._lock:
            if self._page is not None and not self._page.is_closed():
                return {"status": "already running", "url": self._page.url}

            self._playwright = self._playwright or await async_playwright().start()
            channel = channel or self.settings.browser_channel or "chrome"
            headless = self.settings.browser_headless if headless is None else headless

            if cdp_url:
                self._browser = await self._playwright.chromium.connect_over_cdp(cdp_url)
                contexts = self._browser.contexts
                self._context = contexts[0] if contexts else await self._browser.new_context()
                self.attached_via_cdp = True
            else:
                profile = self.profiles_dir / (self.settings.browser_profile or "default")
                profile.mkdir(parents=True, exist_ok=True)
                launch_kwargs: dict[str, Any] = {
                    "user_data_dir": str(profile),
                    "headless": headless,
                    "accept_downloads": True,
                    "downloads_path": str(self.downloads_dir),
                    "viewport": None,          # use the real window size
                    "args": [
                        "--disable-blink-features=AutomationControlled",
                        "--disable-features=Translate,AutomationControlled",
                        "--no-first-run",
                        "--no-default-browser-check",
                    ],
                    "ignore_default_args": ["--enable-automation"],
                }
                executable = _find_browser_executable(channel)
                if executable:
                    launch_kwargs["executable_path"] = executable
                else:
                    launch_kwargs["channel"] = channel
                try:
                    self._context = await self._playwright.chromium.launch_persistent_context(
                        **launch_kwargs
                    )
                except Exception as exc:  # noqa: BLE001
                    raise RuntimeError(
                        f"Could not launch the installed browser '{channel}' ({exc}). "
                        f"Install Chrome/Edge, or start one with "
                        f"--remote-debugging-port=9222 and pass cdp_url."
                    ) from exc
                self._context.set_default_timeout(20_000)

            self._context.on("page", self._on_new_page)
            pages = self._context.pages
            self._page = pages[0] if pages else await self._context.new_page()
            await self._page.bring_to_front()

        return {
            "status": "started", "channel": channel, "headless": headless,
            "via_cdp": self.attached_via_cdp, "tabs": len(self._context.pages) if self._context else 0,
        }

    async def stop(self) -> dict[str, Any]:
        async with self._lock:
            with contextlib.suppress(Exception):
                if self._context is not None and not self.attached_via_cdp:
                    await self._context.close()
            with contextlib.suppress(Exception):
                if self._browser is not None:
                    await self._browser.close()
            with contextlib.suppress(Exception):
                if self._playwright is not None:
                    await self._playwright.stop()
            self._page = None
            self._context = None
            self._browser = None
            self._playwright = None
            self.attached_via_cdp = False
        return {"status": "stopped"}

    def _on_new_page(self, page: Page) -> None:
        self._page = page
        page.on("download", self._on_download)

    def _on_download(self, download: Any) -> None:
        target = self.downloads_dir / download.suggested_filename
        try:
            download.save_as(str(target))
            self._downloads.append(
                {"file": str(target), "name": download.suggested_filename, "at": time.time()}
            )
        except Exception as exc:  # noqa: BLE001
            log.warning("download failed: %s", exc)

    # -- page handles ---------------------------------------------------
    @property
    def page(self) -> Page:
        if self._page is None or self._page.is_closed():
            raise RuntimeError("No browser page is open. Call browser.start first.")
        return self._page

    @property
    def context(self) -> BrowserContext:
        if self._context is None:
            raise RuntimeError("Browser is not running. Call browser.start first.")
        return self._context

    def pages(self) -> list[Page]:
        return [page for page in self.context.pages if not page.is_closed()]

    # -- tabs -----------------------------------------------------------
    async def list_tabs(self) -> list[TabInfo]:
        active = self._page
        out: list[TabInfo] = []
        for index, page in enumerate(self.pages()):
            try:
                title = await page.title()
            except Exception:  # noqa: BLE001
                title = ""
            out.append(
                TabInfo(index=index, page_id=id(page), title=title, url=page.url, active=page is active)
            )
        return out

    async def new_tab(self, url: str | None = None) -> TabInfo:
        page = await self.context.new_page()
        if url:
            await page.goto(url, wait_until="domcontentloaded")
        self._page = page
        await page.bring_to_front()
        return TabInfo(index=len(self.pages()) - 1, page_id=id(page),
                       title=await page.title(), url=page.url, active=True)

    async def close_tab(self, index: int | None = None) -> dict[str, Any]:
        pages = self.pages()
        if not pages:
            return {"closed": False, "reason": "no tabs"}
        target = self._page if index is None else pages[index % len(pages)]
        await target.close()
        remaining = self.pages()
        self._page = remaining[0] if remaining else None
        if self._page is not None:
            await self._page.bring_to_front()
        return {"closed": True, "remaining": len(remaining)}

    async def switch_tab(self, *, index: int | None = None, url_contains: str | None = None,
                         title_contains: str | None = None) -> TabInfo:
        pages = self.pages()
        chosen: Page | None = None
        if index is not None:
            chosen = pages[index % len(pages)]
        else:
            for page in pages:
                if url_contains and url_contains.lower() in page.url.lower():
                    chosen = page
                    break
                if title_contains:
                    with contextlib.suppress(Exception):
                        if title_contains.lower() in (await page.title()).lower():
                            chosen = page
                            break
        if chosen is None:
            raise RuntimeError("No matching tab found.")
        self._page = chosen
        await chosen.bring_to_front()
        return TabInfo(index=pages.index(chosen), page_id=id(chosen),
                       title=await chosen.title(), url=chosen.url, active=True)

    # -- navigation -----------------------------------------------------
    async def goto(self, url: str, *, wait_until: str = "domcontentloaded", timeout: float = 30.0) -> dict[str, Any]:
        page = self.page
        response = await page.goto(_normalise_url(url), wait_until=wait_until, timeout=timeout * 1000)
        return {
            "url": page.url, "title": await page.title(),
            "status": response.status if response else None,
        }

    async def press_action(self, action: str) -> dict[str, Any]:
        """Browser-native actions: back, forward, reload, stop, address_bar, find..."""
        keys = CHROME_ACTION_KEYS.get(action)
        if keys:
            await self.page.keyboard.press("+".join(keys))
            await asyncio.sleep(0.4)
            return {"action": action, "via": "keyboard", "keys": keys}
        if action == "screenshot":
            return {"path": await self.screenshot()}
        raise ValueError(f"Unknown browser action '{action}'.")

    async def wait_for(
        self, *, selector: str | None = None, text: str | None = None,
        url_contains: str | None = None, timeout: float = 20.0,
    ) -> dict[str, Any]:
        page = self.page
        deadline = time.time() + timeout
        if selector:
            await page.wait_for_selector(selector, timeout=timeout * 1000)
            return {"found": "selector", "selector": selector}
        while time.time() < deadline:
            if text:
                body = await page.inner_text("body")
                if text.lower() in body.lower():
                    return {"found": "text", "text": text}
            if url_contains and url_contains.lower() in page.url.lower():
                return {"found": "url", "url": page.url}
            await asyncio.sleep(0.4)
        raise TimeoutError(f"Timed out waiting for {selector or text or url_contains}")

    # -- structure ------------------------------------------------------
    async def snapshot(self, *, element_limit: int = 200, include_text: bool = True,
                       with_image: bool = False, name: str = "page") -> PageSnapshot:
        """The agent's primary sense for web pages: elements + text (+ optional pixels)."""
        page = self.page
        try:
            data = await page.evaluate(_SNAPSHOT_JS, "e")
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f"Could not read the page structure: {exc}") from exc

        text = ""
        if include_text:
            with contextlib.suppress(Exception):
                text = await page.inner_text("body")

        snapshot = PageSnapshot(
            url=data.get("url", page.url),
            title=data.get("title", ""),
            viewport=data.get("viewport", {}),
            elements=data.get("elements", [])[:element_limit],
            text=text,
            scroll={
                "y": data.get("scrollY", 0),
                "height": data.get("scrollHeight", 0),
                "viewport_height": data.get("viewport", {}).get("height", 0),
            },
        )
        if with_image and self.vision is not None:
            with contextlib.suppress(Exception):
                snapshot.image_path = await self.screenshot(name=name)
        return snapshot

    async def screenshot(self, *, full_page: bool = False, selector: str | None = None,
                         name: str = "page") -> str:
        page = self.page
        target = self.artifacts_dir() / f"{name}-{int(time.time() * 1000)}.png"
        if selector:
            await page.locator(selector).first.screenshot(path=str(target))
        else:
            await page.screenshot(path=str(target), full_page=full_page)
        return str(target)

    def artifacts_dir(self) -> Path:
        directory = self.downloads_dir.parent / "screenshots"
        directory.mkdir(parents=True, exist_ok=True)
        return directory

    # -- interaction ----------------------------------------------------
    async def click(
        self, *, ref: str | None = None, selector: str | None = None, text: str | None = None,
        role: str | None = None, name: str | None = None, index: int = 0,
        button: str = "left", clicks: int = 1, timeout: float = 15.0,
    ) -> dict[str, Any]:
        page = self.page
        locator = self._locator(ref=ref, selector=selector, text=text, role=role, name=name)
        if locator is None:
            raise ValueError("click() needs one of: ref, selector, text, role+name.")
        target = locator.nth(index)
        await target.scroll_into_view_if_needed(timeout=timeout * 1000)
        await target.click(button=button, click_count=clicks, timeout=timeout * 1000)
        await self._settle()
        return {"clicked": ref or selector or text or f"{role}:{name}", "url": page.url}

    async def fill(
        self, value: str, *, ref: str | None = None, selector: str | None = None,
        text: str | None = None, clear: bool = True, press_enter: bool = False,
        timeout: float = 15.0,
    ) -> dict[str, Any]:
        locator = self._locator(ref=ref, selector=selector, text=text)
        if locator is None:
            raise ValueError("fill() needs one of: ref, selector, text.")
        target = locator.first
        await target.scroll_into_view_if_needed(timeout=timeout * 1000)
        if clear:
            with contextlib.suppress(Exception):
                await target.fill("")
        await target.fill(value, timeout=timeout * 1000)
        # Read back what the field actually contains - never trust the write.
        actual = ""
        with contextlib.suppress(Exception):
            actual = await target.input_value()
        if press_enter:
            await target.press("Enter")
            await self._settle()
        return {"filled": value[:200], "actual": actual[:200], "verified": actual == value}

    async def type_text(self, value: str, *, ref: str | None = None, selector: str | None = None,
                        delay: float = 15.0) -> dict[str, Any]:
        locator = self._locator(ref=ref, selector=selector)
        if locator is None:
            raise ValueError("type_text() needs one of: ref, selector.")
        await locator.first.click()
        await self.page.keyboard.type(value, delay=delay)
        return {"typed": len(value)}

    async def press_key(self, keys: str, *, repeat: int = 1) -> dict[str, Any]:
        for _ in range(max(1, repeat)):
            await self.page.keyboard.press(keys)
        await self._settle()
        return {"keys": keys, "repeat": repeat}

    async def select_option(self, value: str, *, ref: str | None = None, selector: str | None = None) -> dict[str, Any]:
        locator = self._locator(ref=ref, selector=selector)
        if locator is None:
            raise ValueError("select_option() needs one of: ref, selector.")
        selected = await locator.first.select_option(value)
        return {"selected": selected}

    async def hover(self, *, ref: str | None = None, selector: str | None = None) -> dict[str, Any]:
        locator = self._locator(ref=ref, selector=selector)
        if locator is None:
            raise ValueError("hover() needs one of: ref, selector.")
        await locator.first.hover()
        return {"hovered": ref or selector}

    async def scroll_page(self, *, delta_y: int = 600, to: str | None = None) -> dict[str, Any]:
        if to:
            await self.page.evaluate("(sel) => document.querySelector(sel)?.scrollIntoView({block:'center'})", to)
        else:
            await self.page.mouse.wheel(0, delta_y)
        await asyncio.sleep(0.25)
        position = await self.page.evaluate("() => ({y: window.scrollY, h: document.documentElement.scrollHeight})")
        return position

    async def upload(self, paths: Sequence[str], *, ref: str | None = None, selector: str | None = None) -> dict[str, Any]:
        locator = self._locator(ref=ref, selector=selector)
        if locator is None:
            raise ValueError("upload() needs one of: ref, selector.")
        await locator.first.set_input_files(list(paths))
        return {"uploaded": list(paths)}

    async def handle_dialog(self, *, accept: bool = True, prompt_text: str = "") -> dict[str, Any]:
        """Answer the next JS dialog. Dialogs block the page, so arm this first."""
        page = self.page

        async def _handler(dialog: Any) -> None:
            with contextlib.suppress(Exception):
                await (dialog.accept(prompt_text) if accept else dialog.dismiss())

        page.once("dialog", lambda dialog: asyncio.ensure_future(_handler(dialog)))
        return {"armed": True, "accept": accept}

    # -- extraction -----------------------------------------------------
    async def get_text(self, *, selector: str | None = None) -> str:
        page = self.page
        return await (page.locator(selector).first.inner_text() if selector else page.inner_text("body"))

    async def get_html(self, *, selector: str | None = None, limit: int = 60_000) -> str:
        page = self.page
        html = await (page.locator(selector).first.inner_html() if selector else page.content())
        return html[:limit]

    async def extract_table(self, *, selector: str | None = None, limit: int = 500) -> dict[str, Any]:
        """Turn an HTML table into rows that can be written straight to a spreadsheet."""
        script = """
        (sel) => {
          const table = sel ? document.querySelector(sel) : document.querySelector('table');
          if (!table) return null;
          const rows = Array.from(table.querySelectorAll('tr')).slice(0, %d);
          return rows.map(tr => Array.from(tr.querySelectorAll('th,td'))
            .map(td => td.innerText.trim().replace(/\\s+/g, ' ')));
        }
        """ % limit
        return {"rows": await self.page.evaluate(script, selector)}

    async def list_links(self, *, contains: str | None = None, limit: int = 200) -> list[dict[str, str]]:
        script = """
        (args) => Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 120),
          href: a.href
        })).filter(l => !args.contains || (l.text.toLowerCase().includes(args.contains.toLowerCase())))
          .slice(0, args.limit)
        """
        return await self.page.evaluate(script, {"contains": contains, "limit": limit})

    async def eval_js(self, expression: str, *, arg: Any = None) -> Any:
        return await self.page.evaluate(expression, arg)

    async def cookies(self) -> list[dict[str, Any]]:
        return await self.context.cookies()

    # -- browser chrome (needs vision, not the DOM) ---------------------
    async def chrome_shortcut(self, action: str) -> dict[str, Any]:
        """Drive browser UI through its real keyboard shortcuts."""
        if action not in CHROME_ACTION_KEYS:
            raise ValueError(
                f"Unknown browser UI action '{action}'. Known: {', '.join(sorted(CHROME_ACTION_KEYS))}"
            )
        keys = CHROME_ACTION_KEYS[action]
        if self.computer is not None:
            # Real keys through the OS: this works on browser chrome itself.
            self.computer.hotkey(*keys)
        else:
            await self.page.keyboard.press("+".join(keys))
        await asyncio.sleep(0.5)
        return {"action": action, "keys": keys}

    async def chrome_menu(self, *, map_screen: bool = True) -> dict[str, Any]:
        """Open the three-dot menu and hand back a screen map of its items.

        The menu is browser UI, so no DOM query can see it. Opening it with
        Alt+F and then describing the pixels is how the agent clicks
        'Extensions', 'History', 'Cast', 'Save and share' and friends.
        """
        result = await self.chrome_shortcut("menu")
        if map_screen and self.vision is not None:
            screen = self.vision.screen_map(name="chrome-menu")
            result["screen"] = screen.to_json()
            result["text_map"] = screen.to_text()
        return result

    async def chrome_bar_icon(self, which: str) -> dict[str, Any]:
        """Locate a toolbar icon (lens, extensions, profile, menu) via vision.

        Returns the click point; the caller decides whether to actually click,
        which keeps 'look' and 'act' separate and auditable.
        """
        labels = {
            "lens": ["Search with Google Lens", "Search this page with Google Lens", "Lens"],
            "extensions": ["Extensions", "Extensions puzzle"],
            "profile": ["profile", "Google Account", "avatar", "Manage your Google Account"],
            "menu": ["Customize and control", "Chrome menu", "More"],
            "refresh": ["Reload", "Refresh"],
            "star": ["Bookmark", "Add to bookmarks", "Star"],
            "tabs": ["Tab search", "Search tabs"],
            "translate": ["Translate", "Translate this page"],
        }.get(which, [which])
        if self.vision is None:
            return {"found": False, "reason": "vision engine unavailable", "hints": labels}
        for label in labels:
            mark = self.vision.locate_text(label)
            if mark is not None:
                return {"found": True, "label": label, "click": list(mark.center), "mark": mark.to_json()}
        return {"found": False, "tried": labels}

    # -- internals ------------------------------------------------------
    def _locator(self, *, ref: str | None = None, selector: str | None = None,
                 text: str | None = None, role: str | None = None, name: str | None = None) -> Any:
        page = self.page
        if ref:
            return page.locator(f'[data-vyralis-ref="{ref}"]')
        if selector:
            return page.locator(selector)
        if role and name:
            return page.get_by_role(role, name=name)
        if text:
            return page.get_by_text(text, exact=False)
        return None

    async def _settle(self, *, timeout: float = 6.0) -> None:
        """Wait for the page to stop moving after an interaction."""
        with contextlib.suppress(Exception):
            await self.page.wait_for_load_state("networkidle", timeout=int(timeout * 1000))
        await asyncio.sleep(0.15)

    async def attach_to_running(self, port: int = 9222) -> dict[str, Any]:
        """Attach to a user-started Chrome: chrome --remote-debugging-port=9222"""
        return await self.start(cdp_url=f"http://127.0.0.1:{port}")

    def recent_downloads(self, limit: int = 20) -> list[dict[str, Any]]:
        return self._downloads[-limit:]


# ---------------------------------------------------------------------------
def _normalise_url(url: str) -> str:
    if url.startswith(("http://", "https://", "file://", "about:", "chrome://", "edge://", "data:")):
        return url
    if "." in url and " " not in url:
        return "https://" + url
    return f"https://www.google.com/search?q={url.replace(' ', '+')}"


def _find_browser_executable(channel: str) -> str | None:
    """Locate an already-installed Chromium-family browser."""
    system = platform.system()
    candidates: list[str] = []
    if system == "Windows":
        program_files = [
            Path("C:/Program Files"), Path("C:/Program Files (x86)"),
            Path(__import__("os").environ.get("LOCALAPPDATA", "C:/")) / "Programs",
        ]
        relative = {
            "chrome": "Google/Chrome/Application/chrome.exe",
            "chrome-beta": "Google/Chrome Beta/Application/chrome.exe",
            "msedge": "Microsoft/Edge/Application/msedge.exe",
            "msedge-beta": "Microsoft/Edge Beta/Application/msedge.exe",
            "brave": "BraveSoftware/Brave-Browser/Application/brave.exe",
        }.get(channel, "")
        candidates = [str(base / relative) for base in program_files if relative]
    elif system == "Darwin":
        relative = {
            "chrome": "Google Chrome.app/Contents/MacOS/Google Chrome",
            "chrome-beta": "Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta",
            "msedge": "Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "brave": "Brave Browser.app/Contents/MacOS/Brave Browser",
        }.get(channel, "")
        if relative:
            candidates = [f"/Applications/{relative}", f"{Path.home()}/Applications/{relative}"]
    else:
        candidates = [shutil.which(name) or "" for name in _linux_names(channel)]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    return shutil.which(channel)


def _linux_names(channel: str) -> tuple[str, ...]:
    return {
        "chrome": ("google-chrome", "google-chrome-stable"),
        "chrome-beta": ("google-chrome-beta",),
        "msedge": ("microsoft-edge", "microsoft-edge-stable"),
        "brave": ("brave-browser", "brave"),
        "chromium": ("chromium", "chromium-browser"),
    }.get(channel, (channel,))


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, controller: BrowserController) -> None:
    def browser_for(_: Any) -> BrowserController:
        return controller

    @registry.tool(
        "browser.start",
        "Launch (or attach to) the user's installed browser. Call this before any other browser "
        "tool. Uses a persistent profile so logins survive between sessions.",
        obj(
            {
                "channel": prop("string", "chrome | msedge | brave | chromium",
                                enum=list(KNOWN_CHANNELS)),
                "cdp_url": prop("string", "Attach to an already-running browser, e.g. "
                                          "http://127.0.0.1:9222 for full session reuse."),
                "headless": prop("boolean", "Run without a visible window."),
            },
        ),
        category="browser", permission="sensitive",
    )
    async def start(channel: str | None = None, cdp_url: str | None = None,
                    headless: bool | None = None, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).start(channel=channel, cdp_url=cdp_url, headless=headless)

    @registry.tool(
        "browser.stop", "Close the browser session Vyralis owns (never the user's own windows).",
        obj({}), category="browser", permission="safe",
    )
    async def stop(ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).stop()

    @registry.tool(
        "browser.open",
        "Open a URL in the active tab and wait for the page to load. Accepts a full URL or a "
        "search phrase.",
        obj(
            {
                "url": prop("string", "URL or search phrase."),
                "wait_until": prop("string", "domcontentloaded | load | networkidle"),
            },
            ["url"],
        ),
        category="browser", permission="sensitive",
    )
    async def open_url(url: str, wait_until: str = "domcontentloaded", ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).goto(url, wait_until=wait_until)

    @registry.tool(
        "browser.tabs",
        "Manage tabs: list every open tab, open a new one, close one, or switch to it. Tab "
        "indexes come from action=list.",
        obj(
            {
                "action": prop("string", "list | new | close | switch",
                               enum=["list", "new", "close", "switch"]),
                "index": prop("integer", "Tab index for close/switch."),
                "url": prop("string", "URL for action=new."),
                "title_contains": prop("string", "Switch by title instead of index."),
                "url_contains": prop("string", "Switch by URL substring."),
            },
            ["action"],
        ),
        category="browser", permission="safe",
    )
    async def tabs(action: str, index: int | None = None, url: str | None = None,
                   title_contains: str | None = None, url_contains: str | None = None,
                   ctx: Any = None) -> dict[str, Any]:
        control = browser_for(ctx)
        if action == "list":
            return {"tabs": [tab.to_json() for tab in await control.list_tabs()]}
        if action == "new":
            return (await control.new_tab(url)).to_json()
        if action == "close":
            return await control.close_tab(index)
        if action == "switch":
            return (await control.switch_tab(
                index=index, title_contains=title_contains, url_contains=url_contains
            )).to_json()
        raise ValueError(f"Unknown tabs action '{action}'.")

    @registry.tool(
        "browser.action",
        "Browser-native navigation and toolbar actions that are not page clicks: back, forward, "
        "reload, hard_reload, stop, address_bar, find, print, devtools, history, downloads, "
        "bookmarks, extensions, fullscreen, zoom_in, zoom_out, zoom_reset.",
        obj({"action": prop("string", "The action name.")}, ["action"]),
        category="browser", permission="safe",
    )
    async def action(action: str, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).press_action(action)

    @registry.tool(
        "browser.snapshot",
        "Read the current page as structure: URL, title, visible text, and a numbered list of "
        "every interactive element with its role, label, value and coordinates. This is the "
        "text-only equivalent of looking at a screenshot - a model with no vision can act on it. "
        "Set with_image=true to also capture a screenshot for a vision model.",
        obj(
            {
                "include_text": prop("boolean", "Include the page's visible text."),
                "element_limit": prop("integer", "Maximum elements to return."),
                "with_image": prop("boolean", "Also save a screenshot of the page."),
            },
        ),
        category="browser", permission="safe",
    )
    async def snapshot(include_text: bool = True, element_limit: int = 200,
                       with_image: bool = False, ctx: Any = None) -> dict[str, Any]:
        snap = await browser_for(ctx).snapshot(
            include_text=include_text, element_limit=element_limit, with_image=with_image
        )
        return snap.to_json()

    @registry.tool(
        "browser.click",
        "Click an element on the page. Address it by ref (from browser.snapshot, most reliable), "
        "CSS selector, visible text, or role+name.",
        obj(
            {
                "ref": prop("string", "Element ref such as 'e12' from browser.snapshot."),
                "selector": prop("string", "CSS selector."),
                "text": prop("string", "Visible text of the element."),
                "role": prop("string", "ARIA role, e.g. button, link."),
                "name": prop("string", "Accessible name when using role."),
                "clicks": prop("integer", "2 for a double click."),
                "button": prop("string", "left | right | middle"),
            },
        ),
        category="browser", permission="sensitive",
    )
    async def click(ref: str | None = None, selector: str | None = None, text: str | None = None,
                    role: str | None = None, name: str | None = None, clicks: int = 1,
                    button: str = "left", ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).click(
            ref=ref, selector=selector, text=text, role=role, name=name, clicks=clicks, button=button
        )

    @registry.tool(
        "browser.fill",
        "Type a value into an input, textarea, search box or chat box, then read the field back to "
        "confirm the value actually landed. Set press_enter to submit.",
        obj(
            {
                "value": prop("string", "Text to enter."),
                "ref": prop("string", "Element ref from browser.snapshot."),
                "selector": prop("string", "CSS selector."),
                "clear": prop("boolean", "Clear the field first (default true)."),
                "press_enter": prop("boolean", "Press Enter after filling (submit / send)."),
            },
            ["value"],
        ),
        category="browser", permission="sensitive",
    )
    async def fill(value: str, ref: str | None = None, selector: str | None = None,
                   clear: bool = True, press_enter: bool = False, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).fill(
            value, ref=ref, selector=selector, clear=clear, press_enter=press_enter
        )

    @registry.tool(
        "browser.press",
        "Press a key in the page: 'Enter', 'Escape', 'PageDown', 'Control+A', 'Tab'.",
        obj({"keys": prop("string", "Key or chord."), "repeat": prop("integer", "Repeat count.")},
            ["keys"]),
        category="browser", permission="sensitive",
    )
    async def press(keys: str, repeat: int = 1, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).press_key(keys, repeat=repeat)

    @registry.tool(
        "browser.scroll",
        "Scroll the page. Positive delta_y scrolls down. Optionally scroll a selector into view.",
        obj(
            {
                "delta_y": prop("integer", "Pixels; 600 is roughly one screen."),
                "to": prop("string", "CSS selector to scroll into view instead."),
            },
        ),
        category="browser", permission="safe",
    )
    async def scroll(delta_y: int = 600, to: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).scroll_page(delta_y=delta_y, to=to)

    @registry.tool(
        "browser.select",
        "Choose an option in a <select> dropdown by value.",
        obj({"value": prop("string", "Option value."), "ref": prop("string", "Element ref."),
             "selector": prop("string", "CSS selector.")}, ["value"]),
        category="browser", permission="sensitive",
    )
    async def select(value: str, ref: str | None = None, selector: str | None = None,
                     ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).select_option(value, ref=ref, selector=selector)

    @registry.tool(
        "browser.read",
        "Extract content from the page: visible text, HTML, a table as rows (ready for Excel), "
        "the list of links, or run JavaScript and return its value.",
        obj(
            {
                "what": prop("string", "text | html | table | links | js",
                             enum=["text", "html", "table", "links", "js"]),
                "selector": prop("string", "Optional CSS selector to scope the read."),
                "expression": prop("string", "JavaScript to run when what=js."),
                "contains": prop("string", "Filter links by text when what=links."),
            },
            ["what"],
        ),
        category="browser", permission="safe",
    )
    async def read(what: str, selector: str | None = None, expression: str | None = None,
                   contains: str | None = None, ctx: Any = None) -> Any:
        control = browser_for(ctx)
        if what == "text":
            return {"text": (await control.get_text(selector=selector))[:40000]}
        if what == "html":
            return {"html": await control.get_html(selector=selector)}
        if what == "table":
            return await control.extract_table(selector=selector)
        if what == "links":
            return {"links": await control.list_links(contains=contains)}
        if what == "js":
            if not expression:
                raise ValueError("what=js requires 'expression'.")
            return {"value": await control.eval_js(expression)}
        raise ValueError(f"Unknown read target '{what}'.")

    @registry.tool(
        "browser.wait",
        "Wait until a selector exists, some text appears, or the URL changes. Use this after "
        "clicking something that loads content.",
        obj(
            {
                "selector": prop("string", "CSS selector to wait for."),
                "text": prop("string", "Text to wait for."),
                "url_contains": prop("string", "URL substring to wait for."),
                "timeout": prop("number", "Seconds before giving up."),
            },
        ),
        category="browser", permission="safe",
    )
    async def wait(selector: str | None = None, text: str | None = None,
                   url_contains: str | None = None, timeout: float = 20.0, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).wait_for(
            selector=selector, text=text, url_contains=url_contains, timeout=timeout
        )

    @registry.tool(
        "browser.screenshot",
        "Screenshot the page (or one element) so a vision model can look at it.",
        obj(
            {
                "full_page": prop("boolean", "Capture the entire scrollable page."),
                "selector": prop("string", "Capture just this element."),
            },
        ),
        category="browser", permission="safe",
    )
    async def screenshot(full_page: bool = False, selector: str | None = None,
                         ctx: Any = None) -> dict[str, Any]:
        path = await browser_for(ctx).screenshot(full_page=full_page, selector=selector)
        return {"path": path}

    @registry.tool(
        "browser.upload",
        "Attach local files to a file input on the page.",
        obj({"paths": prop("array", "Absolute file paths.", items={"type": "string"}),
             "ref": prop("string", "Element ref of the file input."),
             "selector": prop("string", "CSS selector of the file input.")}, ["paths"]),
        category="browser", permission="sensitive",
    )
    async def upload(paths: list[str], ref: str | None = None, selector: str | None = None,
                     ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).upload(paths, ref=ref, selector=selector)

    @registry.tool(
        "browser.chrome_ui",
        "Control the browser's own interface, which no page selector can reach: refresh, "
        "extensions, the Lens button, the profile avatar, the three-dot menu, tab search, "
        "translate. action=shortcut presses the real key; action=locate finds a toolbar icon on "
        "screen with vision and returns where to click; action=menu opens the three-dot menu and "
        "returns a screen map of its items.",
        obj(
            {
                "action": prop("string", "shortcut | locate | menu | click_at",
                               enum=["shortcut", "locate", "menu", "click_at"]),
                "name": prop("string", "Action name for shortcut, or icon name for locate: "
                                       "lens | extensions | profile | menu | star | tabs | translate."),
                "x": prop("integer", "X coordinate when action=click_at."),
                "y": prop("integer", "Y coordinate when action=click_at."),
            },
            ["action"],
        ),
        category="browser", permission="sensitive",
    )
    async def chrome_ui(action: str, name: str | None = None, x: int | None = None,
                        y: int | None = None, ctx: Any = None) -> dict[str, Any]:
        control = browser_for(ctx)
        if action == "shortcut":
            if not name:
                raise ValueError("action=shortcut needs 'name'.")
            return await control.chrome_shortcut(name)
        if action == "locate":
            if not name:
                raise ValueError("action=locate needs 'name'.")
            return await control.chrome_bar_icon(name)
        if action == "menu":
            return await control.chrome_menu()
        if action == "click_at":
            if x is None or y is None:
                raise ValueError("action=click_at needs x and y.")
            if control.computer is None:
                raise RuntimeError("click_at needs the desktop control subsystem.")
            return control.computer.click(x, y)
        raise ValueError(f"Unknown chrome_ui action '{action}'.")

    @registry.tool(
        "browser.attach",
        "Attach to the user's already-running Chrome (started with "
        "--remote-debugging-port=9222) to reuse their real sessions, logins, extensions and tabs.",
        obj({"port": prop("integer", "Debugging port, default 9222.")}),
        category="browser", permission="sensitive",
    )
    async def attach(port: int = 9222, ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).attach_to_running(port)

    @registry.tool(
        "browser.dialogs",
        "Arm an answer for the next JavaScript dialog (alert/confirm/prompt), which otherwise "
        "freezes the page.",
        obj({"accept": prop("boolean", "Accept the dialog."),
             "prompt_text": prop("string", "Text to type into a prompt dialog.")}),
        category="browser", permission="sensitive",
    )
    async def dialogs(accept: bool = True, prompt_text: str = "", ctx: Any = None) -> dict[str, Any]:
        return await browser_for(ctx).handle_dialog(accept=accept, prompt_text=prompt_text)
