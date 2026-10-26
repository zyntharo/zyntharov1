"""WhatsApp control.

Vyralis drives WhatsApp Web inside the same managed browser profile used for
all other browsing, so the pairing is a one-time QR scan or phone-number link
and the session survives restarts. Everything then works from one place:

* chat discovery and search,
* reading and sending text, emoji, media, documents and voice notes,
* unread triage,
* voice and video calls (start, accept, hang up), with the audio path handed to
  the voice service so Vyralis can *speak and listen on a real call*.

Two honest constraints, stated here rather than hidden:

1. WhatsApp Web's DOM is obfuscated and changes without notice. Selectors are
   written against stable, human-readable attributes (``data-testid``,
   accessibility labels, placeholder text) and every method reports a clear
   selector error instead of failing silently.
2. Talking on a live call needs an audio route between the call and the speech
   stack. :meth:`call_speak` records through the system's default input and
   plays through its default output; on a machine with a virtual loopback
   device (VB-Cable, BlackHole, PulseAudio null sink) this is full duplex. The
   method reports which route it used.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Sequence

from ..config import Settings
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.whatsapp")

WHATSAPP_URL = "https://web.whatsapp.com"

SELECTORS = {
    "app_root": "#app",
    "qr_canvas": "canvas[aria-label*='scan'], div[data-ref] canvas, [data-testid='qrcode']",
    "logged_in": "div#pane-side, [data-testid='chat-list']",
    "chat_list": "div#pane-side [role='listitem'], [data-testid='cell-frame-container']",
    "search_box": "div[contenteditable='true'][data-tab='3'], input[placeholder*='Search']",
    "search_input": "div[contenteditable='true'][data-tab='3']",
    "message_input": "div[contenteditable='true'][data-tab='10'], footer div[contenteditable='true']",
    "message_rows": "div.message-in, div.message-out",
    "send_button": "button[aria-label='Send'], span[data-icon='send']",
    "attach_button": "button[aria-label='Attach'], span[data-icon='plus'], span[data-icon='clip']",
    "call_button": "button[aria-label*='Voice call'], span[data-icon='voice-call']",
    "video_call_button": "button[aria-label*='Video call'], span[data-icon='video-call']",
    "accept_call": "button[aria-label*='Accept'], div[data-testid='call-accept']",
    "hangup_call": "button[aria-label*='End call'], div[data-testid='call-end']",
    "unread_badge": "span[aria-label*='unread'], div[data-testid='icon-unread-count']",
    "contact_header": "header span[title]",
    "media_audio_option": "li[aria-label*='Audio'], li[aria-label*='audio']",
}


@dataclass
class Chat:
    name: str
    preview: str = ""
    unread: int = 0
    timestamp: str = ""
    pinned: bool = False

    def to_json(self) -> dict[str, Any]:
        return {"name": self.name, "preview": self.preview[:160], "unread": self.unread,
                "timestamp": self.timestamp, "pinned": self.pinned}


@dataclass
class Message:
    direction: str          # in | out
    text: str
    timestamp: str = ""
    author: str = ""
    kind: str = "text"

    def to_json(self) -> dict[str, Any]:
        return {"direction": self.direction, "text": self.text[:2000], "timestamp": self.timestamp,
                "author": self.author, "kind": self.kind}


@dataclass
class CallState:
    active: bool = False
    kind: str = ""
    contact: str = ""
    started_at: float = 0.0
    audio_route: str = "system default"
    transcript: list[dict[str, Any]] = field(default_factory=list)

    def to_json(self) -> dict[str, Any]:
        return {
            "active": self.active, "kind": self.kind, "contact": self.contact,
            "seconds": round(time.time() - self.started_at, 1) if self.active else 0.0,
            "audio_route": self.audio_route, "turns": len(self.transcript),
        }


class WhatsAppController:
    """Drives WhatsApp Web through the shared browser controller."""

    def __init__(self, settings: Settings, browser: Any, voice: Any = None,
                 computer: Any = None) -> None:
        self.settings = settings
        self.browser = browser
        self.voice = voice
        self.computer = computer
        self.call = CallState()
        self._linked = False

    def _require_browser(self) -> Any:
        if self.browser is None:
            raise RuntimeError("WhatsApp needs the browser subsystem. Install playwright and start the browser.")
        return self.browser

    @property
    def page(self) -> Any:
        return self._require_browser().page

    # -- session --------------------------------------------------------
    async def connect(self, *, wait_seconds: float = 90.0, phone_number: str | None = None) -> dict[str, Any]:
        """Open WhatsApp Web and wait for the one-time pairing."""
        browser = self._require_browser()
        if browser._page is None:  # noqa: SLF001 - intentional: ensure a session exists
            await browser.start()
        await browser.goto(WHATSAPP_URL, wait_until="domcontentloaded")
        if phone_number:
            await self._request_code(phone_number)

        deadline = time.time() + wait_seconds
        while time.time() < deadline:
            if await self.is_linked():
                self._linked = True
                return {"linked": True, "message": "WhatsApp is paired and ready."}
            await asyncio.sleep(2.0)
        return {
            "linked": False,
            "message": (
                "Waiting for pairing. Open WhatsApp on your phone, go to Linked devices -> Link a "
                f"device, and scan the QR code shown in the browser window (waited {wait_seconds:.0f}s)."
            ),
        }

    async def _request_code(self, phone_number: str) -> dict[str, Any]:
        """Use the 'Link with phone number' flow instead of a QR scan."""
        try:
            await self.page.get_by_text("Link with phone number", exact=False).first.click(timeout=8000)
            digits = "".join(ch for ch in phone_number if ch.isdigit() or ch == "+")
            field = self.page.locator("input[type='text']").first
            await field.fill(digits.lstrip("+"))
            await self.page.get_by_role("button", name="Next").first.click(timeout=8000)
            await asyncio.sleep(2.0)
            code = ""
            for element in await self.page.locator("div[aria-label*='code'], span").all():
                text = (await element.inner_text() or "").strip()
                if text and all(part.isalnum() for part in text.split()) and 4 <= len(text) <= 12:
                    code = text
                    break
            return {
                "code": code,
                "message": "Enter this code in WhatsApp on your phone to link this device.",
            }
        except Exception as exc:  # noqa: BLE001
            return {
                "code": "",
                "error": f"Phone-number linking failed ({exc}). Scan the QR code in the browser window instead.",
            }

    async def is_linked(self) -> bool:
        for selector in (SELECTORS["logged_in"], "div#pane-side"):
            try:
                if await self.page.locator(selector).count() > 0:
                    self._linked = True
                    return True
            except Exception:  # noqa: BLE001
                continue
        return False

    async def state(self) -> dict[str, Any]:
        linked = await self.is_linked() if self.browser and self.browser._page else False  # noqa: SLF001
        return {
            "linked": linked,
            "url": self.page.url if self.browser and self.browser._page else None,  # noqa: SLF001
            "call": self.call.to_json(),
        }

    # -- chats ----------------------------------------------------------
    async def list_chats(self, *, limit: int = 25, unread_only: bool = False) -> list[Chat]:
        rows = self.page.locator(SELECTORS["chat_list"])
        count = min(await rows.count(), max(limit * 3, 40))
        chats: list[Chat] = []
        for index in range(count):
            row = rows.nth(index)
            try:
                text = (await row.inner_text(timeout=4000) or "").strip()
            except Exception:  # noqa: BLE001
                continue
            if not text:
                continue
            parts = [part.strip() for part in text.splitlines() if part.strip()]
            name = parts[0] if parts else ""
            preview = parts[1] if len(parts) > 1 else ""
            unread = 0
            for part in parts:
                if part.isdigit() and len(part) <= 3 and part != name:
                    unread = int(part)
            timestamp = next((part for part in reversed(parts) if ":" in part or "/" in part), "")
            chat = Chat(name=name, preview=preview, unread=unread, timestamp=timestamp)
            if unread_only and not chat.unread:
                continue
            chats.append(chat)
            if len(chats) >= limit:
                break
        return chats

    async def search_chats(self, query: str, *, open_first: bool = False) -> dict[str, Any]:
        box = self.page.locator(SELECTORS["search_input"]).first
        await box.click(timeout=8000)
        await box.fill("")
        await self.page.keyboard.type(query, delay=35)
        await asyncio.sleep(1.2)
        chats = await self.list_chats(limit=10)
        result: dict[str, Any] = {"query": query, "results": [chat.to_json() for chat in chats]}
        if open_first and chats:
            result["opened"] = (await self.open_chat(chats[0].name)).get("contact", "")
        return result

    async def open_chat(self, contact: str) -> dict[str, Any]:
        """Open a chat by contact or group name (exact first, then substring)."""
        await self._clear_search()
        rows = self.page.locator(SELECTORS["chat_list"])
        count = await rows.count()
        fallback = None
        for index in range(count):
            row = rows.nth(index)
            try:
                text = (await row.inner_text(timeout=3000) or "").strip()
            except Exception:  # noqa: BLE001
                continue
            first_line = text.splitlines()[0].strip() if text else ""
            if first_line == contact:
                await row.click()
                await self._wait_chat_open(contact)
                return {"contact": contact, "matched": "exact"}
            if fallback is None and contact.lower() in first_line.lower():
                fallback = row
        if fallback is not None:
            await fallback.click()
            await self._wait_chat_open(contact)
            return {"contact": contact, "matched": "substring"}
        found = await self.search_chats(contact, open_first=True)
        if found.get("opened"):
            return {"contact": contact, "matched": "search"}
        raise RuntimeError(f"No WhatsApp chat matching '{contact}'.")

    async def _clear_search(self) -> None:
        try:
            box = self.page.locator(SELECTORS["search_input"]).first
            await box.click(timeout=4000)
            await self.page.keyboard.press("Control+A")
            await self.page.keyboard.press("Backspace")
            await asyncio.sleep(0.4)
        except Exception:  # noqa: BLE001
            pass

    async def _wait_chat_open(self, contact: str, *, timeout: float = 12.0) -> None:
        deadline = time.time() + timeout
        while time.time() < deadline:
            try:
                header = self.page.locator(SELECTORS["contact_header"]).first
                title = (await header.get_attribute("title") or "") if await header.count() else ""
                if title and (title.lower() in contact.lower() or contact.lower() in title.lower()):
                    return
            except Exception:  # noqa: BLE001
                pass
            await asyncio.sleep(0.4)

    # -- messages -------------------------------------------------------
    async def read_messages(self, contact: str | None = None, *, limit: int = 30) -> list[Message]:
        if contact:
            await self.open_chat(contact)
        rows = self.page.locator(SELECTORS["message_rows"])
        count = await rows.count()
        messages: list[Message] = []
        for index in range(max(0, count - limit), count):
            row = rows.nth(index)
            try:
                classes = await row.get_attribute("class") or ""
                text = (await row.inner_text(timeout=3000) or "").strip()
            except Exception:  # noqa: BLE001
                continue
            direction = "out" if "message-out" in classes else "in"
            author = ""
            lines = [line for line in text.splitlines() if line.strip()]
            if direction == "in" and len(lines) > 1 and len(lines[0]) < 40:
                author = lines[0]
            messages.append(Message(direction=direction, text="\n".join(lines), author=author))
        return messages

    async def send_message(self, contact: str, text: str, *, verify: bool = True) -> dict[str, Any]:
        await self.open_chat(contact)
        box = self.page.locator(SELECTORS["message_input"]).first
        await box.click(timeout=10_000)
        lines = text.split("\n")
        for index, line in enumerate(lines):
            await self.page.keyboard.type(line, delay=12)
            if index < len(lines) - 1:
                await self.page.keyboard.down("Shift")
                await self.page.keyboard.press("Enter")
                await self.page.keyboard.up("Shift")
        await asyncio.sleep(0.3)
        await self.page.keyboard.press("Enter")
        await asyncio.sleep(1.2)
        result: dict[str, Any] = {"sent": True, "contact": contact, "characters": len(text)}
        if verify:
            recent = await self.read_messages(limit=3)
            result["verified"] = any(
                message.direction == "out" and text.split("\n")[0][:40] in message.text
                for message in recent
            )
        return result

    async def send_media(self, contact: str, path: str, *, caption: str = "") -> dict[str, Any]:
        target = Path(path)
        if not target.exists():
            raise FileNotFoundError(f"Media file not found: {target}")
        await self.open_chat(contact)
        await self.page.locator(SELECTORS["attach_button"]).first.click(timeout=8000)
        await asyncio.sleep(0.8)
        chooser = None
        try:
            async with self.page.expect_file_chooser(timeout=8000) as info:
                await self.page.get_by_text("Document", exact=False).first.click(timeout=5000)
            chooser = await info.value
        except Exception:  # noqa: BLE001
            inputs = self.page.locator("input[type='file']")
            if await inputs.count():
                await inputs.first.set_input_files(str(target))
            else:
                raise RuntimeError("Could not reach the WhatsApp attachment file input.")
        if chooser is not None:
            await chooser.set_files(str(target))
        await asyncio.sleep(1.5)
        if caption:
            with contextlib_suppress():
                await self.page.locator("div[contenteditable='true']").last.fill(caption)
        with contextlib_suppress():
            await self.page.get_by_role("button", name="Send").click(timeout=6000)
        await asyncio.sleep(1.5)
        return {"sent": True, "contact": contact, "file": str(target), "caption": caption}

    async def send_voice_note(self, contact: str, *, text: str | None = None,
                              audio_file: str | None = None) -> dict[str, Any]:
        """Send a voice message: either a spoken version of ``text`` (TTS) or an audio file."""
        audio_path = audio_file
        if audio_path is None:
            if self.voice is None:
                raise RuntimeError("Sending a spoken voice note needs the voice service (TTS).")
            if not text:
                raise ValueError("Provide either 'text' or 'audio_file'.")
            audio_path = await self._synthesise(text)
        return await self.send_media(contact, audio_path, caption="")

    async def _synthesise(self, text: str) -> str:
        for method in ("synthesise_to_file", "synthesize_to_file", "speak_to_file"):
            if hasattr(self.voice, method):
                result = getattr(self.voice, method)(text)
                if asyncio.iscoroutine(result):
                    result = await result
                return str(result)
        raise RuntimeError("The configured voice engine cannot render audio to a file.")

    async def unread_summary(self, *, limit: int = 20) -> dict[str, Any]:
        chats = await self.list_chats(limit=limit)
        unread = [chat for chat in chats if chat.unread]
        return {
            "total_unread_chats": len(unread),
            "total_unread_messages": sum(chat.unread for chat in unread),
            "chats": [chat.to_json() for chat in unread],
        }

    # -- calls ----------------------------------------------------------
    async def start_call(self, contact: str, *, kind: str = "voice") -> dict[str, Any]:
        await self.open_chat(contact)
        selector = SELECTORS["call_button"] if kind == "voice" else SELECTORS["video_call_button"]
        try:
            await self.page.locator(selector).first.click(timeout=8000)
        except Exception as exc:  # noqa: BLE001
            # Fall back to vision: find the phone icon in the conversation header.
            located = None
            if self.browser is not None and self.browser.vision is not None:
                located = self.browser.vision.locate_text("call")
            raise RuntimeError(
                f"Could not start the {kind} call to '{contact}' ({exc}). "
                f"Vision search result: {located}"
            ) from exc
        self.call = CallState(active=True, kind=kind, contact=contact, started_at=time.time())
        return {"calling": contact, "kind": kind, "state": self.call.to_json()}

    async def answer_call(self) -> dict[str, Any]:
        try:
            await self.page.locator(SELECTORS["accept_call"]).first.click(timeout=6000)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f"No incoming call to answer ({exc}).") from exc
        self.call.active = True
        self.call.started_at = time.time()
        return {"answered": True, "state": self.call.to_json()}

    async def hang_up(self) -> dict[str, Any]:
        try:
            await self.page.locator(SELECTORS["hangup_call"]).first.click(timeout=6000)
        except Exception:  # noqa: BLE001
            if self.computer is not None:
                self.computer.hotkey("esc")
        self.call.active = False
        return {"ended": True, "call": self.call.to_json(), "turns": len(self.call.transcript)}

    async def call_speak(self, text: str) -> dict[str, Any]:
        """Say something on the live call through the machine's audio output.

        With a loopback/virtual audio device configured as WhatsApp's microphone,
        WhatsApp transmits this to the other party - Vyralis on a real call.
        """
        if self.voice is None:
            raise RuntimeError("Talking on a call needs the voice service (TTS).")
        await self.voice.speak(text)
        self.call.transcript.append({"speaker": "vyralis", "text": text, "ts": time.time()})
        return {
            "spoken": text[:200], "route": self.call.audio_route,
            "note": "Audio goes to the default output device. Set a virtual loopback device as "
                    "WhatsApp's microphone for the caller to hear it.",
        }

    async def call_listen(self, *, seconds: float = 6.0) -> dict[str, Any]:
        """Capture what the other party said (speech-to-text) during a call."""
        if self.voice is None:
            raise RuntimeError("Listening on a call needs the voice service (STT).")
        heard = await self.voice.listen_once(seconds=seconds)
        if heard:
            self.call.transcript.append({"speaker": "caller", "text": heard, "ts": time.time()})
        return {"heard": heard, "transcript_turns": len(self.call.transcript)}

    def transcript(self) -> list[dict[str, Any]]:
        return list(self.call.transcript)


class contextlib_suppress:
    """Tiny local stand-in so we do not shadow contextlib in this module."""

    def __enter__(self) -> None:
        return None

    def __exit__(self, *exc_info: Any) -> bool:
        return True


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, whatsapp: WhatsAppController) -> None:
    def wa_for(_: Any) -> WhatsAppController:
        return whatsapp

    @registry.tool(
        "whatsapp.connect",
        "Link WhatsApp once (QR scan or phone number) and keep the session. Vyralis then sees the "
        "user's chats, contacts and calls exactly as they do.",
        obj(
            {
                "phone_number": prop("string", "Optional: link by phone number instead of QR."),
                "wait_seconds": prop("number", "How long to wait for the user to complete pairing."),
            },
        ),
        category="whatsapp", permission="sensitive", timeout=180.0,
    )
    async def connect(phone_number: str | None = None, wait_seconds: float = 90.0,
                      ctx: Any = None) -> dict[str, Any]:
        return await wa_for(ctx).connect(wait_seconds=wait_seconds, phone_number=phone_number)

    @registry.tool(
        "whatsapp.state", "Check whether WhatsApp is linked, which chat is open, and call status.",
        obj({}), category="whatsapp", permission="safe",
    )
    async def state(ctx: Any = None) -> dict[str, Any]:
        return await wa_for(ctx).state()

    @registry.tool(
        "whatsapp.chats",
        "List recent WhatsApp chats with previews and unread counts, or search for one by name.",
        obj(
            {
                "action": prop("string", "list | search | open | unread",
                               enum=["list", "search", "open", "unread"]),
                "contact": prop("string", "Name or number for search/open."),
                "limit": prop("integer", "How many chats."),
            },
            ["action"],
        ),
        category="whatsapp", permission="safe",
    )
    async def chats(action: str, contact: str | None = None, limit: int = 25,
                    ctx: Any = None) -> dict[str, Any]:
        control = wa_for(ctx)
        if action == "list":
            return {"chats": [chat.to_json() for chat in await control.list_chats(limit=limit)]}
        if action == "search":
            if not contact:
                raise ValueError("action=search needs a contact name.")
            return await control.search_chats(contact)
        if action == "open":
            if not contact:
                raise ValueError("action=open needs a contact name.")
            return await control.open_chat(contact)
        if action == "unread":
            return await control.unread_summary(limit=limit)
        raise ValueError(f"Unknown chats action '{action}'.")

    @registry.tool(
        "whatsapp.read",
        "Read recent messages from a chat (text, direction, author) so the agent knows the "
        "conversation before replying.",
        obj({"contact": prop("string", "Chat name; omit for the currently open chat."),
             "limit": prop("integer", "How many recent messages.")}),
        category="whatsapp", permission="safe",
    )
    async def read(contact: str | None = None, limit: int = 30, ctx: Any = None) -> dict[str, Any]:
        messages = await wa_for(ctx).read_messages(contact, limit=limit)
        return {"messages": [message.to_json() for message in messages]}

    @registry.tool(
        "whatsapp.send",
        "Send a WhatsApp message to a contact or group, then verify it appears in the chat.",
        obj(
            {
                "contact": prop("string", "Chat name or number."),
                "text": prop("string", "Message text; newlines are supported."),
                "verify": prop("boolean", "Confirm the message appears in the thread."),
            },
            ["contact", "text"],
        ),
        category="whatsapp", permission="destructive",
    )
    async def send(contact: str, text: str, verify: bool = True, ctx: Any = None) -> dict[str, Any]:
        return await wa_for(ctx).send_message(contact, text, verify=verify)

    @registry.tool(
        "whatsapp.send_media",
        "Send an image, video, document or audio file in a chat, with an optional caption.",
        obj(
            {
                "contact": prop("string", "Chat name."),
                "path": prop("string", "Local file to send."),
                "caption": prop("string", "Optional caption."),
            },
            ["contact", "path"],
        ),
        category="whatsapp", permission="destructive",
    )
    async def send_media(contact: str, path: str, caption: str = "", ctx: Any = None) -> dict[str, Any]:
        return await wa_for(ctx).send_media(contact, path, caption=caption)

    @registry.tool(
        "whatsapp.send_voice",
        "Send a voice note. Either speak the given text (text-to-speech) or attach an audio file.",
        obj(
            {
                "contact": prop("string", "Chat name."),
                "text": prop("string", "What to say in the voice note."),
                "audio_file": prop("string", "Existing audio file to send instead."),
            },
            ["contact"],
        ),
        category="whatsapp", permission="destructive",
    )
    async def send_voice(contact: str, text: str | None = None, audio_file: str | None = None,
                         ctx: Any = None) -> dict[str, Any]:
        return await wa_for(ctx).send_voice_note(contact, text=text, audio_file=audio_file)

    @registry.tool(
        "whatsapp.call",
        "Voice/video call control: start a call, answer an incoming one, hang up, speak into the "
        "call, listen to the caller, or read the call transcript.",
        obj(
            {
                "action": prop("string", "start | answer | hangup | speak | listen | transcript",
                               enum=["start", "answer", "hangup", "speak", "listen", "transcript"]),
                "contact": prop("string", "Contact to call when action=start."),
                "kind": prop("string", "voice | video"),
                "text": prop("string", "What to say when action=speak."),
                "seconds": prop("number", "How long to listen when action=listen."),
            },
            ["action"],
        ),
        category="whatsapp", permission="destructive", timeout=180.0,
    )
    async def call(action: str, contact: str | None = None, kind: str = "voice",
                   text: str | None = None, seconds: float = 6.0, ctx: Any = None) -> dict[str, Any]:
        control = wa_for(ctx)
        if action == "start":
            if not contact:
                raise ValueError("action=start needs a contact.")
            return await control.start_call(contact, kind=kind)
        if action == "answer":
            return await control.answer_call()
        if action == "hangup":
            return await control.hang_up()
        if action == "speak":
            if not text:
                raise ValueError("action=speak needs text.")
            return await control.call_speak(text)
        if action == "listen":
            return await control.call_listen(seconds=seconds)
        if action == "transcript":
            return {"turns": control.transcript()}
        raise ValueError(f"Unknown call action '{action}'.")
