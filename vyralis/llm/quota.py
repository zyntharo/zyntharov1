"""Quota accounting.

The Manager agent needs hard numbers, not vibes, so every provider call is
recorded in the SQLite ledger. The ledger answers two questions:

1. *May I make this call right now?* - rolling rpm/tpm and daily rpd/tpd caps,
   plus an exponential cooldown after a real HTTP 429.
2. *How much headroom is left?* - a snapshot the GUI renders as ring gauges and
   the Manager uses to pick models and to decide when to wake the main agent.

Limits are advisory: providers with ``rpm=0`` are treated as unlimited, and a
server-side 429 always overrides our optimistic bookkeeping.
"""

from __future__ import annotations

import math
import time
from dataclasses import dataclass, field
from typing import Any

from ..bus import BUS, EventType
from ..config import ProviderConfig, Settings
from ..memory.store import MemoryStore

MINUTE = 60.0
DAY = 86400.0


@dataclass
class QuotaDecision:
    allowed: bool
    reason: str = ""
    wait_seconds: float = 0.0
    # Fraction of each configured limit already consumed (0..1).
    pressure: float = 0.0


@dataclass
class ProviderHealth:
    provider_id: str = ""
    failures: int = 0
    last_error: str = ""
    cooldown_until: float = 0.0
    last_ok: float = 0.0
    consecutive_429: int = 0

    def cooling(self, now: float | None = None) -> bool:
        return (now or time.time()) < self.cooldown_until


@dataclass
class UsageWindow:
    rpm: int = 0
    rpd: int = 0
    tpm: int = 0
    tpd: int = 0
    requests_minute: int = 0
    requests_day: int = 0
    tokens_minute: int = 0
    tokens_day: int = 0
    extra: dict[str, Any] = field(default_factory=dict)

    def to_json(self) -> dict[str, Any]:
        return {
            "rpm": self.rpm, "rpd": self.rpd, "tpm": self.tpm, "tpd": self.tpd,
            "requests_minute": self.requests_minute, "requests_day": self.requests_day,
            "tokens_minute": self.tokens_minute, "tokens_day": self.tokens_day,
            **self.extra,
        }


class QuotaLedger:
    """Rolling-window rate accounting + provider health, backed by SQLite."""

    def __init__(self, store: MemoryStore, settings: Settings) -> None:
        self.store = store
        self.settings = settings
        self._health: dict[str, ProviderHealth] = {}
        self._cache: dict[str, tuple[float, dict[str, int], dict[str, int]]] = {}
        self._cache_ttl = 2.0

    # -- health ---------------------------------------------------------
    def health(self, provider_id: str) -> ProviderHealth:
        return self._health.setdefault(provider_id, ProviderHealth())

    def mark_ok(self, provider_id: str) -> None:
        health = self.health(provider_id)
        health.failures = 0
        health.consecutive_429 = 0
        health.last_ok = time.time()
        health.cooldown_until = 0.0

    def mark_failure(self, provider_id: str, error: str, *, rate_limited: bool = False) -> None:
        health = self.health(provider_id)
        health.failures += 1
        health.last_error = error[:400]
        if rate_limited:
            health.consecutive_429 += 1
            # 2s, 4s, 8s ... capped at 10 minutes; the provider told us "no", so
            # waiting is cheaper than hammering it and getting banned.
            backoff = min(600.0, 2.0 ** min(health.consecutive_429, 9))
        else:
            backoff = min(120.0, 3.0 * health.failures)
        health.cooldown_until = time.time() + backoff

    def clear(self, provider_id: str) -> None:
        self._health.pop(provider_id, None)

    # -- accounting -----------------------------------------------------
    def _window(self, provider_id: str) -> tuple[dict[str, int], dict[str, int]]:
        cached = self._cache.get(provider_id)
        now = time.time()
        if cached and now - cached[0] < self._cache_ttl:
            return cached[1], cached[2]
        minute = self.store.usage_since(provider_id, now - MINUTE)
        day = self.store.usage_since(provider_id, now - DAY)
        self._cache[provider_id] = (now, minute, day)
        return minute, day

    def check(self, provider: ProviderConfig, *, estimated_tokens: int = 0) -> QuotaDecision:
        now = time.time()
        health = self.health(provider.id)
        if health.cooling(now):
            wait = health.cooldown_until - now
            return QuotaDecision(False, f"cooling down after error ({health.last_error[:60]})", wait, 0.9)

        minute, day = self._window(provider.id)
        request_minute = minute.get("requests", 0) + 1
        request_day = day.get("requests", 0) + 1
        tokens_minute = minute.get("tokens_in", 0) + minute.get("tokens_out", 0) + estimated_tokens
        tokens_day = day.get("tokens_in", 0) + day.get("tokens_out", 0) + estimated_tokens

        pressures: list[float] = []
        if provider.rpm and request_minute > provider.rpm:
            return QuotaDecision(False, f"rpm limit {provider.rpm} reached", MINUTE / 4, 1.0)
        if provider.rpd and request_day > provider.rpd:
            wait = self._seconds_until_reset(provider.id, DAY)
            return QuotaDecision(False, f"rpd limit {provider.rpd} reached", wait, 1.0)
        if provider.tpm and tokens_minute > provider.tpm:
            return QuotaDecision(False, f"tpm limit {provider.tpm} reached", MINUTE / 4, 1.0)
        if provider.tpd and tokens_day > provider.tpd:
            wait = self._seconds_until_reset(provider.id, DAY)
            return QuotaDecision(False, f"tpd limit {provider.tpd} reached", wait, 1.0)

        for used, cap in ((request_minute, provider.rpm), (request_day, provider.rpd),
                          (tokens_minute, provider.tpm), (tokens_day, provider.tpd)):
            if cap:
                pressures.append(used / cap)
        pressure = max(pressures) if pressures else 0.0
        return QuotaDecision(True, "", 0.0, pressure)

    def _seconds_until_reset(self, provider_id: str, window: float) -> float:
        """Rough time until the oldest entry in the window ages out."""
        rows = self.store._rows(  # noqa: SLF001 - deliberate use of the store's reader
            "SELECT MIN(ts) AS oldest FROM quota WHERE provider_id=? AND ts>=?",
            (provider_id, time.time() - window),
        )
        if not rows or rows[0]["oldest"] is None:
            return 0.0
        return max(0.0, (rows[0]["oldest"] + window) - time.time())

    def record(
        self, provider_id: str, model: str, *, tokens_in: int = 0, tokens_out: int = 0,
        ok: bool = True,
    ) -> None:
        self.store.record_usage(provider_id, model, "requests", 1, ok=ok)
        if tokens_in:
            self.store.record_usage(provider_id, model, "tokens_in", tokens_in, ok=ok)
        if tokens_out:
            self.store.record_usage(provider_id, model, "tokens_out", tokens_out, ok=ok)
        self._cache.pop(provider_id, None)
        self.publish(provider_id)

    def window(self, provider: ProviderConfig) -> UsageWindow:
        minute, day = self._window(provider.id)
        health = self.health(provider.id)
        return UsageWindow(
            rpm=provider.rpm, rpd=provider.rpd, tpm=provider.tpm, tpd=provider.tpd,
            requests_minute=minute.get("requests", 0),
            requests_day=day.get("requests", 0),
            tokens_minute=minute.get("tokens_in", 0) + minute.get("tokens_out", 0),
            tokens_day=day.get("tokens_in", 0) + day.get("tokens_out", 0),
            extra=self.snapshot_extra(provider, health),
        )

    @staticmethod
    def snapshot_extra(provider: ProviderConfig, health: ProviderHealth) -> dict[str, Any]:
        now = time.time()
        return {
            "label": provider.label,
            "tier": provider.tier,
            "model": provider.model,
            "enabled": provider.enabled,
            "cooling": health.cooling(now),
            "cooldown_seconds": max(0.0, health.cooldown_until - now),
            "failures": health.failures,
            "last_error": health.last_error,
            "rate_limit_strikes": health.consecutive_429,
        }

    def snapshot(self) -> list[dict[str, Any]]:
        return [self.window(provider).to_json() for provider in self.settings.providers]

    def publish(self, provider_id: str) -> None:
        provider = self.settings.provider(provider_id)
        if provider is None:
            return
        BUS.publish(EventType.QUOTA_UPDATE, self.window(provider).to_json(), agent_id=None)

    # -- estimation -----------------------------------------------------
    @staticmethod
    def estimate_tokens(text: str) -> int:
        """Cheap, provider-agnostic estimate (~4 chars/token) for reservations."""
        return max(1, math.ceil(len(text) / 4))


def pressure_label(value: float) -> str:
    if value >= 0.95:
        return "exhausted"
    if value >= 0.8:
        return "tight"
    if value >= 0.5:
        return "warm"
    return "open"
