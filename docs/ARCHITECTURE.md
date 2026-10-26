# Architecture

How Vyralis is put together, and why each decision was made the way it was.

---

## 1. Process model

One Python process. One interface, served from disk. No Electron, no Node runtime
at run time, no message broker, no external database.

```
┌──────────────────────────────────────────────────────────────────┐
│ vyralis run                                                      │
│                                                                  │
│  uvicorn ── FastAPI ──┬── /api/*    REST                        │
│                       ├── /ws        live event stream           │
│                       └── /          interface (vyralis/gui)     │
│                                                                  │
│  Runtime ─┬─ MemoryStore (SQLite, WAL)                           │
│           ├─ QuotaLedger → ModelRouter → ProviderClient (httpx)  │
│           ├─ ToolRegistry + Services (the capability layer)      │
│           ├─ Orchestrator (main agent, subagents, teams, tasks)  │
│           ├─ ManagerAgent (Overwatch: providers, workers, quota) │
│           ├─ PluginManager, SkillLibrary, VoiceService           │
│           └─ HardwareMonitor (background watchdog task)          │
└──────────────────────────────────────────────────────────────────┘
```

The interface is opened in the OS webview (pywebview) when available, otherwise
in the default browser. That choice is what keeps the install small: no second
Chromium is shipped, because the user already has one — and Vyralis needs to
drive *that* one anyway for their logins and extensions to be available.

## 2. The event bus

`vyralis/bus.py` is a single in-process fan-out with a bounded replay buffer.

- The interface subscribes through `/ws` and folds every event into one store
  (`ui/src/lib/store.ts`), so the particle core, the wiring graph and the panels
  are always reading the same state.
- The Manager registers a synchronous listener, which is how the watchdog sees
  failures without polling.
- The trace journal in SQLite gets the same events, so a run can be replayed.

The vocabulary is a closed enum (`EventType`). The important ones:

| Event | Meaning | What reacts to it |
|---|---|---|
| `agent.spawned` / `agent.state` / `agent.retired` | roster changes | agent rail, wiring ring, core attention |
| `agent.thought` / `agent.token` | reasoning, streamed | transcript, core swirl |
| `tool.call` / `tool.result` / `tool.denied` | a capability ran, or was refused | wiring packets, panels, transcript |
| `permission.request` / `permission.result` | a human is needed | modal, phase → `alert` |
| `model.selected` / `provider.failover` / `quota.update` | pool decisions | quota rows, wiring, transcript |
| `memory.write` | long-term memory changed | memory filament across the core |
| `hardware.sample` / `hardware.alert` | machine health | gauges, toasts, spoken warning |
| `voice.speak.start/end`, `voice.listen.*` | speech | core envelope, orb state |

## 3. The tool layer

Tools are the only way an agent touches the world. Each one carries a JSON
schema, a permission class (`safe` / `sensitive` / `destructive`) and a handler.
`ToolRegistry.execute` owns the whole pipeline:

```
unknown tool?           → structured error, never an exception
grant check             → refused with an actionable message
policy check            → allow / ask / deny
confirmation            → blocks on the user; no human means "no"
run                     → blocking handlers go to a worker thread
timeout                 → bounded (per tool)
exception               → converted into a readable tool error
events + trace          → published for the HUD and the journal
```

Tool contexts are created per agent per task and carry the grant, the denial
list, the policy, the confirmation callback and the service container. A tool
therefore cannot see anything the runtime did not give it.

Capability families (132 tools registered at boot):

| Category | Tools | Notes |
|---|---|---|
| `vision` | 7 | `look` returns the annotated map **and** a text map |
| `computer` | 13 | pointer, keyboard, windows, clipboard, app launch |
| `browser` | 18 | sessions, tabs, DOM actions, extraction, browser UI |
| `files` | 21 | read ranges, edits, search, archives, structured data |
| `shell` | 5 | screened commands, spawn, which, environment, kill |
| `office` | 18 | Word, Excel (+charts, CSV conversion), PowerPoint, PDF, Access |
| `hardware` | 6 | report, sensors, health, alerts, trend, configure |
| `whatsapp` | 8 | pairing, chats, read, send, media, voice notes, calls |
| `agents` | 15 | spawn, assign, inspect, teams, reassign, quota, providers |
| `memory` | 4 | remember, recall, list, forget |
| `skills` | 7 | record, stop, status, list, find, run, forget |
| `plugins` | 8 | list, guidelines, scaffold, generate, validate, install, reload, uninstall |
| `system` | 3 | status, notify, permissions |

## 4. The agent loop

One implementation, every role (`vyralis/agents/agent.py`). A role changes the
prompt, the grant, the model ceiling and the step budget — never the mechanics,
so a subagent is exactly as capable as the main agent within its grant.

```
build system prompt      role contract + environment facts + grant + budget
                        + recalled memories + fitting skills + caller directive
recall memory           store.recall(query, agent_id)
select route            router.select(Requirements(...))  ← capability, tier, quota
call the model          streaming, with failover on any provider failure
if tool calls           execute (independent calls concurrently), feed results back
if no tool calls        this message is the report → distil into memory
repeat                  until the report or the step budget
```

Details that matter:

- **Tier ceilings are cost policy, not walls.** If nothing inside the ceiling can
  serve the request, the agent relaxes to any available model and says so, rather
  than failing a task because the cheap model is out of quota.
- **Failover preserves context.** A `RateLimited` or dead provider swaps the route
  and continues with the same message list and the same memory; the agent records
  the switch in its own memory so it can explain what happened.
- **Permissions are re-checked per call**, not per task, so a grant revoked
  mid-task takes effect immediately.
- **The step budget terminates loops.** Exhausting it produces a partial report
  with the action trail, never a hang.

## 5. Roles and authority

| Role | Title | Rank | Model ceiling | May spawn |
|---|---|---|---|---|
| `main` | VYRA | 100 | frontier | yes |
| `manager` | Overwatch | 80 | standard | no (supervises) |
| `head` | Squad lead | 60 | standard | yes |
| `employee` | Operator | 40 | standard | no |
| `specialist` | Analyst | 30 | economy | no |

Authority is structural: a spawned agent's rank is always below its parent's, its
tier ceiling can never be raised above the parent's, and its grant is a subset of
what the parent chose to hand out. An employee that needs something it was not
given must ask for it in its report.

## 6. Memory

Four kinds, all in one SQLite table:

- `identity` — who this agent is (its "president" memory): name, rank, mandate.
- `episodic` — what happened, including task outcomes and model switches.
- `semantic` — durable facts: preferences, layouts, credential locations.
- `procedural` — skills, with the executable step list in `metadata.skill`.

Scoping is explicit: `agent` (private), `team`, `global`. Retrieval is lexical
token overlap **plus** prefix/substring matching (so "invoice" finds "invoices"),
weighted by IDF, memory importance and a 30-day recency decay, and usage count.
Every recall bumps `access_count`, so frequently useful memories rise.

This is deliberately not a vector database: it is fast, has no dependencies, and
sits behind one method (`MemoryStore.recall`) that an embedding scorer can
replace without touching anything else.

## 7. Quota, routing and Overwatch

```
ProviderConfig: base_url, key, model, tier, rpm/rpd/tpm/tpd, capabilities
        │
        ├─ QuotaLedger ── rolling minute/day windows from the SQLite ledger
        │                 + cooldown after a real 429 (exponential, capped)
        │
        └─ ModelRouter ── filter (enabled, key, capability, tier)
                          score (tier weight, priority, headroom², health)
                          select / failover / manual swap
```

`ManagerAgent` (Overwatch) runs a cheap deterministic cycle every 20 seconds —
no model call, because paying for a round-trip every 20 seconds would burn the
user's quota for nothing. It detects and *fixes*:

- a provider cooling down → move every agent pinned to it to the best alternative,
- a provider with repeated 429s → take it out of rotation and persist that,
- a worker that has not changed state in 4 minutes → flag it,
- a worker failing the same one or two tools repeatedly → flag the loop,
- quota pressure above 85% → warn before it becomes a failure.

Only when something is genuinely stuck does it run the OVERWATCH prompt for a
judgement call, with the full fact sheet, and report `STATUS / CHANGES / BLOCKED`
in at most four lines. It can reassign the **main agent's** model too: if VYRA's
provider is exhausted, Overwatch moves it and tells it what happened, so the user
is never left without a working agent.

## 8. Vision and marking

`VisionEngine.screen_map` is one pass producing:

- a PNG of the screen, annotated with numbered marks (set-of-marks),
- an OCR text run list with bounding boxes and confidences,
- a grid fallback when OCR is unavailable,
- `to_text()` — the whole thing as text, including click coordinates for each mark.

A vision model reads the image; a text-only model reads `to_text()`. They address
identical marks, which is what makes mixing modes safe. On top of that:
`vision.find` (locate a label, optionally waiting for it), `vision.verify`
(did the screen change, and where), `vision.zoom` (read small text), `vision.pixel`
(is that control enabled/selected?).

## 9. Browser control

- **Attach or launch.** `browser.start` launches the installed Chrome/Edge with a
  managed persistent profile (so logins survive); `browser.attach` connects over
  CDP to a browser the user started themselves, giving the agent their real
  sessions, extensions and tabs.
- **Structure first.** `snapshot` injects `data-vyralis-ref` attributes and returns
  every interactive element with its geometry; clicks and fills address elements
  by that ref, which survives re-renders far better than a CSS path.
- **Fills are read back.** `browser.fill` returns the field's actual value and a
  `verified` flag — a fill that silently failed is visible immediately.
- **Browser UI needs vision.** `chrome_ui` opens the three-dot menu with the real
  `Alt+F`, or locates a toolbar icon by text and returns its click point. That is
  how the agent clicks Extensions, Lens, the profile avatar and the like.
- **JS escape hatch.** `browser.read what=js` runs arbitrary JavaScript when a page
  fights automation.

## 10. Self-extension

Two mechanisms, both first-class tools:

**Plugins** (`vyralis/plugins/`) — real Python, registered in-process. The agent
reads the SDK contract, writes a module with `register(api)`, validates it
statically (syntax, presence of `register`, banned-name warnings), installs it,
and the new tools are immediately available to every agent. The loader is
defensive: a broken plugin reports its error and registers nothing, and reloading
picks up edits without a restart. Installing is a `destructive` permission because
it runs code with Vyralis's own rights; the manifest's content digest is recorded.

**Skills** (`vyralis/skills.py`) — a recorder observes tool calls on the bus while
the agent performs a routine, compiles away the exploratory steps (`vision.*`,
`browser.wait`, `browser.snapshot`), lifts variable payloads into named inputs
with the recorded value as a default, and stores the step list as procedural
memory. Replay executes the action tools directly. A failing step marks the skill
stale and returns a precise diagnosis (which step, which tool, why) so the agent
can look at the screen, redo the routine and re-record.

## 11. Hardware watchdog

Sampling merges three sources: psutil (always available), LibreHardwareMonitor's
HTTP bridge (fans, voltages, VRM and package temperatures), and the Windows WMI
thermal zone as a fallback. `HardwareMonitor.evaluate` then checks:

- CPU temperature against warn/critical thresholds (and any other sensor),
- CPU load sustained above the warning line for 45 seconds,
- memory pressure, and any disk below the free-space floor,
- **fan behaviour**: a fan that does not respond while temperature climbs, or one
  whose RPM swings by more than the configured delta, which is the signature of a
  failing fan rather than normal speed ramping.

Alerts are de-duplicated over five minutes, published on the bus, spoken, and
written into the main agent's memory so it knows about the machine's condition in
later tasks.

## 12. Interface rendering

`ui/src/three/core.ts` — the particle shell. Positions live in two attributes
(`position`, `aTarget`) and the morph is done in the vertex shader behind one
uniform, so a shape change costs a single write instead of tens of thousands of
CPU lerps. Speech drives a travelling ripple; reasoning raises the breathing
amplitude and the spin rate; a tool call launches an expanding ring from a random
point on the shell; alerts push the palette to red.

`ui/src/three/wiring.ts` — the graph. Curved conductors are precomputed as
polylines; a shader draws a moving dash pattern plus a travelling bright head, and
per-vertex alpha is animated toward `base + activity` where activity decays with a
2.4-second half-life. Packets are points advanced along the same quadratic each
frame. Agent and category labels are canvas-texture sprites rebuilt only when the
roster changes.

`ui/src/three/Stage.tsx` owns the single renderer, camera and frame loop, and is
the only place where store state becomes motion: `phase` picks the shape,
`pulses` fire rings and packets, `memoryPulse` throws a filament, `agents` rebuild
the ring.

## 13. Failure behaviour, by design

| Failure | What happens |
|---|---|
| No provider configured | the agent reports it plainly; `missing_setup()` names the fix |
| Provider 401/403 | that provider is cooled and the task continues elsewhere |
| Provider 429 | cooldown with exponential backoff; four strikes disables it |
| All providers down | the task fails with one clear message, not a retry storm |
| Tool raises | converted into a tool error the agent can read and act on |
| Tool times out | bounded per tool; the agent is told which call timed out |
| Action needs approval, no user | the answer is "no" and the agent is told why |
| Plugin is broken | its import error is reported; nothing else is affected |
| Skill flow changed | marked stale, diagnosis returned, agent re-records |
| Hardware critical | alert raised, spoken, agent notified, HUD turns red |
