"""Logging setup.

Logs go to the console *and* to a rotating file under the data directory,
because the app ships as a windowed installer build where stderr is invisible.
"""

from __future__ import annotations

import logging
import logging.handlers
import sys
from typing import Any

from .bus import BUS, EventType

_CONFIGURED = False

_FMT = "%(asctime)s %(levelname)-7s %(name)-28s %(message)s"


class BusLogHandler(logging.Handler):
    """Mirror warnings and errors into the event bus so the HUD can show them."""

    def emit(self, record: logging.LogRecord) -> None:
        if record.levelno < logging.WARNING:
            return
        try:
            BUS.publish(
                EventType.LOG if record.levelno < logging.ERROR else EventType.ERROR,
                {
                    "level": record.levelname,
                    "logger": record.name,
                    "message": record.getMessage(),
                },
            )
        except Exception:  # noqa: BLE001 - logging must never raise
            pass


def setup(level: str | int = logging.INFO, *, to_bus: bool = True) -> None:
    global _CONFIGURED
    if _CONFIGURED:
        return
    root = logging.getLogger()
    root.setLevel(level)

    console = logging.StreamHandler(stream=sys.stderr)
    console.setFormatter(logging.Formatter(_FMT, datefmt="%H:%M:%S"))
    root.addHandler(console)

    # File handler is best-effort: a read-only data dir must not kill startup.
    try:
        from .config import paths

        log_path = paths().logs / "vyralis.log"
        file_handler = logging.handlers.RotatingFileHandler(
            log_path, maxBytes=4 * 1024 * 1024, backupCount=3, encoding="utf-8"
        )
        file_handler.setFormatter(logging.Formatter(_FMT))
        root.addHandler(file_handler)
    except Exception:  # noqa: BLE001
        pass

    if to_bus:
        root.addHandler(BusLogHandler())

    for noisy in ("httpx", "httpcore", "urllib3", "asyncio", "multipart"):
        logging.getLogger(noisy).setLevel(logging.WARNING)
    _CONFIGURED = True


def get(name: str, **extra: Any) -> logging.LoggerAdapter:
    logger = logging.getLogger(name)
    return logging.LoggerAdapter(logger, extra) if extra else logging.getLogger(name)  # type: ignore[return-value]
