"""SQLite persistence for the whole runtime.

One database file holds:

* ``agents``      - every agent that exists, its role, rank, mandate, model.
* ``messages``    - conversation turns, scoped per agent (agents never share a
                    raw transcript; they exchange distilled reports instead).
* ``memories``    - long-term memory with kinds:
                    ``identity`` (president memory: who this agent is),
                    ``episodic`` (what happened),
                    ``semantic`` (durable facts),
                    ``procedural`` (how to do a thing - the automation recipes
                    that let the agent skip vision/clicking next time).
* ``tasks``       - the work graph (head tasks fan out to employee tasks).
* ``quota``       - a token/request ledger per provider+model, the raw data the
                    Manager agent uses for scheduling and failover.
* ``traces``      - append-only event journal for replay and auditing.
* ``plugins``     - installed plugin manifests and their health.
* ``confirmations`` - pending user approvals for dangerous actions.

Retrieval is intentionally dependency-free: BM25-ish lexical scoring with
recency decay and importance weighting, so the product needs no vector database
and stays lightweight on a customer laptop. An embedding-backed scorer can be
dropped in behind :meth:`MemoryStore.recall`.
"""

from __future__ import annotations

import json
import math
import re
import sqlite3
import threading
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Sequence

SCHEMA_VERSION = 1

_WORD_RE = re.compile(r"[a-z0-9_]+")


def _now() -> float:
    return time.time()


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def tokenize(text: str) -> list[str]:
    return [w for w in _WORD_RE.findall(text.lower()) if len(w) > 2]


# ---------------------------------------------------------------------------
# Records
# ---------------------------------------------------------------------------
@dataclass
class AgentRecord:
    id: str
    name: str
    role: str                 # main | manager | head | employee | specialist
    rank: int = 0             # higher = more authority (main=100, manager=80...)
    parent_id: str | None = None
    team_id: str | None = None
    provider_id: str | None = None
    model: str | None = None
    status: str = "idle"      # idle | thinking | acting | waiting | blocked | retired
    mandate: str = ""
    permissions: dict[str, Any] = field(default_factory=dict)
    budget: dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=_now)
    updated_at: float = field(default_factory=_now)


@dataclass
class MemoryRecord:
    id: str
    agent_id: str | None
    kind: str
    content: str
    tags: list[str] = field(default_factory=list)
    importance: float = 0.5
    scope: str = "agent"      # agent | team | global
    source: str = ""
    created_at: float = field(default_factory=_now)
    last_access: float = field(default_factory=_now)
    access_count: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class TaskRecord:
    id: str
    title: str
    brief: str = ""
    agent_id: str | None = None
    parent_id: str | None = None
    team_id: str | None = None
    status: str = "pending"   # pending | running | blocked | done | failed | cancelled
    priority: int = 50
    result: str = ""
    created_at: float = field(default_factory=_now)
    updated_at: float = field(default_factory=_now)


@dataclass
class MessageRecord:
    id: str
    agent_id: str
    role: str                 # system | user | assistant | tool
    content: str
    tool_calls: list[dict[str, Any]] = field(default_factory=list)
    tool_call_id: str | None = None
    name: str | None = None
    created_at: float = field(default_factory=_now)
    tokens: int = 0


# ---------------------------------------------------------------------------
# Store
# ---------------------------------------------------------------------------
class MemoryStore:
    """Thread-safe SQLite wrapper. All public methods are safe to call from
    asyncio code directly: operations are short, local and WAL-journaled."""

    def __init__(self, path: Path | str) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._conn = sqlite3.connect(str(self.path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA synchronous=NORMAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        self._migrate()

    # -- schema ---------------------------------------------------------
    def _migrate(self) -> None:
        with self._lock, self._conn:
            self._conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS meta (
                    key TEXT PRIMARY KEY, value TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS agents (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL,
                    rank INTEGER DEFAULT 0, parent_id TEXT, team_id TEXT,
                    provider_id TEXT, model TEXT, status TEXT DEFAULT 'idle',
                    mandate TEXT DEFAULT '', permissions TEXT DEFAULT '{}',
                    budget TEXT DEFAULT '{}',
                    created_at REAL, updated_at REAL
                );
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, role TEXT NOT NULL,
                    content TEXT DEFAULT '', tool_calls TEXT DEFAULT '[]',
                    tool_call_id TEXT, name TEXT, created_at REAL, tokens INTEGER DEFAULT 0
                );
                CREATE INDEX IF NOT EXISTS idx_messages_agent
                    ON messages(agent_id, created_at);
                CREATE TABLE IF NOT EXISTS memories (
                    id TEXT PRIMARY KEY, agent_id TEXT, kind TEXT NOT NULL,
                    content TEXT NOT NULL, tags TEXT DEFAULT '[]',
                    importance REAL DEFAULT 0.5, scope TEXT DEFAULT 'agent',
                    source TEXT DEFAULT '', created_at REAL, last_access REAL,
                    access_count INTEGER DEFAULT 0, metadata TEXT DEFAULT '{}'
                );
                CREATE INDEX IF NOT EXISTS idx_memories_kind ON memories(kind, scope);
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY, title TEXT NOT NULL, brief TEXT DEFAULT '',
                    agent_id TEXT, parent_id TEXT, team_id TEXT,
                    status TEXT DEFAULT 'pending', priority INTEGER DEFAULT 50,
                    result TEXT DEFAULT '', created_at REAL, updated_at REAL
                );
                CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
                CREATE TABLE IF NOT EXISTS quota (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    provider_id TEXT NOT NULL, model TEXT NOT NULL,
                    kind TEXT NOT NULL, amount INTEGER NOT NULL,
                    ok INTEGER DEFAULT 1, ts REAL NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_quota_ts ON quota(provider_id, ts);
                CREATE TABLE IF NOT EXISTS traces (
                    seq INTEGER PRIMARY KEY AUTOINCREMENT,
                    ts REAL NOT NULL, type TEXT NOT NULL, agent_id TEXT,
                    task_id TEXT, payload TEXT DEFAULT '{}'
                );
                CREATE TABLE IF NOT EXISTS plugins (
                    id TEXT PRIMARY KEY, name TEXT NOT NULL, version TEXT DEFAULT '0.0.1',
                    path TEXT NOT NULL, manifest TEXT DEFAULT '{}',
                    status TEXT DEFAULT 'installed', error TEXT DEFAULT '',
                    installed_at REAL, updated_at REAL
                );
                CREATE TABLE IF NOT EXISTS confirmations (
                    id TEXT PRIMARY KEY, tool TEXT NOT NULL, args TEXT DEFAULT '{}',
                    agent_id TEXT, reason TEXT DEFAULT '', status TEXT DEFAULT 'pending',
                    created_at REAL, resolved_at REAL
                );
                """
            )
            row = self._conn.execute("SELECT value FROM meta WHERE key='schema'").fetchone()
            if row is None:
                self._conn.execute(
                    "INSERT INTO meta(key, value) VALUES('schema', ?)", (str(SCHEMA_VERSION),)
                )

    def close(self) -> None:
        with self._lock:
            self._conn.close()

    # -- agents ---------------------------------------------------------
    def upsert_agent(self, agent: AgentRecord) -> AgentRecord:
        agent.updated_at = _now()
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT INTO agents(id,name,role,rank,parent_id,team_id,provider_id,model,
                       status,mandate,permissions,budget,created_at,updated_at)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(id) DO UPDATE SET
                       name=excluded.name, role=excluded.role, rank=excluded.rank,
                       parent_id=excluded.parent_id, team_id=excluded.team_id,
                       provider_id=excluded.provider_id, model=excluded.model,
                       status=excluded.status, mandate=excluded.mandate,
                       permissions=excluded.permissions, budget=excluded.budget,
                       updated_at=excluded.updated_at""",
                (
                    agent.id, agent.name, agent.role, agent.rank, agent.parent_id,
                    agent.team_id, agent.provider_id, agent.model, agent.status,
                    agent.mandate, json.dumps(agent.permissions), json.dumps(agent.budget),
                    agent.created_at, agent.updated_at,
                ),
            )
        return agent

    def get_agent(self, agent_id: str) -> AgentRecord | None:
        row = self._row("SELECT * FROM agents WHERE id=?", (agent_id,))
        return self._agent(row) if row else None

    def list_agents(self, *, status: str | None = None, include_retired: bool = False) -> list[AgentRecord]:
        sql = "SELECT * FROM agents"
        clauses, params = [], []
        if status:
            clauses.append("status=?")
            params.append(status)
        if not include_retired:
            clauses.append("status != 'retired'")
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY rank DESC, created_at ASC"
        return [self._agent(r) for r in self._rows(sql, tuple(params))]

    def set_agent_status(self, agent_id: str, status: str, *, model: str | None = None) -> None:
        with self._lock, self._conn:
            if model:
                self._conn.execute(
                    "UPDATE agents SET status=?, model=?, updated_at=? WHERE id=?",
                    (status, model, _now(), agent_id),
                )
            else:
                self._conn.execute(
                    "UPDATE agents SET status=?, updated_at=? WHERE id=?",
                    (status, _now(), agent_id),
                )

    def delete_agent(self, agent_id: str) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM agents WHERE id=?", (agent_id,))
            self._conn.execute("DELETE FROM messages WHERE agent_id=?", (agent_id,))

    @staticmethod
    def _agent(row: sqlite3.Row) -> AgentRecord:
        return AgentRecord(
            id=row["id"], name=row["name"], role=row["role"], rank=row["rank"],
            parent_id=row["parent_id"], team_id=row["team_id"],
            provider_id=row["provider_id"], model=row["model"], status=row["status"],
            mandate=row["mandate"], permissions=json.loads(row["permissions"] or "{}"),
            budget=json.loads(row["budget"] or "{}"),
            created_at=row["created_at"], updated_at=row["updated_at"],
        )

    # -- messages -------------------------------------------------------
    def add_message(self, message: MessageRecord) -> MessageRecord:
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT OR REPLACE INTO messages
                   (id,agent_id,role,content,tool_calls,tool_call_id,name,created_at,tokens)
                   VALUES(?,?,?,?,?,?,?,?,?)""",
                (
                    message.id, message.agent_id, message.role, message.content,
                    json.dumps(message.tool_calls), message.tool_call_id, message.name,
                    message.created_at, message.tokens,
                ),
            )
        return message

    def history(self, agent_id: str, limit: int = 40) -> list[MessageRecord]:
        rows = self._rows(
            "SELECT * FROM messages WHERE agent_id=? ORDER BY created_at DESC LIMIT ?",
            (agent_id, limit),
        )
        return [self._message(r) for r in reversed(rows)]

    def trim_history(self, agent_id: str, keep: int = 200) -> int:
        with self._lock, self._conn:
            cur = self._conn.execute(
                """DELETE FROM messages WHERE agent_id=? AND id NOT IN (
                     SELECT id FROM messages WHERE agent_id=?
                     ORDER BY created_at DESC LIMIT ?)""",
                (agent_id, agent_id, keep),
            )
            return cur.rowcount

    def clear_history(self, agent_id: str) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM messages WHERE agent_id=?", (agent_id,))

    @staticmethod
    def _message(row: sqlite3.Row) -> MessageRecord:
        return MessageRecord(
            id=row["id"], agent_id=row["agent_id"], role=row["role"],
            content=row["content"], tool_calls=json.loads(row["tool_calls"] or "[]"),
            tool_call_id=row["tool_call_id"], name=row["name"],
            created_at=row["created_at"], tokens=row["tokens"],
        )

    # -- memories -------------------------------------------------------
    def remember(self, memory: MemoryRecord) -> MemoryRecord:
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT OR REPLACE INTO memories
                   (id,agent_id,kind,content,tags,importance,scope,source,created_at,
                    last_access,access_count,metadata)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    memory.id, memory.agent_id, memory.kind, memory.content,
                    json.dumps(memory.tags), memory.importance, memory.scope,
                    memory.source, memory.created_at, memory.last_access,
                    memory.access_count, json.dumps(memory.metadata),
                ),
            )
        return memory

    def recall(
        self,
        query: str,
        *,
        agent_id: str | None = None,
        kinds: Sequence[str] | None = None,
        scope: str | None = None,
        limit: int = 8,
        touch: bool = True,
    ) -> list[MemoryRecord]:
        """Lexical recall with recency decay and importance weighting."""
        sql = "SELECT * FROM memories WHERE 1=1"
        params: list[Any] = []
        if kinds:
            sql += f" AND kind IN ({','.join('?' * len(kinds))})"
            params.extend(kinds)
        if scope:
            sql += " AND scope=?"
            params.append(scope)
        if agent_id:
            # Agent-private memory plus anything explicitly shared.
            sql += " AND (agent_id=? OR scope IN ('team','global'))"
            params.append(agent_id)
        sql += " ORDER BY importance DESC, created_at DESC LIMIT 500"

        rows = self._rows(sql, tuple(params))
        query_tokens = set(tokenize(query))
        now = _now()
        scored: list[tuple[float, MemoryRecord]] = []
        for row in rows:
            memory = self._memory(row)
            overlap = self._score(query_tokens, memory, now)
            if overlap <= 0 and query_tokens:
                continue
            scored.append((overlap, memory))
        scored.sort(key=lambda pair: pair[0], reverse=True)
        results = [memory for _, memory in scored[:limit]]
        if touch and results:
            self.touch_memories([memory.id for memory in results])
            # Keep the returned objects consistent with the ledger we just wrote.
            for memory in results:
                memory.access_count += 1
                memory.last_access = now
        return results

    @staticmethod
    def _score(query_tokens: set[str], memory: MemoryRecord, now: float) -> float:
        doc_tokens = tokenize(memory.content) + [t.lower() for t in memory.tags]
        if not doc_tokens:
            return 0.0
        doc_set = set(doc_tokens)
        if query_tokens:
            exact = query_tokens & doc_set
            # Morphology matters: "invoice" must find "invoices", "unzip" must
            # find "unzipping". Prefix/substring matches count at reduced weight.
            text = memory.content.lower()
            partial = {
                token for token in query_tokens - exact
                if token in text or any(doc.startswith(token) for doc in doc_set)
            }
            hits = len(exact) + 0.6 * len(partial)
            if hits == 0:
                return 0.0
            idf = sum(math.log(1 + 1.0 / (1 + doc_tokens.count(token))) for token in exact)
            if not exact:
                idf = 0.35 * len(partial)
            lexical = hits * (1.0 + idf)
        else:
            lexical = 1.0
        age_days = max(0.0, (now - memory.created_at) / 86400.0)
        recency = math.exp(-age_days / 30.0)
        usage = min(1.0, memory.access_count / 20.0)
        return lexical * (0.6 + 0.5 * memory.importance) * (0.55 + 0.45 * recency) + 0.1 * usage

    def touch_memories(self, ids: Iterable[str]) -> None:
        ids = list(ids)
        if not ids:
            return
        with self._lock, self._conn:
            self._conn.executemany(
                "UPDATE memories SET last_access=?, access_count=access_count+1 WHERE id=?",
                [(_now(), memory_id) for memory_id in ids],
            )

    def forget(self, memory_id: str) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM memories WHERE id=?", (memory_id,))

    def list_memories(
        self, *, agent_id: str | None = None, kind: str | None = None, limit: int = 100
    ) -> list[MemoryRecord]:
        sql, params = "SELECT * FROM memories WHERE 1=1", []
        if agent_id:
            sql += " AND agent_id=?"
            params.append(agent_id)
        if kind:
            sql += " AND kind=?"
            params.append(kind)
        sql += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        return [self._memory(r) for r in self._rows(sql, tuple(params))]

    def count_memories(self) -> int:
        row = self._row("SELECT COUNT(*) AS n FROM memories", ())
        return int(row["n"]) if row else 0

    @staticmethod
    def _memory(row: sqlite3.Row) -> MemoryRecord:
        return MemoryRecord(
            id=row["id"], agent_id=row["agent_id"], kind=row["kind"],
            content=row["content"], tags=json.loads(row["tags"] or "[]"),
            importance=row["importance"], scope=row["scope"], source=row["source"],
            created_at=row["created_at"], last_access=row["last_access"],
            access_count=row["access_count"], metadata=json.loads(row["metadata"] or "{}"),
        )

    # -- tasks ----------------------------------------------------------
    def create_task(self, task: TaskRecord) -> TaskRecord:
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT INTO tasks(id,title,brief,agent_id,parent_id,team_id,status,
                       priority,result,created_at,updated_at)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    task.id, task.title, task.brief, task.agent_id, task.parent_id,
                    task.team_id, task.status, task.priority, task.result,
                    task.created_at, task.updated_at,
                ),
            )
        return task

    def update_task(
        self, task_id: str, *, status: str | None = None, result: str | None = None,
        agent_id: str | None = None, priority: int | None = None,
    ) -> None:
        sets, params = ["updated_at=?"], [_now()]
        if status:
            sets.append("status=?")
            params.append(status)
        if result is not None:
            sets.append("result=?")
            params.append(result)
        if agent_id:
            sets.append("agent_id=?")
            params.append(agent_id)
        if priority is not None:
            sets.append("priority=?")
            params.append(priority)
        params.append(task_id)
        with self._lock, self._conn:
            self._conn.execute(f"UPDATE tasks SET {', '.join(sets)} WHERE id=?", tuple(params))

    def get_task(self, task_id: str) -> TaskRecord | None:
        row = self._row("SELECT * FROM tasks WHERE id=?", (task_id,))
        return self._task(row) if row else None

    def list_tasks(
        self, *, status: str | None = None, agent_id: str | None = None, limit: int = 200
    ) -> list[TaskRecord]:
        sql, params = "SELECT * FROM tasks WHERE 1=1", []
        if status:
            sql += " AND status=?"
            params.append(status)
        if agent_id:
            sql += " AND agent_id=?"
            params.append(agent_id)
        sql += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        return [self._task(r) for r in self._rows(sql, tuple(params))]

    def children_of(self, task_id: str) -> list[TaskRecord]:
        return [self._task(r) for r in self._rows("SELECT * FROM tasks WHERE parent_id=?", (task_id,))]

    @staticmethod
    def _task(row: sqlite3.Row) -> TaskRecord:
        return TaskRecord(
            id=row["id"], title=row["title"], brief=row["brief"], agent_id=row["agent_id"],
            parent_id=row["parent_id"], team_id=row["team_id"], status=row["status"],
            priority=row["priority"], result=row["result"],
            created_at=row["created_at"], updated_at=row["updated_at"],
        )

    # -- quota ledger ---------------------------------------------------
    def record_usage(
        self, provider_id: str, model: str, kind: str, amount: int, *, ok: bool = True
    ) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                "INSERT INTO quota(provider_id,model,kind,amount,ok,ts) VALUES(?,?,?,?,?,?)",
                (provider_id, model, kind, amount, 1 if ok else 0, _now()),
            )

    def usage_since(self, provider_id: str, since: float) -> dict[str, int]:
        rows = self._rows(
            """SELECT kind, SUM(amount) AS total, COUNT(*) AS calls FROM quota
               WHERE provider_id=? AND ts>=? GROUP BY kind""",
            (provider_id, since),
        )
        out = {"requests": 0, "tokens_in": 0, "tokens_out": 0, "errors": 0}
        for row in rows:
            key = row["kind"]
            if key in out:
                out[key] += int(row["total"] or 0)
        return out

    def prune_quota(self, older_than: float) -> int:
        with self._lock, self._conn:
            cur = self._conn.execute("DELETE FROM quota WHERE ts<?", (older_than,))
            return cur.rowcount

    # -- traces ---------------------------------------------------------
    def trace(self, type_: str, payload: dict[str, Any], agent_id: str | None = None,
              task_id: str | None = None) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                "INSERT INTO traces(ts,type,agent_id,task_id,payload) VALUES(?,?,?,?,?)",
                (_now(), type_, agent_id, task_id, json.dumps(payload)[:8000]),
            )

    def recent_traces(self, limit: int = 200) -> list[dict[str, Any]]:
        rows = self._rows("SELECT * FROM traces ORDER BY seq DESC LIMIT ?", (limit,))
        return [
            {
                "seq": r["seq"], "ts": r["ts"], "type": r["type"], "agent_id": r["agent_id"],
                "task_id": r["task_id"], "payload": json.loads(r["payload"] or "{}"),
            }
            for r in rows
        ]

    def prune_traces(self, keep: int = 20000) -> int:
        with self._lock, self._conn:
            cur = self._conn.execute(
                "DELETE FROM traces WHERE seq < (SELECT MAX(seq)-? FROM traces)", (keep,)
            )
            return cur.rowcount

    # -- plugins --------------------------------------------------------
    def upsert_plugin(self, plugin_id: str, name: str, version: str, path: str,
                      manifest: dict[str, Any], status: str = "installed", error: str = "") -> None:
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT INTO plugins(id,name,version,path,manifest,status,error,
                       installed_at,updated_at)
                   VALUES(?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(id) DO UPDATE SET
                       name=excluded.name, version=excluded.version, path=excluded.path,
                       manifest=excluded.manifest, status=excluded.status,
                       error=excluded.error, updated_at=excluded.updated_at""",
                (plugin_id, name, version, path, json.dumps(manifest), status, error, _now(), _now()),
            )

    def remove_plugin(self, plugin_id: str) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM plugins WHERE id=?", (plugin_id,))

    def list_plugins(self) -> list[dict[str, Any]]:
        return [
            {
                "id": r["id"], "name": r["name"], "version": r["version"], "path": r["path"],
                "manifest": json.loads(r["manifest"] or "{}"), "status": r["status"],
                "error": r["error"], "installed_at": r["installed_at"], "updated_at": r["updated_at"],
            }
            for r in self._rows("SELECT * FROM plugins ORDER BY name", ())
        ]

    # -- confirmations --------------------------------------------------
    def add_confirmation(self, cid: str, tool: str, args: dict[str, Any],
                         agent_id: str | None, reason: str) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                """INSERT INTO confirmations(id,tool,args,agent_id,reason,status,created_at)
                   VALUES(?,?,?,?,?, 'pending', ?)""",
                (cid, tool, json.dumps(args), agent_id, reason, _now()),
            )

    def resolve_confirmation(self, cid: str, status: str) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                "UPDATE confirmations SET status=?, resolved_at=? WHERE id=?",
                (status, _now(), cid),
            )

    def get_confirmation(self, cid: str) -> dict[str, Any] | None:
        row = self._row("SELECT * FROM confirmations WHERE id=?", (cid,))
        if not row:
            return None
        return {
            "id": row["id"], "tool": row["tool"], "args": json.loads(row["args"] or "{}"),
            "agent_id": row["agent_id"], "reason": row["reason"], "status": row["status"],
            "created_at": row["created_at"], "resolved_at": row["resolved_at"],
        }

    def pending_confirmations(self) -> list[dict[str, Any]]:
        return [
            {
                "id": r["id"], "tool": r["tool"], "args": json.loads(r["args"] or "{}"),
                "agent_id": r["agent_id"], "reason": r["reason"], "status": r["status"],
                "created_at": r["created_at"],
            }
            for r in self._rows("SELECT * FROM confirmations WHERE status='pending' ORDER BY created_at", ())
        ]

    # -- helpers --------------------------------------------------------
    def _row(self, sql: str, params: tuple[Any, ...]) -> sqlite3.Row | None:
        with self._lock:
            return self._conn.execute(sql, params).fetchone()

    def _rows(self, sql: str, params: tuple[Any, ...]) -> list[sqlite3.Row]:
        with self._lock:
            return self._conn.execute(sql, params).fetchall()

    def stats(self) -> dict[str, int]:
        tables = ("agents", "messages", "memories", "tasks", "plugins", "traces")
        out: dict[str, int] = {}
        for table in tables:
            row = self._row(f"SELECT COUNT(*) AS n FROM {table}", ())
            out[table] = int(row["n"]) if row else 0
        return out
