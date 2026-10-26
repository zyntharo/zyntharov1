"""Memory store, retrieval scoring, and the quota ledger."""

from __future__ import annotations

import time

from vyralis.config import ProviderConfig
from vyralis.llm.quota import QuotaLedger
from vyralis.memory.store import MemoryRecord, MemoryStore, new_id, tokenize


def test_store_roundtrip_and_stats(tmp_path):
    store = MemoryStore(tmp_path / "m.sqlite3")
    store.remember(MemoryRecord(id=new_id("mem"), agent_id="main", kind="semantic",
                                content="The user keeps invoices in D:/Finance/2026"))
    store.remember(MemoryRecord(id=new_id("mem"), agent_id="main", kind="semantic",
                                content="The user prefers Chrome as the default browser"))
    stats = store.stats()
    assert stats["memories"] == 2
    store.close()


def test_recall_ranks_relevant_memory_first(tmp_path):
    store = MemoryStore(tmp_path / "m.sqlite3")
    for content in (
        "Invoices live in D:/Finance/2026 and are named INV-<number>.pdf",
        "The user prefers dark mode in every application",
        "The monthly report must be exported as XLSX, not CSV",
    ):
        store.remember(MemoryRecord(id=new_id("mem"), agent_id="main", kind="semantic",
                                    content=content))
    hits = store.recall("where are the invoice files", agent_id="main", limit=2)
    assert hits, "recall returned nothing"
    assert "Finance" in hits[0].content
    assert hits[0].access_count == 1, "recall should record that memory was used"
    store.close()


def test_agent_private_memory_is_not_visible_to_others(tmp_path):
    store = MemoryStore(tmp_path / "m.sqlite3")
    store.remember(MemoryRecord(id=new_id("mem"), agent_id="agent_a", kind="semantic",
                                content="secret scratch note about zebras", scope="agent"))
    assert store.recall("zebras", agent_id="agent_b") == []
    assert store.recall("zebras", agent_id="agent_a")
    store.close()


def test_task_graph_and_parent_links(tmp_path):
    from vyralis.memory.store import TaskRecord

    store = MemoryStore(tmp_path / "m.sqlite3")
    parent = TaskRecord(id=new_id("task"), title="Export report")
    store.create_task(parent)
    child = TaskRecord(id=new_id("task"), title="Open Excel", parent_id=parent.id, agent_id="a1")
    store.create_task(child)
    assert [task.id for task in store.children_of(parent.id)] == [child.id]
    store.update_task(child.id, status="done", result="opened")
    assert store.get_task(child.id).status == "done"
    store.close()


def test_quota_ledger_blocks_at_the_configured_limit(tmp_path):
    store = MemoryStore(tmp_path / "m.sqlite3")
    provider = ProviderConfig(id="p", label="P", base_url="https://x.invalid/v1", api_key="k",
                              model="m", rpm=2, rpd=10)
    from vyralis.config import Settings

    settings = Settings(providers=[provider])
    ledger = QuotaLedger(store, settings)

    assert ledger.check(provider).allowed
    ledger.record("p", "m", tokens_in=100, tokens_out=50)
    assert ledger.check(provider).allowed
    ledger.record("p", "m", tokens_in=100, tokens_out=50)
    decision = ledger.check(provider)
    assert not decision.allowed, "third request should exceed rpm=2"
    assert "rpm" in decision.reason.lower()

    window = ledger.window(provider)
    assert window.requests_minute == 2
    assert window.tokens_minute == 300
    store.close()


def test_quota_cooldown_after_rate_limit_then_recovers(tmp_path):
    store = MemoryStore(tmp_path / "m.sqlite3")
    provider = ProviderConfig(id="p", label="P", base_url="https://x.invalid/v1", api_key="k",
                              model="m")
    from vyralis.config import Settings

    ledger = QuotaLedger(store, Settings(providers=[provider]))
    ledger.mark_failure("p", "429 too many requests", rate_limited=True)
    blocked = ledger.check(provider)
    assert not blocked.allowed and blocked.wait_seconds > 0

    # A successful call clears the cooldown.
    ledger.mark_ok("p")
    assert ledger.check(provider).allowed
    assert ledger.health("p").consecutive_429 == 0
    store.close()


def test_tokenizer_drops_two_letter_noise_words():
    tokens = tokenize("The cat sat on the mat to it")
    assert "cat" in tokens and "mat" in tokens
    assert "on" not in tokens and "to" not in tokens and "it" not in tokens
    assert time.time() > 0
