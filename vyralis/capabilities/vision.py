"""Vision: screenshots, screen maps, change verification.

Two ideas make this subsystem different from "take a screenshot and hope":

**1. A screen can be described in text.**
    :meth:`VisionEngine.screen_map` returns an annotated image *plus* a
    structured, numbered, coordinate-bearing text description of everything
    detectable on screen - OCR text runs and grid cells, each with a click
    point. A model with no vision capability consumes the text map and drives
    the mouse just as accurately as a vision model reading the image. Both
    agents use the exact same marks, so they agree about what is on screen.

**2. Actions must be verifiable.**
    :meth:`VisionEngine.diff` and :meth:`VisionEngine.verify_change` answer the
    question "did that click/keystroke actually do anything?". Nothing in the
    runtime is allowed to *assume* an input landed; the agent checks, and
    retries with a different strategy (focus the window, click the field, then
    type) when the pixels did not move.
"""

from __future__ import annotations

import base64
import io
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Sequence

from ..config import Settings

log = logging.getLogger("vyralis.vision")

try:  # Pillow is a declared dependency; degrade instead of crashing if absent.
    from PIL import Image, ImageChops, ImageDraw, ImageFont

    PIL_AVAILABLE = True
except Exception:  # noqa: BLE001
    Image = None  # type: ignore[assignment]
    PIL_AVAILABLE = False

try:  # pytesseract makes the text map far richer, but stays optional.
    import pytesseract  # type: ignore

    OCR_AVAILABLE = True
except Exception:  # noqa: BLE001
    pytesseract = None  # type: ignore[assignment]
    OCR_AVAILABLE = False


@dataclass
class Mark:
    """One addressable thing on screen."""

    index: int
    label: str
    x: int
    y: int
    width: int = 0
    height: int = 0
    kind: str = "text"          # text | cell | window | element
    confidence: float = 0.0

    @property
    def center(self) -> tuple[int, int]:
        if self.width and self.height:
            return self.x + self.width // 2, self.y + self.height // 2
        return self.x, self.y

    def to_json(self) -> dict[str, Any]:
        cx, cy = self.center
        return {
            "id": self.index, "label": self.label, "kind": self.kind,
            "box": [self.x, self.y, self.width, self.height],
            "click": [cx, cy], "confidence": round(self.confidence, 2),
        }

    def to_line(self) -> str:
        cx, cy = self.center
        return f"  [{self.index}] \"{self.label}\" at ({cx}, {cy}) [{self.kind}]"


@dataclass
class ScreenMap:
    """Everything the agent needs to decide the next input, in one object."""

    image_path: str | None
    width: int
    height: int
    monitor: int = 0
    marks: list[Mark] = field(default_factory=list)
    text: str = ""
    ocr_used: bool = False
    created_at: float = field(default_factory=time.time)

    def find(self, needle: str, *, kind: str | None = None) -> list[Mark]:
        needle = needle.lower()
        out = []
        for mark in self.marks:
            if kind and mark.kind != kind:
                continue
            if needle in mark.label.lower():
                out.append(mark)
        return out

    def best(self, needle: str) -> Mark | None:
        matches = self.find(needle)
        if not matches:
            return None
        # Prefer exact-ish, high-confidence, text marks over grid cells.
        return max(matches, key=lambda m: (m.confidence, m.kind == "text", len(m.label)))

    def to_text(self, limit_marks: int = 120, include_ocr: bool = True) -> str:
        """The vision-free view of the screen."""
        lines = [
            f"SCREEN MAP  {self.width}x{self.height}px  (monitor {self.monitor})",
            f"marks: {len(self.marks)}",
        ]
        for mark in self.marks[:limit_marks]:
            lines.append(mark.to_line())
        if len(self.marks) > limit_marks:
            lines.append(f"  ... {len(self.marks) - limit_marks} more marks omitted")
        if include_ocr and self.text:
            lines.append("TEXT ON SCREEN:")
            lines.append(self.text[:4000])
        return "\n".join(lines)

    def to_json(self) -> dict[str, Any]:
        return {
            "width": self.width, "height": self.height, "monitor": self.monitor,
            "image_path": self.image_path, "ocr_used": self.ocr_used,
            "marks": [mark.to_json() for mark in self.marks],
            "text": self.text[:8000],
        }


class VisionEngine:
    """Screen capture, marking, OCR and change detection."""

    def __init__(self, settings: Settings, artifacts_dir: Path) -> None:
        self.settings = settings
        self.artifacts_dir = Path(artifacts_dir)
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)
        self._last_image: Any = None
        self._last_path: Path | None = None

    # -- availability ---------------------------------------------------
    @staticmethod
    def capabilities() -> dict[str, bool]:
        return {"pillow": PIL_AVAILABLE, "ocr": OCR_AVAILABLE}

    def _require_pillow(self) -> None:
        if not PIL_AVAILABLE:
            raise RuntimeError(
                "Screen capture needs Pillow. Install with: pip install pillow (or the 'desktop' extra)."
            )

    # -- capture --------------------------------------------------------
    def grab(self, *, region: tuple[int, int, int, int] | None = None, monitor: int = 0) -> Any:
        """Capture the screen (or a region) and return a PIL image."""
        self._require_pillow()
        try:
            import pyautogui

            image = pyautogui.screenshot(region=region)
        except Exception as exc:  # noqa: BLE001 - headless / no display
            raise RuntimeError(
                f"Screen capture failed ({exc}). On Linux this usually means no display server; "
                f"on Windows ensure the app is not running as a session-0 service."
            ) from exc
        if monitor and monitor > 0:
            image = self._crop_to_monitor(image, monitor)
        self._last_image = image
        return image

    def _crop_to_monitor(self, image: Any, monitor: int) -> Any:
        try:
            from PIL import ImageGrab

            monitors = _enumerate_monitors()
            if 0 < monitor <= len(monitors):
                left, top, right, bottom = monitors[monitor - 1]
                return ImageGrab.grab(bbox=(left, top, right, bottom), all_screens=True)
        except Exception:  # noqa: BLE001
            pass
        return image

    def capture(
        self,
        *,
        region: tuple[int, int, int, int] | None = None,
        monitor: int = 0,
        name: str = "screen",
        with_marks: bool | None = None,
        with_grid: bool | None = None,
    ) -> tuple[Path, Any]:
        image = self.grab(region=region, monitor=monitor)
        annotated = image
        if with_grid if with_grid is not None else self.settings.vision_grid_overlay:
            annotated = self.grid_overlay(annotated)
        path = self.artifacts_dir / f"{name}-{int(time.time() * 1000)}.png"
        annotated.save(path, format="PNG", optimize=True)
        self._last_path = path
        if annotated is not image:
            self._last_image = annotated
        return path, annotated

    def data_url(self, image_or_path: Any) -> str:
        """PNG data URL for a vision model message part."""
        image = self._as_image(image_or_path)
        buffer = io.BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")

    @staticmethod
    def _as_image(image_or_path: Any) -> Any:
        if PIL_AVAILABLE and hasattr(image_or_path, "save"):
            return image_or_path
        if not PIL_AVAILABLE:
            raise RuntimeError("Pillow is required to encode images.")
        return Image.open(str(image_or_path))

    # -- screen map -----------------------------------------------------
    def screen_map(
        self,
        *,
        region: tuple[int, int, int, int] | None = None,
        monitor: int = 0,
        max_marks: int = 220,
        grid: int = 0,
        name: str = "map",
    ) -> ScreenMap:
        """Capture + mark + OCR in one pass. This is the agent's primary sense."""
        path, image = self.capture(region=region, monitor=monitor, name=name, with_grid=False)
        assert image is not None

        marks: list[Mark] = []
        text = ""
        used_ocr = False

        if OCR_AVAILABLE:
            try:
                marks, text = self._ocr_marks(image, max_marks=max_marks)
                used_ocr = bool(marks)
            except Exception as exc:  # noqa: BLE001
                log.debug("OCR failed, falling back to grid: %s", exc)

        if not marks:
            # Vision-only models still get image + grid; text-only agents get a
            # coordinate lattice they can reason about.
            columns = grid or 12
            rows = max(1, int(columns * image.height / max(1, image.width)))
            marks = self._grid_marks(image, columns, rows)

        screen = ScreenMap(
            image_path=str(path), width=image.width, height=image.height, monitor=monitor,
            marks=marks[:max_marks], text=text, ocr_used=used_ocr,
        )

        # Persist an annotated copy so the user can see exactly what the agent saw.
        try:
            annotated = self.draw_marks(image, marks[:max_marks])
            annotated.save(str(path), format="PNG", optimize=True)
        except Exception:  # noqa: BLE001
            pass
        return screen

    def _ocr_marks(self, image: Any, *, max_marks: int) -> tuple[list[Mark], str]:
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        marks: list[Mark] = []
        lines: dict[tuple[int, int, int], list[str]] = {}
        count = len(data.get("text", []))
        for i in range(count):
            word = (data["text"][i] or "").strip()
            if not word:
                continue
            try:
                confidence = float(data["conf"][i])
            except (TypeError, ValueError):
                confidence = 0.0
            if confidence < 35:
                continue
            left, top = int(data["left"][i]), int(data["top"][i])
            width, height = int(data["width"][i]), int(data["height"][i])
            marks.append(
                Mark(len(marks), word, left, top, width, height, "text", confidence / 100.0)
            )
            key = (data["block_num"][i], data["par_num"][i], data["line_num"][i])
            lines.setdefault(key, []).append(word)
        text = "\n".join(" ".join(words) for _, words in lines.items())
        return marks[:max_marks], text

    @staticmethod
    def _grid_marks(image: Any, columns: int, rows: int) -> list[Mark]:
        cell_w = image.width // columns
        cell_h = image.height // rows
        marks: list[Mark] = []
        for row in range(rows):
            for column in range(columns):
                x = column * cell_w + cell_w // 2
                y = row * cell_h + cell_h // 2
                marks.append(
                    Mark(len(marks), f"cell r{row + 1}c{column + 1}", x, y, cell_w, cell_h, "cell", 0.0)
                )
        return marks

    def draw_marks(self, image: Any, marks: Sequence[Mark]) -> Any:
        """Burn numbered markers into a copy of the image (set-of-marks)."""
        if not PIL_AVAILABLE:
            return image
        canvas = image.copy().convert("RGB")
        draw = ImageDraw.Draw(canvas)
        font = _load_font()
        for mark in marks:
            x, y, w, h = mark.x, mark.y, mark.width, mark.height
            box = [x, y, x + w, y + h] if w and h else [x - 3, y - 3, x + 3, y + 3]
            colour = (0, 229, 255) if mark.kind == "text" else (120, 90, 255)
            draw.rectangle(box, outline=colour, width=1)
            cx, cy = mark.center
            label = f"{mark.index}"
            bbox = draw.textbbox((cx, cy), label, font=font)
            pad = 2
            draw.rectangle(
                [bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad],
                fill=(0, 0, 0),
            )
            draw.text((cx, cy), label, fill=colour, font=font)
        return canvas

    def grid_overlay(self, image: Any, columns: int = 10) -> Any:
        if not PIL_AVAILABLE:
            return image
        canvas = image.copy().convert("RGB")
        draw = ImageDraw.Draw(canvas)
        step_x = image.width / columns
        step_y = step_x
        for i in range(1, columns):
            x = int(i * step_x)
            draw.line([(x, 0), (x, image.height)], fill=(40, 60, 80), width=1)
        rows = int(image.height / step_y)
        for j in range(1, rows):
            y = int(j * step_y)
            draw.line([(0, y), (image.width, y)], fill=(40, 60, 80), width=1)
        return canvas

    def crop(self, image_or_path: Any, box: tuple[int, int, int, int], *, zoom: float = 1.0) -> Any:
        image = self._as_image(image_or_path).crop(box)
        if zoom != 1.0:
            image = image.resize(
                (max(1, int(image.width * zoom)), max(1, int(image.height * zoom)))
            )
        return image

    # -- change detection -----------------------------------------------
    def diff(self, before: Any, after: Any, *, threshold: int = 12) -> dict[str, Any]:
        """Quantify how different two frames are, and where."""
        if not PIL_AVAILABLE:
            return {"changed": False, "reason": "Pillow unavailable"}
        first = self._as_image(before).convert("RGB")
        second = self._as_image(after).convert("RGB")
        if first.size != second.size:
            second = second.resize(first.size)
        difference = ImageChops.difference(first, second).convert("L")
        histogram = difference.histogram()
        total = sum(histogram) or 1
        changed_pixels = sum(histogram[threshold:])
        ratio = changed_pixels / total
        bbox = difference.getbbox()
        return {
            "changed": ratio > 0.0004,
            "changed_ratio": round(ratio, 6),
            "changed_pixels": changed_pixels,
            "bbox": list(bbox) if bbox else None,
        }

    def verify_change(
        self, before: Any, *, region: tuple[int, int, int, int] | None = None,
        threshold: int = 12, settle: float = 0.35,
    ) -> dict[str, Any]:
        """Did the screen change since ``before``? Waits briefly for repaint."""
        if settle:
            time.sleep(settle)
        after = self.grab(region=region)
        result = self.diff(before, after)
        result["after_image"] = after
        return result

    # -- targeted vision helpers ----------------------------------------
    def locate_text(self, needle: str, *, monitor: int = 0) -> Mark | None:
        """OCR the live screen and return the best matching mark."""
        screen = self.screen_map(monitor=monitor, grid=0)
        return screen.best(needle)

    def wait_for_text(
        self, needle: str, *, timeout: float = 15.0, interval: float = 0.8, monitor: int = 0
    ) -> Mark | None:
        """Poll the screen until ``needle`` appears (or give up)."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            mark = self.locate_text(needle, monitor=monitor)
            if mark is not None:
                return mark
            time.sleep(interval)
        return None

    def colour_at(self, x: int, y: int) -> tuple[int, int, int]:
        image = self._last_image or self.grab()
        pixel = image.convert("RGB").getpixel((x, y))
        return tuple(int(channel) for channel in pixel)  # type: ignore[return-value]


def _load_font() -> Any:
    if not PIL_AVAILABLE:
        return None
    try:
        return ImageFont.load_default()
    except Exception:  # noqa: BLE001
        return None


def _enumerate_monitors() -> list[tuple[int, int, int, int]]:
    """Best-effort monitor geometry list (left, top, right, bottom)."""
    try:
        import pyautogui

        size = pyautogui.size()
        return [(0, 0, size.width, size.height)]
    except Exception:  # noqa: BLE001
        return []


def summarise_marks(marks: Iterable[Mark], limit: int = 40) -> str:
    return "\n".join(mark.to_line() for mark in list(marks)[:limit])


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, engine: VisionEngine) -> None:
    from ..tools.registry import obj, prop  # local import keeps module load order simple

    def vision_for(_: Any) -> VisionEngine:
        return engine

    @registry.tool(
        "vision.look",
        "Look at the screen and get a numbered map of everything on it: every text run and UI "
        "region with its exact click coordinates, plus the full visible text. Use this before "
        "clicking anything. Works for both vision and non-vision models - the marks are identical.",
        obj(
            {
                "region": prop("array", "Optional [left, top, width, height] to look at only part "
                                        "of the screen.", items={"type": "integer"}),
                "monitor": prop("integer", "Monitor number, 1-based."),
                "max_marks": prop("integer", "Cap on returned marks."),
                "grid": prop("integer", "Fallback grid columns when OCR is unavailable."),
            },
        ),
        category="vision", permission="safe",
    )
    def look(region: list[int] | None = None, monitor: int = 0, max_marks: int = 220,
             grid: int = 12, ctx: Any = None) -> dict[str, Any]:
        screen = vision_for(ctx).screen_map(
            region=tuple(region) if region else None,  # type: ignore[arg-type]
            monitor=monitor, max_marks=max_marks, grid=grid,
        )
        return screen.to_json() | {"text_map": screen.to_text()}

    @registry.tool(
        "vision.screenshot",
        "Save a screenshot of the screen (or a region) and return its file path.",
        obj(
            {
                "region": prop("array", "Optional [left, top, width, height].",
                               items={"type": "integer"}),
                "name": prop("string", "File name prefix."),
            },
        ),
        category="vision", permission="safe",
    )
    def screenshot(region: list[int] | None = None, name: str = "screen", ctx: Any = None) -> dict[str, Any]:
        path, image = vision_for(ctx).capture(
            region=tuple(region) if region else None,  # type: ignore[arg-type]
            name=name,
        )
        return {"path": str(path), "width": image.width, "height": image.height}

    @registry.tool(
        "vision.find",
        "Find a word, label or button caption on screen with its click coordinates, without "
        "looking at the whole screen yourself.",
        obj(
            {
                "text": prop("string", "Text to find, e.g. 'Save' or 'Send'."),
                "wait_seconds": prop("number", "Poll this long for the text to appear."),
                "monitor": prop("integer", "Monitor number."),
            },
            ["text"],
        ),
        category="vision", permission="safe",
    )
    def find(text: str, wait_seconds: float = 0.0, monitor: int = 0, ctx: Any = None) -> dict[str, Any]:
        engine_local = vision_for(ctx)
        mark = (
            engine_local.wait_for_text(text, timeout=wait_seconds, monitor=monitor)
            if wait_seconds > 0
            else engine_local.locate_text(text, monitor=monitor)
        )
        if mark is None:
            screen = engine_local.screen_map(monitor=monitor)
            return {
                "found": False, "text": text,
                "near_misses": [m.to_json() for m in screen.find(text[:4])[:6]],
                "text_map": screen.to_text(limit_marks=60),
            }
        return {"found": True, "mark": mark.to_json(), "click": list(mark.center)}

    @registry.tool(
        "vision.verify",
        "Check whether the screen changed since a previous capture, and where. Use this after "
        "clicking or typing to confirm the action actually did something instead of assuming it did.",
        obj(
            {
                "before_path": prop("string", "Screenshot taken before the action."),
                "region": prop("array", "Optional region to compare.", items={"type": "integer"}),
                "settle": prop("number", "Seconds to wait for a repaint before comparing."),
            },
            ["before_path"],
        ),
        category="vision", permission="safe",
    )
    def verify(before_path: str, region: list[int] | None = None, settle: float = 0.4,
               ctx: Any = None) -> dict[str, Any]:
        result = vision_for(ctx).verify_change(
            before_path,
            region=tuple(region) if region else None,  # type: ignore[arg-type]
            settle=settle,
        )
        result.pop("after_image", None)
        return result

    @registry.tool(
        "vision.zoom",
        "Crop and enlarge part of the screen to read small text or inspect a control closely.",
        obj(
            {
                "region": prop("array", "[left, top, width, height] to zoom into.",
                               items={"type": "integer"}),
                "zoom": prop("number", "Magnification factor."),
            },
            ["region"],
        ),
        category="vision", permission="safe",
    )
    def zoom(region: list[int], zoom: float = 2.5, ctx: Any = None) -> dict[str, Any]:
        engine_local = vision_for(ctx)
        image = engine_local.grab()
        cropped = engine_local.crop(image, tuple(region), zoom=zoom)  # type: ignore[arg-type]
        path = engine_local.artifacts_dir / f"zoom-{int(time.time() * 1000)}.png"
        cropped.save(str(path))
        return {"path": str(path), "width": cropped.width, "height": cropped.height,
                "region": list(region), "zoom": zoom}

    @registry.tool(
        "vision.pixel",
        "Read the RGB colour of a pixel - handy for checking whether a control is enabled, "
        "selected or in an error state.",
        obj({"x": prop("integer", "X coordinate."), "y": prop("integer", "Y coordinate.")},
            ["x", "y"]),
        category="vision", permission="safe",
    )
    def pixel(x: int, y: int, ctx: Any = None) -> dict[str, Any]:
        red, green, blue = vision_for(ctx).colour_at(x, y)
        return {"x": x, "y": y, "rgb": [red, green, blue], "hex": f"#{red:02x}{green:02x}{blue:02x}"}

    @registry.tool(
        "vision.capabilities",
        "Report what the vision stack can do on this machine (screen capture, OCR availability).",
        obj({}), category="vision", permission="safe",
    )
    def capabilities(ctx: Any = None) -> dict[str, Any]:
        return VisionEngine.capabilities()
