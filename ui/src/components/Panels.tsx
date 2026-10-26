/** The configuration drawer: capabilities, memory, skills, plugins, model pool, settings. */

import { useEffect, useMemo, useState } from 'react'

import { api } from '../lib/api'
import { useVyralis, vyralisStore } from '../lib/store'

type Tab = 'capabilities' | 'memory' | 'skills' | 'plugins' | 'model' | 'tasks' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'model', label: 'Model pool' },
  { id: 'memory', label: 'Memory' },
  { id: 'skills', label: 'Skills' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'settings', label: 'Settings' },
]

export function Panels({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element | null {
  const [tab, setTab] = useState<Tab>('capabilities')
  const status = useVyralis((state) => state.status)
  const settings = useVyralis((state) => state.settings)
  const tools = useVyralis((state) => state.tools)
  const memories = useVyralis((state) => state.memories)
  const skills = useVyralis((state) => state.skills)
  const plugins = useVyralis((state) => state.plugins)
  const tasks = useVyralis((state) => state.tasks)
  const providers = useVyralis((state) => state.providers)
  const [filter, setFilter] = useState('')
  const [memoryQuery, setMemoryQuery] = useState('')
  const [missing, setMissing] = useState<string[]>([])
  const [message, setMessage] = useState('')

  // Refresh the drawer's data whenever it is opened, so it never shows a
  // stale view of the system.
  useEffect(() => {
    if (!open) return
    void (async () => {
      try {
        setMissing((await api.probe()).missing_setup)
      } catch {
        setMissing([])
      }
      try {
        vyralisStore.setTools((await api.tools()).tools)
      } catch {
        /* keep whatever we already have */
      }
      try {
        vyralisStore.setSkills((await api.skills()).skills)
      } catch {
        /* ignore */
      }
      try {
        vyralisStore.setPlugins((await api.plugins()).plugins)
      } catch {
        /* ignore */
      }
      try {
        vyralisStore.setTasks((await api.tasks()).tasks)
      } catch {
        /* ignore */
      }
      try {
        vyralisStore.setMemories((await api.memory()).memories)
      } catch {
        /* ignore */
      }
      try {
        const payload = await api.providers()
        vyralisStore.setProviders(payload.providers)
      } catch {
        /* ignore */
      }
    })()
  }, [open])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof tools>()
    for (const tool of tools) {
      const needle = filter.trim().toLowerCase()
      if (needle && !`${tool.name} ${tool.description}`.toLowerCase().includes(needle)) continue
      const list = map.get(tool.category) ?? []
      list.push(tool)
      map.set(tool.category, list)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [tools, filter])

  if (!open) return null

  const refreshMemory = async (query: string) => {
    setMemoryQuery(query)
    try {
      const payload = await api.memory(query)
      vyralisStore.setMemories(payload.memories)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="drawer">
      <div className="drawer-head">
        <nav className="tabs">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              className={`tab ${tab === entry.id ? 'active' : ''}`}
              onClick={() => setTab(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </nav>
        <button className="chip" onClick={onClose}>
          CLOSE
        </button>
      </div>

      {message && <p className="drawer-message">{message}</p>}

      <div className="drawer-body">
        {tab === 'capabilities' && (
          <>
            <div className="drawer-tools">
              <input
                className="field"
                placeholder="Filter capabilities…"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
              <span className="hint">{tools.length} tools registered</span>
            </div>
            {grouped.map(([category, list]) => (
              <section key={category} className="tool-group">
                <h4>
                  {category} <span className="panel-count">{list.length}</span>
                </h4>
                {list.map((tool) => (
                  <div className="tool-row" key={tool.name}>
                    <code>{tool.name}</code>
                    <span className={`perm perm-${tool.permission}`}>{tool.permission}</span>
                    <p>{tool.description}</p>
                  </div>
                ))}
              </section>
            ))}
          </>
        )}

        {tab === 'model' && (
          <>
            <ProviderForm onDone={setMessage} />
            <div className="provider-table">
              {providers.map((provider) => (
                <div className="provider-card" key={provider.id}>
                  <div className="provider-card-head">
                    <strong>{provider.label || provider.id}</strong>
                    <span className="provider-model">{provider.model}</span>
                    <span className={`perm perm-${provider.has_key ? 'safe' : 'destructive'}`}>
                      {provider.has_key ? 'key set' : 'no key'}
                    </span>
                    {provider.cooling && <span className="hot">cooling {Math.ceil(provider.cooldown_seconds)}s</span>}
                  </div>
                  <p className="provider-url">{provider.base_url}</p>
                  <div className="provider-stats">
                    <span>
                      {provider.requests_minute}/{provider.rpm || '∞'} rpm
                    </span>
                    <span>
                      {provider.requests_day}/{provider.rpd || '∞'} rpd
                    </span>
                    <span>
                      {provider.tokens_minute}/{provider.tpm || '∞'} tpm
                    </span>
                    <span>
                      {provider.tokens_day}/{provider.tpd || '∞'} tpd
                    </span>
                    <span>tier {provider.tier}</span>
                    <span>failures {provider.failures}</span>
                  </div>
                  {provider.blocked_reason && <p className="hot">{provider.blocked_reason}</p>}
                  {provider.last_error && <p className="hint">last error: {provider.last_error}</p>}
                  <div className="provider-actions">
                    <button
                      className="chip"
                      onClick={async () => {
                        const result = await api.testProvider(provider.id)
                        setMessage(
                          result.ok
                            ? `${provider.id}: replied "${result.reply}" using ${(result as any).model}`
                            : `${provider.id}: ${result.error}`,
                        )
                      }}
                    >
                      TEST
                    </button>
                    <button
                      className="chip"
                      onClick={async () => {
                        await api.updateProvider(provider.id, { enabled: !provider.enabled })
                        setMessage(`${provider.id} ${provider.enabled ? 'disabled' : 'enabled'}`)
                      }}
                    >
                      {provider.enabled ? 'DISABLE' : 'ENABLE'}
                    </button>
                    <button
                      className="chip chip-danger"
                      onClick={async () => {
                        await api.deleteProvider(provider.id)
                        setMessage(`${provider.id} removed`)
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'memory' && (
          <>
            <div className="drawer-tools">
              <input
                className="field"
                placeholder="Search memory…"
                value={memoryQuery}
                onChange={(event) => void refreshMemory(event.target.value)}
              />
              <span className="hint">{status?.memory.memories ?? memories.length} stored</span>
            </div>
            {memories.map((memory) => (
              <div className="memory-row" key={memory.id}>
                <div className="memory-head">
                  <span className={`kind kind-${memory.kind}`}>{memory.kind}</span>
                  <span className="hint">
                    {memory.scope}
                    {memory.agent_id ? ` · ${memory.agent_id}` : ''}
                    {memory.access_count ? ` · used ${memory.access_count}×` : ''}
                  </span>
                  <button className="chip chip-danger" onClick={() => void api.forgetMemory(memory.id)}>
                    FORGET
                  </button>
                </div>
                <p>{memory.content}</p>
              </div>
            ))}
            {memories.length === 0 && <p className="empty">Nothing stored yet.</p>}
          </>
        )}

        {tab === 'skills' && (
          <>
            <p className="hint">
              A skill is a recorded routine: the agent replays the actions directly instead of
              looking at the screen again. Stale skills are re-recorded the next time they fail.
            </p>
            {skills.map((skill) => (
              <div className="skill-row" key={skill.id}>
                <div className="skill-head">
                  <strong>{skill.name}</strong>
                  <span className={skill.stale ? 'hot' : 'ok'}>
                    {skill.stale ? 'stale' : `${Math.round(skill.reliability * 100)}% reliable`}
                  </span>
                  <span className="hint">
                    {skill.step_count} steps · {skill.uses} runs
                  </span>
                </div>
                <p>{skill.description}</p>
                {Object.keys(skill.parameters).length > 0 && (
                  <p className="hint">inputs: {Object.keys(skill.parameters).join(', ')}</p>
                )}
                <div className="provider-actions">
                  <button
                    className="chip"
                    onClick={async () => {
                      const inputs: Record<string, string> = {}
                      for (const name of Object.keys(skill.parameters)) {
                        const value = window.prompt(`Value for ${name}:`, '')
                        if (value === null) return
                        inputs[name] = value
                      }
                      const result = await api.runSkill(skill.id, inputs)
                      setMessage(
                        result.ok
                          ? `${skill.name}: ${result.steps_run} steps in ${result.duration_ms} ms`
                          : `${skill.name} failed at step ${result.failed_at_step} (${result.failed_tool})`,
                      )
                    }}
                  >
                    RUN
                  </button>
                  <button
                    className="chip chip-danger"
                    onClick={async () => {
                      await api.forgetSkill(skill.id)
                      setMessage(`${skill.name} forgotten`)
                    }}
                  >
                    FORGET
                  </button>
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="empty">
                No skills yet. Ask for a repetitive task; Vyralis records it and turns it into a
                direct action for next time.
              </p>
            )}
          </>
        )}

        {tab === 'plugins' && (
          <>
            <p className="hint">
              Plugins are capabilities Vyralis wrote for itself. Installing one runs Python inside
              the runtime with the same rights as Vyralis, so installation is confirmed first.
            </p>
            {plugins.map((plugin) => (
              <div className="plugin-row" key={plugin.id}>
                <div className="plugin-head">
                  <strong>{plugin.name || plugin.id}</strong>
                  <span className="hint">v{plugin.version ?? '0.0.1'}</span>
                  {plugin.generated && <span className="kind">self-written</span>}
                  <span className={plugin.ok === false ? 'hot' : 'ok'}>
                    {plugin.ok === false ? 'error' : 'loaded'}
                  </span>
                </div>
                {plugin.description && <p>{plugin.description}</p>}
                {plugin.tools && plugin.tools.length > 0 && (
                  <p className="hint">tools: {plugin.tools.join(', ')}</p>
                )}
                {plugin.error && <p className="hot">{plugin.error}</p>}
                <div className="provider-actions">
                  <button
                    className="chip"
                    onClick={async () => {
                      try {
                        const result = await api.reloadPlugin(plugin.id)
                        setMessage(result.ok ? `${plugin.id} reloaded` : `${plugin.id}: ${result.error}`)
                      } catch (error) {
                        setMessage(String(error))
                      }
                    }}
                  >
                    RELOAD
                  </button>
                  <button
                    className="chip chip-danger"
                    onClick={async () => {
                      await api.uninstallPlugin(plugin.id)
                      setMessage(`${plugin.id} uninstalled`)
                    }}
                  >
                    UNINSTALL
                  </button>
                </div>
              </div>
            ))}
            {plugins.length === 0 && <p className="empty">No plugins installed yet.</p>}
          </>
        )}

        {tab === 'tasks' && (
          <>
            {tasks.map((task) => (
              <div className="task-row" key={task.id}>
                <div className="task-head">
                  <span className={`status status-${task.status}`}>{task.status}</span>
                  <strong>{task.title}</strong>
                  <span className="hint">{task.agent_id ?? 'unassigned'}</span>
                </div>
                {task.result && <pre className="task-result">{task.result.slice(0, 900)}</pre>}
              </div>
            ))}
            {tasks.length === 0 && <p className="empty">No tasks yet.</p>}
          </>
        )}

        {tab === 'settings' && settings && (
          <SettingsPanel settings={settings} missing={missing} onMessage={setMessage} />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
function SettingsPanel({
  settings,
  missing,
  onMessage,
}: {
  settings: NonNullable<ReturnType<typeof useVyralis<any>>>
  missing: string[]
  onMessage: (message: string) => void
}): JSX.Element {
  const update = async (patch: Record<string, unknown>, note: string) => {
    await api.updateSettings(patch)
    onMessage(note)
  }

  return (
    <>
      <section className="settings-block">
        <h4>Permissions</h4>
        <label className="row">
          <span>Mode</span>
          <select
            value={settings.permission_mode}
            onChange={(event) => void update({ permission_mode: event.target.value }, `Permission mode: ${event.target.value}`)}
          >
            <option value="ask">ask — confirm destructive actions</option>
            <option value="auto">auto — run everything, no prompts</option>
            <option value="deny">deny — read-only, block all mutations</option>
          </select>
        </label>
        <p className="hint">
          Always confirmed: {(settings.require_confirmation_for ?? []).join(', ') || 'none'}
        </p>
        <p className="hint">
          Filesystem allowlist: {(settings.fs_allowlist ?? []).join(' · ') || 'home directory'}
        </p>
      </section>

      <section className="settings-block">
        <h4>Voice</h4>
        <label className="row">
          <span>Spoken replies</span>
          <input
            type="checkbox"
            checked={settings.voice_enabled}
            onChange={(event) => void update({ voice_enabled: event.target.checked }, `Voice ${event.target.checked ? 'on' : 'off'}`)}
          />
        </label>
        <label className="row">
          <span>Engine</span>
          <select
            value={settings.voice_engine}
            onChange={(event) => void update({ voice_engine: event.target.value }, `Voice engine: ${event.target.value}`)}
          >
            <option value="browser">browser (built in, no download)</option>
            <option value="local">local (offline TTS/STT)</option>
            <option value="provider">provider (cloud voice model)</option>
          </select>
        </label>
      </section>

      <section className="settings-block">
        <h4>Interface</h4>
        <label className="row">
          <span>Particles</span>
          <input
            type="range"
            min={3000}
            max={60000}
            step={1000}
            value={settings.gui_particle_count}
            onChange={(event) => void update({ gui_particle_count: Number(event.target.value) }, 'Particle count set (reload to apply)')}
          />
          <span className="hint">{settings.gui_particle_count}</span>
        </label>
        <label className="row">
          <span>Wiring graph</span>
          <input
            type="checkbox"
            checked={settings.gui_show_wiring}
            onChange={(event) => void update({ gui_show_wiring: event.target.checked }, 'Wiring toggled')}
          />
        </label>
        <label className="row">
          <span>Reduced motion</span>
          <input
            type="checkbox"
            checked={settings.gui_reduced_motion}
            onChange={(event) => void update({ gui_reduced_motion: event.target.checked }, 'Motion setting saved')}
          />
        </label>
      </section>

      <section className="settings-block">
        <h4>Agent limits</h4>
        <label className="row">
          <span>Max subagents</span>
          <input
            type="number"
            min={0}
            max={32}
            value={settings.max_subagents}
            onChange={(event) => void update({ max_subagents: Number(event.target.value) }, 'Subagent limit saved')}
          />
        </label>
        <label className="row">
          <span>Parallel tools</span>
          <input
            type="number"
            min={1}
            max={16}
            value={settings.max_parallel_tools}
            onChange={(event) => void update({ max_parallel_tools: Number(event.target.value) }, 'Parallelism saved')}
          />
        </label>
        <label className="row">
          <span>Browser channel</span>
          <input
            value={settings.browser_channel}
            onChange={(event) => void update({ browser_channel: event.target.value }, 'Browser channel saved')}
          />
        </label>
      </section>

      <section className="settings-block">
        <h4>Hardware thresholds</h4>
        {Object.entries(settings.hardware ?? {}).map(([key, value]) => (
          <div className="row" key={key}>
            <span>{key.replace(/_/g, ' ')}</span>
            <span className="hint">{String(value)}</span>
          </div>
        ))}
        <p className="hint">
          For fan, voltage and package-temperature telemetry, run LibreHardwareMonitor with its web
          server enabled and point VYRALIS_LHM_URL at it.
        </p>
      </section>

      {missing.length > 0 && (
        <section className="settings-block">
          <h4>Setup still outstanding</h4>
          {missing.map((gap) => (
            <p className="hot" key={gap}>
              {gap}
            </p>
          ))}
        </section>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
function ProviderForm({ onDone }: { onDone: (message: string) => void }): JSX.Element {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    id: '',
    label: '',
    base_url: '',
    api_key: '',
    model: '',
    audio_model: '',
    tier: 'standard',
    rpm: 0,
    rpd: 0,
    tpm: 0,
    tpd: 0,
    supports_tools: true,
    supports_vision: false,
  })

  if (!open) {
    return (
      <button className="chip chip-primary" onClick={() => setOpen(true)}>
        ADD PROVIDER
      </button>
    )
  }

  return (
    <form
      className="provider-form"
      onSubmit={async (event) => {
        event.preventDefault()
        try {
          await api.addProvider({ ...form, id: form.id.trim().toLowerCase() })
          onDone(`${form.id} added`)
          setOpen(false)
          setForm({ ...form, id: '', label: '', base_url: '', api_key: '', model: '' })
        } catch (error) {
          onDone(String(error))
        }
      }}
    >
      <p className="hint">
        Any OpenAI-compatible endpoint works: OpenAI, Anthropic, OpenRouter, Groq, Together,
        DeepSeek, LM Studio, Ollama, or your own gateway. Quota limits feed the manager agent, which
        uses them to pick models and to fail over before things break.
      </p>
      <div className="form-grid">
        <input
          className="field"
          placeholder="id (e.g. groq)"
          required
          value={form.id}
          onChange={(event) => setForm({ ...form, id: event.target.value })}
        />
        <input
          className="field"
          placeholder="label"
          value={form.label}
          onChange={(event) => setForm({ ...form, label: event.target.value })}
        />
        <input
          className="field span-2"
          placeholder="base url (https://api.groq.com/openai/v1)"
          required
          value={form.base_url}
          onChange={(event) => setForm({ ...form, base_url: event.target.value })}
        />
        <input
          className="field span-2"
          placeholder="api key"
          type="password"
          value={form.api_key}
          onChange={(event) => setForm({ ...form, api_key: event.target.value })}
        />
        <input
          className="field"
          placeholder="model id"
          required
          value={form.model}
          onChange={(event) => setForm({ ...form, model: event.target.value })}
        />
        <input
          className="field"
          placeholder="realtime/audio model (optional)"
          value={form.audio_model}
          onChange={(event) => setForm({ ...form, audio_model: event.target.value })}
        />
        <select
          className="field"
          value={form.tier}
          onChange={(event) => setForm({ ...form, tier: event.target.value })}
        >
          <option value="local">local</option>
          <option value="economy">economy</option>
          <option value="standard">standard</option>
          <option value="frontier">frontier</option>
        </select>
        {(['rpm', 'rpd', 'tpm', 'tpd'] as const).map((key) => (
          <input
            className="field"
            key={key}
            type="number"
            min={0}
            placeholder={key.toUpperCase()}
            value={form[key] || ''}
            onChange={(event) => setForm({ ...form, [key]: Number(event.target.value) })}
          />
        ))}
      </div>
      <div className="form-flags">
        <label>
          <input
            type="checkbox"
            checked={form.supports_tools}
            onChange={(event) => setForm({ ...form, supports_tools: event.target.checked })}
          />
          function calling
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.supports_vision}
            onChange={(event) => setForm({ ...form, supports_vision: event.target.checked })}
          />
          vision
        </label>
      </div>
      <div className="provider-actions">
        <button className="chip" type="button" onClick={() => setOpen(false)}>
          CANCEL
        </button>
        <button className="chip chip-primary" type="submit">
          SAVE PROVIDER
        </button>
      </div>
    </form>
  )
}
