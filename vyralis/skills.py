"""Skills: turning a slow vision-and-click routine into a direct action.

This is the answer to "it can automate that system where it can call actions
directly, no need to look and click every time". A skill is a verified,
parameterised sequence of action tool calls:

* **Record.** While a recording is open, every action the agent takes is
  observed on the event bus. Exploratory steps (looking, waiting, verifying,
  screenshotting) are compiled away - they were how the agent *discovered* the
  routine, not part of it.
* **Parameterise.** Literal values the agent typed or clicked on are lifted into
  named inputs, so the same skill works on new data.
* **Replay.** Running a skill calls the action tools directly: no screenshots,
  no OCR, no model round-trips. That is one to two orders of magnitude faster
  and costs no tokens.
* **Self-healing.** Replay re-checks each step. When a step fails, the skill
  marks itself stale and hands control back to the agent, which can look at the
  screen, fix the flow and re-record. A skill that breaks never fails silently -
  it degrades back into the slow-but-correct path.
"""

from __future__ import annotations

import json
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Sequence

from .bus import BUS, EventType
from .memory.store import MemoryRecord, new_id

log = logging.getLogger("vyralis.skills")

# Which tools count as "actions" when compiling a recording.
ACTION_TOOLS = {
    "computer.click", "computer.click_and_type", "computer.type_text", "computer.key",
    "computer.drag", "computer.scroll", "computer.focus_window", "computer.launch_app",
    "computer.clipboard",
    "browser.click", "browser.fill", "browser.press", "browser.open", "browser.select",
    "browser.tabs", "browser.chrome_ui", "browser.scroll", "browser.upload",
    "files.write", "files.edit", "files.append", "files.copy", "files.move", "files.delete",
    "files.compress", "files.extract", "office.excel_write", "office.word_edit",
    "whatsapp.send", "whatsapp.send_media",
}

# Arguments an agent may explicitly promote to skill inputs.
PARAMETERISABLE_ARGS = {"text", "value", "content", "query", "url", "path", "contact", "name"}
# Arguments that are auto-promoted: the payload that changes between runs.
# Structural arguments (path, url, contact) stay literal so a recorded routine
# still replays unchanged unless the agent asks for them as inputs.
AUTO_PARAM_ARGS = {"text", "value", "content", "query"}

NOISE_TOOLS = {
    "vision.look", "vision.screenshot", "vision.find", "vision.verify", "vision.zoom",
    "vision.pixel", "browser.snapshot", "browser.screenshot", "browser.wait", "browser.read",
    "hardware.report", "hardware.sensors", "hardware.health",
}

PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


@dataclass
class SkillStep:
    tool: str
    args: dict[str, Any] = field(default_factory=dict)
    note: str = ""

    def to_json(self) -> dict[str, Any]:
        return {"tool": self.tool, "args": self.args, "note": self.note}


@dataclass
class Skill:
    id: str
    name: str
    description: str
    steps: list[SkillStep] = field(default_factory=list)
    parameters: dict[str, dict[str, Any]] = field(default_factory=dict)
    platform: str = ""
    created_at: float = field(default_factory=time.time)
    uses: int = 0
    successes: int = 0
    failures: int = 0
    stale: bool = False
    version: int = 1
    origin_agent: str = ""

    @property
    def reliability(self) -> float:
        total = self.successes + self.failures
        return (self.successes / total) if total else 0.0

    def to_json(self) -> dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "steps": [step.to_json() for step in self.steps],
            "step_count": len(self.steps), "parameters": self.parameters,
            "uses": self.uses, "successes": self.successes, "failures": self.failures,
            "reliability": round(self.reliability, 3), "stale": self.stale,
            "version": self.version, "created_at": self.created_at, "platform": self.platform,
        }

    def to_tool_schema(self) -> dict[str, Any]:
        properties = {
            name: {
                "type": spec.get("type", "string"),
                "description": (
                    spec.get("description", f"{name}")
                    + (f" (defaults to the recorded value: {spec['default']!r})"
                       if "default" in spec else "")
                ),
            }
            for name, spec in self.parameters.items()
        }
        return {
            "type": "object",
            "properties": properties,
            # Inputs with a recorded default are optional at replay time.
            "required": [
                name for name, spec in self.parameters.items() if "default" not in spec
            ],
            "additionalProperties": False,
        }

    def render(self, inputs: dict[str, Any]) -> list[SkillStep]:
        resolved = dict(inputs)
        for name, spec in self.parameters.items():
            if name not in resolved and "default" in spec:
                resolved[name] = spec["default"]
        rendered: list[SkillStep] = []
        for step in self.steps:
            args = json.loads(json.dumps(step.args))
            rendered.append(SkillStep(tool=step.tool, args=_substitute(args, resolved), note=step.note))
        return rendered


def _substitute(value: Any, inputs: dict[str, Any]) -> Any:
    if isinstance(value, str):
        def replace(match: re.Match[str]) -> str:
            key = match.group(1)
            if key not in inputs:
                raise KeyError(f"Skill input '{key}' was not provided.")
            return str(inputs[key])

        if PLACEHOLDER.fullmatch(value):
            # A stand-alone placeholder must resolve exactly; silently keeping
            # the literal would type "{{query}}" into a live application.
            key = PLACEHOLDER.fullmatch(value).group(1)  # type: ignore[union-attr]
            if key not in inputs:
                raise KeyError(f"Skill input '{key}' was not provided.")
            return inputs[key]
        return PLACEHOLDER.sub(replace, value)
    if isinstance(value, dict):
        return {key: _substitute(item, inputs) for key, item in value.items()}
    if isinstance(value, list):
        return [_substitute(item, inputs) for item in value]
    return value


class SkillRecorder:
    """Observes the bus while a routine is being performed."""

    def __init__(self, agent_id: str, title: str = "") -> None:
        self.agent_id = agent_id
        self.title = title
        self.started_at = time.time()
        self.steps: list[SkillStep] = []
        self._listener = self._on_event
        BUS.add_listener(self._listener)

    def _on_event(self, event: Any) -> None:
        if event.type != EventType.TOOL_CALL.value:
            return
        if event.agent_id and event.agent_id != self.agent_id:
            return
        payload = event.payload or {}
        tool = payload.get("tool", "")
        if tool in NOISE_TOOLS:
            return
        if tool not in ACTION_TOOLS:
            return
        args = payload.get("args") or {}
        self.steps.append(SkillStep(tool=tool, args=dict(args)))

    def close(self) -> list[SkillStep]:
        BUS.remove_listener(self._listener)
        return self.steps

    def compile(
        self, *, name: str, description: str, parameters: Sequence[str] = (),
        parameterise: bool = True,
    ) -> Skill:
        steps = self.close()
        params: dict[str, dict[str, Any]] = {}
        compiled: list[SkillStep] = []

        auto_index = 0
        for step in steps:
            args = dict(step.args)
            for key in list(args):
                value = args[key]
                if key not in PARAMETERISABLE_ARGS or not isinstance(value, str) or not value:
                    continue
                if not parameterise and key not in parameters:
                    continue
                explicit = key in parameters
                if not explicit:
                    if key not in AUTO_PARAM_ARGS:
                        continue
                    auto_index += 1
                    param_name = f"input{auto_index}"
                else:
                    param_name = key
                if param_name not in params:
                    params[param_name] = {
                        "type": "string",
                        "description": f"Value for '{key}' in step {len(compiled) + 1} ({step.tool})",
                        "example": value[:80],
                        # Auto-promoted inputs keep the recorded value as their
                        # default, so a skill still replays with no arguments.
                        "default": value,
                    }
                args[key] = f"{{{{{param_name}}}}}"
            compiled.append(SkillStep(tool=step.tool, args=args))

        import platform as _platform

        return Skill(
            id=new_id("skill"), name=name, description=description, steps=compiled,
            parameters=params, platform=_platform.system(), origin_agent=self.agent_id,
        )


class SkillLibrary:
    """Persistent, replayable skills stored alongside long-term memory."""

    def __init__(self, store: Any, registry: Any, settings: Any) -> None:
        self.store = store
        self.registry = registry
        self.settings = settings
        self._recorders: dict[str, SkillRecorder] = {}

    # -- recording ------------------------------------------------------
    def start_recording(self, agent_id: str, title: str = "") -> dict[str, Any]:
        if agent_id in self._recorders:
            return {"recording": True, "started_at": self._recorders[agent_id].started_at,
                    "note": "recording already in progress"}
        recorder = SkillRecorder(agent_id, title)
        self._recorders[agent_id] = recorder
        return {"recording": True, "title": title, "started_at": recorder.started_at}

    def recorder_status(self, agent_id: str) -> dict[str, Any]:
        recorder = self._recorders.get(agent_id)
        if recorder is None:
            return {"recording": False}
        return {
            "recording": True, "title": recorder.title,
            "seconds": round(time.time() - recorder.started_at, 1),
            "captured_steps": len(recorder.steps),
            "preview": [step.tool for step in recorder.steps[-12:]],
        }

    def stop_recording(
        self, agent_id: str, *, name: str, description: str = "",
        parameters: Sequence[str] = (), parameterise: bool = True,
    ) -> dict[str, Any]:
        recorder = self._recorders.pop(agent_id, None)
        if recorder is None:
            return {"saved": False, "reason": "no recording in progress"}
        skill = recorder.compile(
            name=name, description=description, parameters=parameters, parameterise=parameterise
        )
        if not skill.steps:
            return {"saved": False, "reason": "no action steps were captured; nothing to save"}
        self.save(skill)
        return {"saved": True, "skill": skill.to_json()}

    # -- persistence ----------------------------------------------------
    def save(self, skill: Skill) -> Skill:
        self.store.remember(MemoryRecord(
            id=skill.id, agent_id=skill.origin_agent or None, kind="procedural",
            content=f"{skill.name}: {skill.description}\nsteps: " +
                    " -> ".join(step.tool for step in skill.steps),
            tags=["skill", skill.name] + [step.tool for step in skill.steps[:6]],
            importance=0.85, scope="global", source="skill-recorder",
            metadata={"skill": skill.to_json()},
        ))
        return skill

    def load(self, skill_id: str) -> Skill | None:
        rows = self.store.list_memories(kind="procedural", limit=500)
        for row in rows:
            payload = (row.metadata or {}).get("skill")
            if payload and payload.get("id") == skill_id:
                return _skill_from_json(payload)
        return None

    def list(self, *, query: str | None = None, include_stale: bool = True) -> list[Skill]:
        skills: list[Skill] = []
        for row in self.store.list_memories(kind="procedural", limit=500):
            payload = (row.metadata or {}).get("skill")
            if not payload:
                continue
            skill = _skill_from_json(payload)
            if not include_stale and skill.stale:
                continue
            if query and query.lower() not in f"{skill.name} {skill.description}".lower():
                continue
            skills.append(skill)
        skills.sort(key=lambda skill: (skill.stale, -skill.reliability, -skill.uses))
        return skills

    def matches(self, intent: str, *, minimum_score: float = 0.35) -> list[Skill]:
        """Cheap lexical match, so the agent checks for an existing fast path
        before it starts looking at the screen."""
        tokens = {token for token in re.findall(r"[a-z0-9]+", intent.lower()) if len(token) > 2}
        scored: list[tuple[float, Skill]] = []
        for skill in self.list(include_stale=False):
            haystack = f"{skill.name} {skill.description} " + " ".join(
                step.tool for step in skill.steps
            )
            haystack_tokens = set(re.findall(r"[a-z0-9]+", haystack.lower()))
            if not tokens or not haystack_tokens:
                continue
            overlap = len(tokens & haystack_tokens) / len(tokens)
            if overlap >= minimum_score:
                scored.append((overlap, skill))
        scored.sort(key=lambda pair: pair[0], reverse=True)
        return [skill for _, skill in scored[:5]]

    def forget(self, skill_id: str) -> dict[str, Any]:
        self.store.forget(skill_id)
        return {"id": skill_id, "forgotten": True}

    def mark_stale(self, skill_id: str, reason: str = "") -> None:
        skill = self.load(skill_id)
        if skill is None:
            return
        skill.stale = True
        skill.failures += 1
        if reason:
            skill.description = f"{skill.description}\n[stale: {reason[:200]}]"
        self.store.forget(skill_id)
        self.save(skill)

    # -- replay ---------------------------------------------------------
    async def run(self, skill_id: str, inputs: dict[str, Any], ctx: Any,
                  *, stop_on_failure: bool = True) -> dict[str, Any]:
        skill = self.load(skill_id)
        if skill is None:
            return {"ok": False, "error": f"No skill with id '{skill_id}'."}
        try:
            rendered = skill.render(inputs)
        except KeyError as exc:
            return {"ok": False, "error": str(exc), "required": list(skill.parameters)}

        results: list[dict[str, Any]] = []
        skill.uses += 1
        for index, step in enumerate(rendered, 1):
            result = await self.registry.execute(step.tool, step.args, ctx)
            results.append({
                "step": index, "tool": step.tool, "ok": result.ok,
                "error": result.error[:300], "duration_ms": result.duration_ms,
            })
            if not result.ok and stop_on_failure:
                skill.failures += 1
                skill.stale = True
                self.store.forget(skill.id)
                self.save(skill)
                BUS.publish(EventType.TOOL_RESULT, {
                    "tool": "skills.run", "ok": False,
                    "error": f"step {index} ({step.tool}) failed", "skill": skill.name,
                })
                return {
                    "ok": False, "skill": skill.name, "failed_at_step": index,
                    "failed_tool": step.tool, "error": result.error,
                    "completed_steps": results[:-1],
                    "advice": (
                        "The recorded flow no longer matches the application. Look at the screen, "
                        "perform the routine once more while recording, and save a new version."
                    ),
                }
        skill.successes += 1
        self.store.forget(skill.id)
        self.save(skill)
        return {
            "ok": True, "skill": skill.name, "steps_run": len(rendered),
            "duration_ms": sum(item["duration_ms"] for item in results),
            "detail": results,
        }


def _skill_from_json(payload: dict[str, Any]) -> Skill:
    return Skill(
        id=payload.get("id", ""),
        name=payload.get("name", ""),
        description=payload.get("description", ""),
        steps=[SkillStep(**step) for step in payload.get("steps", [])],
        parameters=payload.get("parameters", {}),
        platform=payload.get("platform", ""),
        created_at=payload.get("created_at", 0.0),
        uses=payload.get("uses", 0),
        successes=payload.get("successes", 0),
        failures=payload.get("failures", 0),
        stale=payload.get("stale", False),
        version=payload.get("version", 1),
        origin_agent=payload.get("origin_agent", ""),
    )


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: Any, settings: Any, library: SkillLibrary) -> None:
    from .tools.registry import obj, prop

    @registry.tool(
        "skills.record_start",
        "Begin recording the actions you are about to take, so the routine can be replayed later "
        "without looking at the screen or using the model. Start recording before beginning a "
        "repetitive task that will need to be repeated on other data.",
        obj({"title": prop("string", "What this routine does, e.g. 'Export monthly report'.")}),
        category="skills", permission="safe",
    )
    def record_start(title: str = "", ctx: Any = None) -> dict[str, Any]:
        return library.start_recording(ctx.agent_id, title)

    @registry.tool(
        "skills.record_stop",
        "Finish recording and save the routine as a reusable skill. Later calls run the recorded "
        "actions directly: no screenshots, no clicking by sight, no model tokens.",
        obj(
            {
                "name": prop("string", "Short skill name, e.g. 'export_monthly_report'."),
                "description": prop("string", "When to use it, in the agent's own words."),
                "parameters": prop(
                    "array",
                    "Argument names to lift into skill inputs (e.g. ['text','path']). Other values "
                    "stay fixed.",
                    items={"type": "string"},
                ),
            },
            ["name"],
        ),
        category="skills", permission="safe",
    )
    def record_stop(name: str, description: str = "", parameters: list[str] | None = None,
                    ctx: Any = None) -> dict[str, Any]:
        result = library.stop_recording(
            ctx.agent_id, name=name, description=description, parameters=parameters or ()
        )
        if result.get("saved"):
            ctx.note(f"Saved skill '{name}'")
        return result

    @registry.tool(
        "skills.record_status",
        "Check whether a recording is running and how many action steps have been captured.",
        obj({}), category="skills", permission="safe",
    )
    def record_status(ctx: Any = None) -> dict[str, Any]:
        return library.recorder_status(ctx.agent_id)

    @registry.tool(
        "skills.list",
        "List saved skills, including how often each has run and whether it has gone stale.",
        obj({"query": prop("string", "Optional filter."),
             "include_stale": prop("boolean", "Include skills known to be out of date.")}),
        category="skills", permission="safe",
    )
    def list_skills(query: str | None = None, include_stale: bool = True, ctx: Any = None) -> dict[str, Any]:
        return {"skills": [skill.to_json() for skill in library.list(query=query, include_stale=include_stale)]}

    @registry.tool(
        "skills.find",
        "Check whether an existing skill already does what you are about to attempt. Always call "
        "this before starting a repetitive task by looking at the screen.",
        obj({"intent": prop("string", "Describe the task, e.g. 'export the report to excel'.")},
            ["intent"]),
        category="skills", permission="safe",
    )
    def find_skills(intent: str, ctx: Any = None) -> dict[str, Any]:
        matches = library.matches(intent)
        return {
            "matches": [skill.to_json() for skill in matches],
            "advice": (
                "Run the best match with skills.run instead of doing it by hand."
                if matches else "No existing skill; consider recording one while you work."
            ),
        }

    @registry.tool(
        "skills.run",
        "Replay a saved skill directly. This is the fast path: it executes the recorded actions "
        "with no vision or reasoning per step. It reports exactly which step broke if the "
        "application has changed.",
        obj(
            {
                "skill_id": prop("string", "Skill id from skills.list."),
                "inputs": prop("object", "Values for the skill's inputs."),
            },
            ["skill_id"],
        ),
        category="skills", permission="sensitive", timeout=600.0,
    )
    async def run_skill(skill_id: str, inputs: dict[str, Any] | None = None,
                        ctx: Any = None) -> dict[str, Any]:
        return await library.run(skill_id, inputs or {}, ctx)

    @registry.tool(
        "skills.forget", "Delete a skill that is obsolete or no longer correct.",
        obj({"skill_id": prop("string", "Skill id.")}, ["skill_id"]),
        category="skills", permission="sensitive",
    )
    def forget(skill_id: str, ctx: Any = None) -> dict[str, Any]:
        return library.forget(skill_id)
