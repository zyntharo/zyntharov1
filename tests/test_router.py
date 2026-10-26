"""Model routing: capability matching, tier ceilings, pressure and failover."""

from __future__ import annotations

from vyralis.config import ProviderConfig, Settings
from vyralis.llm.quota import QuotaLedger
from vyralis.llm.router import ModelRouter, Requirements, tiers_up_to
from vyralis.memory.store import MemoryStore


def build(tmp_path, providers):
    store = MemoryStore(tmp_path / "m.sqlite3")
    settings = Settings(providers=providers)
    ledger = QuotaLedger(store, settings)
    return store, settings, ledger, ModelRouter(settings, ledger)


def provider(pid, tier, **kwargs):
    base = dict(id=pid, label=pid, base_url="https://x.invalid/v1", api_key="k",
                model=f"{pid}-model", tier=tier, supports_tools=True)
    base.update(kwargs)
    return ProviderConfig(**base)


def test_tier_ordering():
    assert tiers_up_to("frontier") == {"local", "economy", "standard", "frontier"}
    assert tiers_up_to("standard") == {"local", "economy", "standard"}
    assert tiers_up_to("local") == {"local"}


def test_role_ceiling_prevents_cheap_agent_using_frontier(tmp_path):
    _, _, _, router = build(tmp_path, [provider("big", "frontier"), provider("small", "economy")])
    employee = Requirements.for_role("employee")
    assert employee.max_tier == "standard"
    routes = router.available(employee)
    assert {route.provider.id for route in routes} == {"small"}

    main = Requirements.for_role("main")
    assert {route.provider.id for route in router.available(main)} == {"big", "small"}


def test_capability_filtering(tmp_path):
    _, _, _, router = build(tmp_path, [
        provider("no_vision", "frontier", supports_vision=False),
        provider("vision", "standard", supports_vision=True),
    ])
    routes = router.available(Requirements(needs_vision=True, max_tier="frontier"))
    assert [route.provider.id for route in routes] == ["vision"]


def test_disabled_or_keyless_providers_are_excluded(tmp_path):
    _, _, _, router = build(tmp_path, [
        provider("off", "frontier", enabled=False),
        provider("nokey", "frontier", api_key=""),
        provider("ok", "standard"),
    ])
    assert [route.provider.id for route in router.available(Requirements())] == ["ok"]


def test_quota_pressure_demotes_a_provider(tmp_path):
    store, _, ledger, router = build(tmp_path, [
        provider("hot", "frontier", rpm=10, priority=10),
        provider("cool", "standard", rpm=100, priority=20),
    ])
    for _ in range(9):
        ledger.record("hot", "hot-model")
    route = router.select(Requirements(max_tier="frontier", quality_first=False))
    assert route is not None
    assert route.provider.id == "cool", "the nearly-exhausted provider should not be chosen"


def test_exhausted_provider_is_skipped_entirely(tmp_path):
    store, _, ledger, router = build(tmp_path, [provider("only", "frontier", rpm=1)])
    ledger.record("only", "only-model")
    assert router.select(Requirements()) is None


def test_failover_moves_to_a_different_provider(tmp_path):
    _, _, _, router = build(tmp_path, [
        provider("dead", "frontier", priority=1),
        provider("backup", "standard", priority=50),
    ])
    primary = router.select(Requirements(max_tier="frontier"))
    assert primary.provider.id == "dead"
    fallback = router.failover(primary, Requirements(max_tier="frontier"), reason="rate limited")
    assert fallback is not None
    assert fallback.provider.id == "backup"


def test_pinned_provider_is_respected(tmp_path):
    _, _, _, router = build(tmp_path, [provider("a", "frontier"), provider("b", "standard")])
    route = router.select(Requirements(pinned_provider="b", max_tier="frontier"))
    assert route.provider.id == "b"


def test_headroom_reports_cooling_providers(tmp_path):
    _, _, ledger, router = build(tmp_path, [provider("a", "frontier")])
    ledger.mark_failure("a", "boom", rate_limited=True)
    headroom = router.headroom()
    assert headroom["open_routes"] == 0
    assert headroom["cooling"][0]["provider_id"] == "a"
