"""Model routing, capability matching and failover.

This is the piece the user described as "manager decides which model, and if a
provider dies, continue the work on another provider with the same context and
memory". It is implemented as:

* :class:`Requirements` - what the caller needs (tools, vision, audio, tier
  ceiling, explicit provider pin, exclusions).
* :class:`ModelRouter.select` - pick the best *available* route right now,
  honouring quota pressure, cooldowns, agent permission tier and priority.
* :class:`ModelRouter.failover` - the ordered fallback chain for a route, so a
  :class:`RateLimited` error becomes a transparent model swap instead of a
  failed task.

Nothing here calls the network, which makes the whole policy unit-testable.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Any, Iterable, Sequence

from ..bus import BUS, EventType
from ..config import ProviderConfig, Settings
from .quota import QuotaLedger

log = logging.getLogger("vyralis.llm.router")

TIER_WEIGHT = {"frontier": 40, "standard": 25, "economy": 10, "local": 5}
# Which tiers a role may *not* exceed. The main agent may use anything; cheap
# workers are kept off the expensive frontier model unless explicitly allowed.
ROLE_TIER_CEILING = {
    "main": "frontier",
    "manager": "standard",
    "head": "standard",
    "employee": "standard",
    "specialist": "economy",
}
TIER_ORDER = ["local", "economy", "standard", "frontier"]


def tiers_up_to(ceiling: str) -> set[str]:
    if ceiling not in TIER_ORDER:
        return set(TIER_ORDER)
    return set(TIER_ORDER[: TIER_ORDER.index(ceiling) + 1])


@dataclass
class Requirements:
    """What a caller needs from a model for this particular step."""

    needs_tools: bool = True
    needs_vision: bool = False
    needs_audio: bool = False
    min_tier: str = "local"
    max_tier: str = "frontier"          # hard ceiling (from role permissions)
    pinned_provider: str | None = None
    pinned_model: str | None = None
    exclude_providers: set[str] = field(default_factory=set)
    prefer_provider: str | None = None
    estimated_tokens: int = 0
    # Prefer quality (long planning) or cost/availability (bulk work).
    quality_first: bool = True

    @classmethod
    def for_role(cls, role: str, **kwargs: Any) -> "Requirements":
        ceiling = ROLE_TIER_CEILING.get(role, "standard")
        kwargs.setdefault("max_tier", ceiling)
        return cls(**kwargs)


@dataclass
class Route:
    provider: ProviderConfig
    model: str
    score: float = 0.0
    reason: str = ""

    def to_json(self) -> dict[str, Any]:
        return {
            "provider_id": self.provider.id,
            "provider_label": self.provider.label,
            "model": self.model,
            "tier": self.provider.tier,
            "score": round(self.score, 3),
            "reason": self.reason,
        }


class ModelRouter:
    """Stateless policy over the provider registry + quota ledger."""

    def __init__(self, settings: Settings, ledger: QuotaLedger) -> None:
        self.settings = settings
        self.ledger = ledger

    # -- capability filtering -------------------------------------------
    def _fits(self, provider: ProviderConfig, requirements: Requirements) -> bool:
        if not provider.enabled or not provider.base_url or not provider.resolved_key():
            return False
        if provider.id in requirements.exclude_providers:
            return False
        if requirements.pinned_provider and provider.id != requirements.pinned_provider:
            return False
        if requirements.needs_tools and not provider.supports_tools:
            return False
        if requirements.needs_vision and not provider.supports_vision:
            return False
        if requirements.needs_audio and not provider.supports_audio:
            return False
        allowed = tiers_up_to(requirements.max_tier)
        if provider.tier not in allowed:
            return False
        if TIER_ORDER.index(provider.tier) < TIER_ORDER.index(requirements.min_tier):
            return False
        return True

    def _score(self, provider: ProviderConfig, requirements: Requirements, pressure: float) -> float:
        score = float(TIER_WEIGHT.get(provider.tier, 10))
        if requirements.quality_first:
            score += TIER_WEIGHT.get(provider.tier, 10) * 0.5
        else:
            score += (100 - provider.priority) * 0.15
        score += (100 - min(provider.priority, 100)) * 0.2
        if requirements.prefer_provider == provider.id:
            score += 15.0
        # Headroom matters: a nearly exhausted provider is a bad pick even if fast,
        # and one at its limit should lose to a slower provider with capacity.
        score -= (pressure ** 2) * 45.0
        health = self.ledger.health(provider.id)
        if health.cooling():
            score -= 60.0
        if health.consecutive_429:
            score -= 8.0 * health.consecutive_429
        if provider.tier == "local":
            score += 4.0  # keep on-device work on-device when it fits
        return score

    # -- selection ------------------------------------------------------
    def available(self, requirements: Requirements | None = None) -> list[Route]:
        """Every currently usable route, best first. Used by the GUI model picker."""
        requirements = requirements or Requirements()
        routes: list[Route] = []
        for provider in self.settings.providers:
            if not self._fits(provider, requirements):
                continue
            decision = self.ledger.check(provider, estimated_tokens=requirements.estimated_tokens)
            if not decision.allowed:
                continue
            model = requirements.pinned_model or provider.model
            if not model:
                continue
            routes.append(
                Route(
                    provider=provider,
                    model=model,
                    score=self._score(provider, requirements, decision.pressure),
                    reason=f"pressure={decision.pressure:.2f}",
                )
            )
        routes.sort(key=lambda route: route.score, reverse=True)
        return routes

    def select(self, requirements: Requirements, *, agent_id: str | None = None) -> Route | None:
        routes = self.available(requirements)
        if not routes:
            self._report_exhaustion(requirements, agent_id)
            return None
        route = routes[0]
        BUS.publish(
            EventType.MODEL_SELECTED,
            route.to_json() | {"role_hint": requirements.max_tier},
            agent_id=agent_id,
        )
        return route

    def failover(
        self,
        failed: Route,
        requirements: Requirements,
        *,
        agent_id: str | None = None,
        reason: str = "",
    ) -> Route | None:
        """Next best route after ``failed`` blew up. Same requirements, one less
        provider; the caller keeps its messages and memory untouched."""
        requirements = Requirements(**{**requirements.__dict__})
        requirements.exclude_providers = set(requirements.exclude_providers) | {failed.provider.id}
        route = self.select(requirements, agent_id=agent_id)
        if route is not None:
            BUS.publish(
                EventType.PROVIDER_FAILOVER,
                {
                    "from": failed.to_json(),
                    "to": route.to_json(),
                    "reason": reason[:300],
                },
                agent_id=agent_id,
            )
            log.warning(
                "failover %s/%s -> %s/%s (%s)",
                failed.provider.id, failed.model, route.provider.id, route.model, reason[:80],
            )
        return route

    def swap_provider(
        self, route: Route, provider_id: str, *, model: str | None = None
    ) -> Route | None:
        """Explicit model/provider change (the Manager or the user asks for it)."""
        provider = self.settings.provider(provider_id)
        if provider is None or not provider.resolved_key():
            return None
        return Route(provider=provider, model=model or provider.model, reason="manual swap")

    def _report_exhaustion(self, requirements: Requirements, agent_id: str | None) -> None:
        BUS.publish(
            EventType.QUOTA_EVENT,
            {
                "kind": "no_route",
                "detail": "No provider satisfies the current requirements.",
                "needs_tools": requirements.needs_tools,
                "needs_vision": requirements.needs_vision,
                "needs_audio": requirements.needs_audio,
                "max_tier": requirements.max_tier,
                "excluded": sorted(requirements.exclude_providers),
            },
            agent_id=agent_id,
        )

    # -- reporting ------------------------------------------------------
    def headroom(self) -> dict[str, Any]:
        """Aggregate health used by the Manager agent and the HUD."""
        per_tier: dict[str, int] = {}
        open_routes = 0
        cooling = []
        for provider in self.settings.providers:
            if not provider.enabled:
                continue
            decision = self.ledger.check(provider)
            health = self.ledger.health(provider.id)
            if health.cooling():
                cooling.append(
                    {"provider_id": provider.id, "seconds": round(health.cooldown_until - time.time(), 1)}
                )
            elif decision.allowed:
                open_routes += 1
                per_tier[provider.tier] = per_tier.get(provider.tier, 0) + 1
        return {
            "open_routes": open_routes,
            "by_tier": per_tier,
            "cooling": cooling,
            "providers": len([p for p in self.settings.providers if p.enabled]),
            "configured": len(self.settings.providers),
        }

    def describe(self) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for provider in self.settings.providers:
            decision = self.ledger.check(provider)
            window = self.ledger.window(provider)
            rows.append(
                {
                    **window.to_json(),
                    "id": provider.id,
                    "base_url": provider.base_url,
                    "has_key": bool(provider.resolved_key()),
                    "allowed": decision.allowed,
                    "blocked_reason": decision.reason,
                    "supports_tools": provider.supports_tools,
                    "supports_vision": provider.supports_vision,
                    "supports_audio": provider.supports_audio,
                    "audio_model": provider.audio_model,
                    "env_key": provider.api_key_env,
                }
            )
        return rows


def summarise_routes(routes: Iterable[Route]) -> str:
    return ", ".join(f"{route.provider.id}:{route.model}" for route in routes) or "none"


def requirement_fields() -> Sequence[str]:
    return tuple(Requirements.__dataclass_fields__.keys())
