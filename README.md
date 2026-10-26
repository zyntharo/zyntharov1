# VYRALIS

**Sovereign Desktop Agent Runtime** — a local, voice-first AI operator that drives
a real computer and a real browser: mouse, keyboard, windows, files, Office
documents, WhatsApp and the browser the user already has.

```
  VYRALIS  ·  Nyx Core  ·  v0.1.0
```

Vyralis is not a chat wrapper. It is an agent runtime with a permissioned tool
surface, persistent memory, self-extension and a supervisor that keeps the model
pool healthy. Everything runs on the user's machine; the only outbound traffic is
to the model provider they configure.

---

## What works today

| Area | Status |
|---|---|
| Agent runtime (main / Overwatch / squad leads / operators / analysts) | Working |
| Multi-provider model pool, quota ledger, automatic failover | Working |
| Permission system: grants, confirmation prompts, path confinement | Working |
| Vision: screen maps, set-of-marks, OCR, change verification | Working |
| Computer control: mouse, keyboard, windows, focus guarding, input verification | Working |
| Browser control over installed Chrome/Edge (CDP) + browser-UI control | Working |
| Filesystem: read ranges, precise edits, search, archives, structured data | Working |
| Office: Word, Excel, PowerPoint, PDF, Access | Working (Access needs the ODBC driver) |
| Hardware telemetry + health watchdog (temps, fans, voltages, disk) | Working |
| Skills: record a routine once, replay it directly forever | Working |
| Plugins: the agent writes, validates, installs and uses its own code | Working |
| WhatsApp via WhatsApp Web: pairs once, then chats, media, voice notes, calls | Working (selectors are DOM-dependent) |
| Interface: particle core, live wiring graph, panels, voice | Working |
| Installer (Inno Setup / dmg / tar.gz) | Scripted, needs the platform toolchain |

## Quick start

```bash
# 1. install the runtime (pick only what this machine needs)
python -m venv .venv && . .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -e ".[desktop,browser,office,hardware]"

# 2. build the interface once
cd ui && npm install && npm run build && cd ..

# 3. tell it which model to use (any OpenAI-compatible endpoint)
cp .env.example .env        # then fill in base url + key + model

# 4. run it
vyralis run                 # opens the interface window
```

Then check the install at any time:

```bash
vyralis doctor              # exactly what is present, what is missing, and how to fix it
vyralis tools               # every capability the agent can call
vyralis chat                # terminal conversation, no GUI
```

No coding environment is needed on the target machine: the installer bundles the
Python runtime, the interface and every dependency. See
[docs/INSTALL.md](docs/INSTALL.md).

---

## The pieces, and why they are built this way

### Two senses, one truth

Every web page can be read as **structure** (`browser.snapshot` — every
interactive element with a stable ref, role, label and coordinates) or as
**pixels** (`vision.look` — a numbered map of text runs and regions). A model
with no vision capability consumes the first and acts just as precisely; a vision
model consumes the second. Because both describe the same marks, an agent can
switch mid-task without losing its place. Browser UI that has no DOM at all —
refresh, extensions, the Lens button, the profile avatar, the three-dot menu — is
driven through real keyboard shortcuts plus a screen map (`browser.chrome_ui`).

### Actions are verified, never assumed

`computer.type_text` captures the target region before and after, and if the
pixels did not change it clicks the field, clears it and retries. Every input can
require `expect_window`, so a keystroke is **refused** rather than landing in
whatever application happened to be on top. `vision.verify` answers "did that
click do anything" for any other action.

### The pool is managed, not hoped for

Every provider has an rpm/rpd/tpm/tpd envelope in a SQLite ledger. Before each
call the router checks headroom, capability (tools/vision/audio), tier ceiling and
cooldowns; on a 429 or a dead endpoint the Manager agent moves the affected agent
to another provider **carrying its memory and context forward**, so the task
continues instead of failing.

### Repetition becomes direct execution

Record a routine once (`skills.record_start`), and Vyralis compiles the action
trail into a parameterised skill — stripping out all the looking and verifying,
which was how it *discovered* the routine. Replaying calls the action tools
directly: no screenshots, no OCR, no model tokens. If the application changes and
a step breaks, the skill marks itself stale and hands control back to the agent.

### The agent extends itself

`plugins.guidelines` → `plugins.generate` writes real Python, validates it
statically, loads it in-process and registers its tools. From that moment every
agent has the new capability. Installation runs code with Vyralis's own rights,
so it is a `destructive` action and is confirmed by the user by default.

### The machine is watched

`hardware.report` exposes CPU load per core, clocks, memory, disks, network,
battery and every temperature/fan/voltage/power sensor the machine publishes.
The watchdog raises alerts *before* things get dangerous, including the classic
failing-fan signature (temperature climbing while fan RPM does not respond) and
memory pressure or a nearly full disk. The main agent is notified, the interface
turns red, and the warning is spoken.

---

## Architecture

```
ui/ (React + three.js)
   │  WebSocket /ws  +  REST /api
   ▼
vyralis/server/app.py ─────────── FastAPI, static GUI host
   │
   ▼
vyralis/runtime.py ──── owns everything below
   ├── memory/store.py ── SQLite: agents, messages, memories, tasks, quota, traces
   ├── llm/ ───────────── client, quota ledger, router (capability + failover)
   ├── agents/ ────────── roles, the shared agent loop, orchestrator, Overwatch
   ├── tools/ ─────────── registry + execution pipeline (authorise → run → verify)
   ├── capabilities/ ──── vision, computer, browser, files, shell, office,
   │                      hardware, whatsapp
   ├── plugins/ ───────── plugin SDK, loader, scaffolder
   ├── skills.py ──────── recorder, compiler, replayer
   ├── safety/ ────────── permission policy, path guard
   └── voice.py ───────── speech out, speech in, transcript
```

Full detail, including the agent loop and the event vocabulary:
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Interface

Voice is the default channel: hold the orb (or the space bar) and speak. The
keyboard is available behind `TYPE INSTEAD`, as an option rather than the primary
mode.

The centre of the screen is a **particle core** — tens of thousands of points
rotating like a planet. It is not decoration:

| Phase | What the core does |
|---|---|
| standby | slow drift, low glow |
| listening | contracts into a ring |
| reasoning | tightens and swirls faster |
| executing | ordered lattice, faster spin |
| speaking | radial ripples following the voice envelope |
| attention | turns red, expands |

Around it, a **wiring graph** shows the truth about the system: one ring of agent
nodes, one ring of capability nodes, curved conductors between them. Packets
travel a wire when work flows through it, wires brighten for a couple of seconds
after a real event and fade again, and a memory write throws a filament across the
core. Agents appear when they are spawned. Nothing on that graph moves on a timer.

Panels (`Ctrl+Tab`) hold capabilities, the model pool with live quota, memory,
skills, plugins, tasks and settings.

---

## Safety

- Three permission modes: `ask` (default), `auto`, `deny`.
- Destructive tools, and anything on the confirmation list, block on a real
  answer from the user. With no human present the answer is **no**.
- Every agent gets an explicit tool grant; a worker with a spreadsheet job cannot
  delete a folder, and a subagent can never hold more authority than its parent.
- Filesystem tools are confined to an allowlist (the home directory by default).
- Deleting is recoverable by default; permanent deletion has to be asked for.
- Shell commands are screened against a catastrophic-command list.
- Plugins are in-process Python and treated as such: gated, hashed, revocable.

## Verification

```bash
.venv/bin/python -m pytest tests -q      # 84 tests: runtime, tools, safety, GUI events
cd ui && npm run build                   # type-checks the interface, then builds it
```

The suite covers memory retrieval and quota behaviour, router selection and
failover, filesystem safety, the permission pipeline (including that a destructive
action cannot run without a human), plugin install/validate/unload, skill
record → replay → staleness, the full agent loop against a scripted model, and
the HTTP/WebSocket surface.

## What is deliberately not done

- **No bundled browser.** Browser control drives the user's installed Chrome or
  Edge; downloading a second Chromium would add ~150 MB for no benefit.
- **No vector database.** Memory retrieval is lexical with recency and importance
  weighting, which is fast, dependency-free and good enough to be useful; the
  scorer is a single method you can replace.
- **Live call audio is a routing problem, not a code problem.** Speaking and
  listening on a WhatsApp call works through the system audio devices; making the
  caller *hear* it needs a loopback device (VB-Cable, BlackHole, a PulseAudio
  null sink), which is documented rather than faked.
- **Access databases need the Microsoft Access ODBC driver.** The error message
  says exactly which one, and the Excel/CSV path works without it.
- **WhatsApp Web selectors change.** Every method reports a clear selector error
  instead of failing silently; the fix is a selector update, not a redesign.

## License

Proprietary. See [LICENSE](LICENSE).
