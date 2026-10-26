"""Voice: the default interface.

Voice-first means speech is the primary channel and the text box is an option,
not the other way round. Three engines, in order of preference:

* ``browser`` - the GUI uses the platform's built-in speech synthesis and
  recognition. Zero install size, instant start, works everywhere. The server
  still records every utterance on the bus so the transcript stays complete.
* ``local`` - offline TTS/STT on the machine (pyttsx3 / SAPI / say / espeak, and
  faster-whisper for recognition). Private and free, at the cost of ~1 GB when
  Whisper is enabled.
* ``provider`` - a cloud voice model (including a realtime audio model). Highest
  quality, needs a key, and is the only engine that can hold a genuinely
  conversational audio call.

The service is deliberately chatty on the bus and quiet in the room: it only
speaks what the user should hear, never raw tool output.
"""

from __future__ import annotations

import asyncio
import logging
import platform
import shutil
import subprocess
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .bus import BUS, EventType
from .config import Settings

log = logging.getLogger("vyralis.voice")

SPEAK_MIN_INTERVAL = 2.5   # seconds; stops the agent narrating every step


@dataclass
class Utterance:
    text: str
    speaker: str = "vyralis"        # vyralis | user
    at: float = field(default_factory=time.time)
    source: str = "text"            # text | voice

    def to_json(self) -> dict[str, Any]:
        return {"text": self.text[:2000], "speaker": self.speaker, "at": self.at,
                "source": self.source}


class VoiceService:
    """Speech output, speech input and the shared transcript."""

    def __init__(self, settings: Settings, artifacts_dir: Path) -> None:
        self.settings = settings
        self.artifacts_dir = Path(artifacts_dir)
        self.transcript: list[Utterance] = []
        self._last_spoken = 0.0
        self._busy = False
        self._engine = settings.voice_engine

    # -- availability ---------------------------------------------------
    @staticmethod
    def capabilities() -> dict[str, Any]:
        return {
            "pyttsx3": _has("pyttsx3"),
            "piper": bool(shutil.which("piper")),
            "espeak": bool(shutil.which("espeak") or shutil.which("espeak-ng")),
            "say": bool(shutil.which("say")),
            "powershell_sapi": platform.system() == "Windows",
            "sounddevice": _has("sounddevice"),
            "faster_whisper": _has("faster_whisper"),
            "browser_engine": True,
        }

    def resolve_engine(self) -> str:
        """Fall back gracefully if the configured engine is not installed."""
        if self._engine == "local" and not any(
            self.capabilities()[key] for key in ("pyttsx3", "espeak", "say", "powershell_sapi")
        ):
            log.info("local voice engine unavailable; using the browser engine")
            return "browser"
        return self._engine

    # -- speech out -----------------------------------------------------
    async def speak(self, text: str, *, force: bool = True, wait: bool = False) -> dict[str, Any]:
        """Say something. Publishes SPEECH_START/END so the HUD animates."""
        text = (text or "").strip()
        if not text or not self.settings.voice_enabled:
            return {"spoken": False, "reason": "voice disabled or empty"}
        engine = self.resolve_engine()
        self._last_spoken = time.time()
        self.transcript.append(Utterance(text=text, speaker="vyralis"))
        BUS.publish(EventType.SPEECH_START, {"text": text[:2000], "engine": engine})
        self._busy = True
        try:
            if engine == "browser":
                # The GUI performs the actual synthesis; nothing to do here.
                pass
            elif engine == "local":
                method = self._speak_local
                if wait:
                    await asyncio.to_thread(method, text)
                else:
                    asyncio.get_running_loop().run_in_executor(None, method, text)
            elif engine == "provider":
                await self._speak_provider(text)
        except Exception as exc:  # noqa: BLE001
            log.debug("speech failed: %s", exc)
        finally:
            self._busy = False
            BUS.publish(EventType.SPEECH_END, {"text": text[:2000], "engine": engine})
        return {"spoken": True, "engine": engine, "characters": len(text)}

    def _speak_local(self, text: str) -> None:
        system = platform.system()
        try:
            if system == "Darwin" and shutil.which("say"):
                voice = self.settings.voice_name
                argv = ["say"] + (["-v", voice] if voice else []) + [text]
                subprocess.run(argv, check=False, timeout=300)
                return
            if system == "Windows":
                if _has("pyttsx3"):
                    self._speak_pyttsx3(text)
                    return
                # SAPI through PowerShell: no dependency at all.
                escaped = text.replace("'", "''")
                script = (
                    "Add-Type -AssemblyName System.Speech; "
                    "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
                    f"$s.Speak('{escaped}')"
                )
                subprocess.run(
                    ["powershell", "-NoProfile", "-Command", script], check=False, timeout=300
                )
                return
            if _has("pyttsx3"):
                self._speak_pyttsx3(text)
                return
            player = shutil.which("espeak-ng") or shutil.which("espeak")
            if player:
                subprocess.run([player, text], check=False, timeout=300)
        except Exception as exc:  # noqa: BLE001
            log.debug("local speech failed: %s", exc)

    def _speak_pyttsx3(self, text: str) -> None:
        import pyttsx3  # type: ignore

        engine = pyttsx3.init()
        if self.settings.voice_name:
            for voice in engine.getProperty("voices"):
                if self.settings.voice_name.lower() in str(voice.name).lower():
                    engine.setProperty("voice", voice.id)
                    break
        engine.say(text)
        engine.runAndWait()

    async def _speak_provider(self, text: str) -> None:
        """Cloud TTS using an OpenAI-compatible audio endpoint."""
        provider = next(
            (p for p in self.settings.active_providers if p.audio_model), None
        ) or (self.settings.active_providers[0] if self.settings.active_providers else None)
        if provider is None:
            log.debug("no provider available for cloud speech")
            return
        import httpx

        url = provider.base_url.rstrip("/") + "/audio/speech"
        payload = {
            "model": provider.audio_model or "tts-1",
            "voice": self.settings.voice_name or "alloy",
            "input": text[:4000],
            "response_format": "mp3",
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                url, json=payload, headers={"authorization": f"Bearer {provider.resolved_key()}"}
            )
            response.raise_for_status()
            path = self.artifacts_dir / f"speech-{int(time.time() * 1000)}.mp3"
            path.write_bytes(response.content)
        await asyncio.to_thread(self._play_file, path)

    @staticmethod
    def _play_file(path: Path) -> None:
        system = platform.system()
        try:
            if system == "Windows":
                import winsound  # type: ignore

                winsound.PlaySound(str(path), winsound.SND_FILENAME)
                return
            player = shutil.which("afplay") or shutil.which("ffplay") or shutil.which("mpv")
            if player:
                subprocess.run([player, str(path)], check=False, timeout=600)
        except Exception as exc:  # noqa: BLE001
            log.debug("playback failed: %s", exc)

    def maybe_speak(self, text: str) -> None:
        """Narrate a short progress note without flooding the audio channel."""
        if not self.settings.voice_enabled or self._busy:
            return
        if time.time() - self._last_spoken < SPEAK_MIN_INTERVAL:
            return
        if len(text) > 300:
            return
        try:
            asyncio.get_running_loop().create_task(self.speak(text))
        except RuntimeError:
            pass

    # -- speech in ------------------------------------------------------
    async def listen_once(self, *, seconds: float = 6.0) -> str:
        """Record from the default input and transcribe it locally.

        Used for listening on a live call, and as the offline input path. The
        GUI normally handles push-to-talk with the browser engine instead.
        """
        if not _has("sounddevice") or not _has("faster_whisper"):
            log.debug("local listening unavailable (needs sounddevice + faster-whisper)")
            return ""
        BUS.publish(EventType.LISTEN_START, {"seconds": seconds})
        try:
            audio = await asyncio.to_thread(self._record, seconds)
            text_value = await asyncio.to_thread(self._transcribe, audio)
        finally:
            BUS.publish(EventType.LISTEN_END, {})
        if text_value:
            self.transcript.append(Utterance(text=text_value, speaker="user", source="voice"))
        return text_value

    def _record(self, seconds: float) -> Any:
        import sounddevice as sd  # type: ignore

        sample_rate = 16_000
        recording = sd.rec(int(seconds * sample_rate), samplerate=sample_rate, channels=1,
                           dtype="float32")
        sd.wait()
        return recording

    def _transcribe(self, audio: Any) -> str:
        from faster_whisper import WhisperModel  # type: ignore

        model = getattr(self, "_whisper", None)
        if model is None:
            model = WhisperModel("base", device="cpu", compute_type="int8")
            self._whisper = model
        segments, _info = model.transcribe(audio, language=None, vad_filter=True)
        return " ".join(segment.text.strip() for segment in segments).strip()

    # -- files (WhatsApp voice notes, call audio) -----------------------
    async def synthesise_to_file(self, text: str) -> str:
        """Render speech to an audio file so it can be sent as a voice message."""
        path = self.artifacts_dir / f"voice-note-{int(time.time() * 1000)}.wav"
        engine = self.resolve_engine()
        if engine == "local" and _has("pyttsx3"):
            await asyncio.to_thread(self._pyttsx3_to_file, text, path)
            return str(path)
        if shutil.which("espeak-ng") or shutil.which("espeak"):
            player = shutil.which("espeak-ng") or shutil.which("espeak")
            await asyncio.to_thread(
                subprocess.run, [player, "-w", str(path), text], check=False
            )
            return str(path)
        if platform.system() == "Darwin" and shutil.which("say"):
            aiff = path.with_suffix(".aiff")
            await asyncio.to_thread(subprocess.run, ["say", "-o", str(aiff), text], check=False)
            return str(aiff)
        if engine == "provider":
            provider = next((p for p in self.settings.active_providers if p.audio_model), None)
            if provider is not None:
                import httpx

                async with httpx.AsyncClient(timeout=90.0) as client:
                    response = await client.post(
                        provider.base_url.rstrip("/") + "/audio/speech",
                        json={"model": provider.audio_model, "voice": "alloy", "input": text[:4000]},
                        headers={"authorization": f"Bearer {provider.resolved_key()}"},
                    )
                    response.raise_for_status()
                    path = path.with_suffix(".mp3")
                    path.write_bytes(response.content)
                    return str(path)
        raise RuntimeError(
            "No text-to-speech engine can render a file on this machine. Install one with "
            "'pip install pyttsx3', install espeak-ng, or configure a provider with an audio model."
        )

    @staticmethod
    def _pyttsx3_to_file(text: str, path: Path) -> None:
        import pyttsx3  # type: ignore

        engine = pyttsx3.init()
        engine.save_to_file(text, str(path))
        engine.runAndWait()

    # -- transcript -----------------------------------------------------
    def note_user(self, text: str, *, source: str = "voice") -> None:
        self.transcript.append(Utterance(text=text, speaker="user", source=source))

    def recent(self, limit: int = 40) -> list[dict[str, Any]]:
        return [item.to_json() for item in self.transcript[-limit:]]

    def clear(self) -> None:
        self.transcript.clear()


def _has(module: str) -> bool:
    import importlib.util

    try:
        return importlib.util.find_spec(module) is not None
    except (ImportError, ValueError):
        return False
