/** The HUD furniture: top bar, agent rail, telemetry, stream, composer. */

import { useEffect, useMemo, useRef, useState } from 'react'

import { api } from '../lib/api'
import { useVyralis } from '../lib/store'
import type { AgentNode, ConfirmView, StreamItem } from '../lib/types'

const ROLE_LABEL: Record<string, string> = {
  main: 'MAIN',
  manager: 'OVERWATCH',
  head: 'SQUAD LEAD',
  employee: 'OPERATOR',
  specialist: 'ANALYST',
}

const STATUS_COLOR: Record<string, string> = {
  idle: '#4b6f8a',
  thinking: '#31E6FF',
  acting: '#7C5CFF',
  working: '#2ED573',
  waiting: '#F5A524',
  blocked: '#FF5470',
  retired: '#33404d',
}

function phaseLabel(phase: string): string {
  switch (phase) {
    case 'idle':
      return 'STANDBY'
    case 'listening':
      return 'LISTENING'
    case 'thinking':
      return 'REASONING'
    case 'working':
      return 'EXECUTING'
    case 'speaking':
      return 'SPEAKING'
    case 'alert':
      return 'ATTENTION'
    default:
      return 'OFFLINE'
  }
}

function formatUptime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
export function TopBar({
  onTogglePanels,
  voiceEnabled,
  onToggleVoice,
}: {
  onTogglePanels: () => void
  voiceEnabled: boolean
  onToggleVoice: () => void
}): JSX.Element {
  const connected = useVyralis((state) => state.connected)
  const status = useVyralis((state) => state.status)
  const phase = useVyralis((state) => state.phase)
  const agentCount = useVyralis((state) => state.agents.length)
  const routes = useVyralis((state) => state.status?.model.open_routes ?? 0)
  const tools = useVyralis((state) => state.status?.tools.count ?? 0)
  const uptime = status?.info.uptime_s ?? 0
  const [clock, setClock] = useState(uptime)

  useEffect(() => {
    setClock(uptime)
  }, [uptime])

  useEffect(() => {
    const timer = window.setInterval(() => setClock((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const stop = async () => {
    try {
      await api.stop()
    } catch {
      /* the backend may already be idle */
    }
  }

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" data-phase={phase} />
        <div className="brand-text">
          <strong>VYRALIS</strong>
          <span>{status?.info.tagline ?? 'Sovereign Desktop Agent Runtime'}</span>
        </div>
      </div>

      <div className="topbar-metrics">
        <Metric label="STATE" value={phaseLabel(phase)} accent={phase} />
        <Metric label="AGENTS" value={String(agentCount)} />
        <Metric label="ROUTES" value={String(routes)} />
        <Metric label="TOOLS" value={String(tools)} />
        <Metric label="UPTIME" value={formatUptime(clock)} />
        <Metric label="LINK" value={connected ? 'LIVE' : 'DOWN'} accent={connected ? 'idle' : 'alert'} />
      </div>

      <div className="topbar-actions">
        <button className="chip" onClick={onToggleVoice} title="Toggle spoken replies">
          {voiceEnabled ? 'VOICE ON' : 'VOICE OFF'}
        </button>
        <button className="chip" onClick={stop} title="Stop all running agents">
          HALT
        </button>
        <button className="chip chip-primary" onClick={onTogglePanels} title="Open configuration panels">
          PANELS
        </button>
      </div>
    </header>
  )
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}): JSX.Element {
  return (
    <div className={`metric ${accent ? `accent-${accent}` : ''}`}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function AgentRail(): JSX.Element {
  const agents = useVyralis((state) => state.agents)
  const [expanded, setExpanded] = useState<string | null>(null)

  const ordered = useMemo(
    () => [...agents].sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0)),
    [agents],
  )

  const retire = async (agent: AgentNode) => {
    try {
      await api.retireAgent(agent.id)
    } catch {
      /* already gone */
    }
  }

  return (
    <section className="rail">
      <h2 className="panel-title">
        Agents <span className="panel-count">{ordered.length}</span>
      </h2>
      <div className="rail-list">
        {ordered.map((agent) => (
          <article
            key={agent.id}
            className={`agent-card ${expanded === agent.id ? 'expanded' : ''}`}
            onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
          >
            <div className="agent-head">
              <span
                className="agent-dot"
                style={{ background: STATUS_COLOR[agent.status] ?? '#4b6f8a' }}
                title={agent.status}
              />
              <span className="agent-name">{agent.name}</span>
              <span className="agent-rank">R{agent.rank}</span>
            </div>
            <div className="agent-meta">
              <span>{ROLE_LABEL[agent.role] ?? agent.role.toUpperCase()}</span>
              <span className="agent-model">{agent.model ?? 'no model'}</span>
            </div>
            {expanded === agent.id && (
              <div className="agent-detail">
                {agent.mandate && <p className="agent-mandate">{agent.mandate}</p>}
                <p className="agent-grant">
                  grant: {(agent.grant ?? ['all']).slice(0, 4).join(', ')}
                  {(agent.grant?.length ?? 0) > 4 ? ` +${(agent.grant?.length ?? 0) - 4}` : ''}
                </p>
                <p className="agent-grant">
                  provider: {agent.provider_id ?? 'auto'}
                </p>
                {agent.role !== 'main' && (
                  <button
                    className="chip chip-danger"
                    onClick={(event) => {
                      event.stopPropagation()
                      void retire(agent)
                    }}
                  >
                    RETIRE
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
        {ordered.length === 0 && <p className="empty">No agents yet.</p>}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
export function Telemetry(): JSX.Element {
  const hardware = useVyralis((state) => state.hardware)
  const providers = useVyralis((state) => state.providers)
  const tasks = useVyralis((state) => state.tasks)
  const skills = useVyralis((state) => state.skills.length)
  const plugins = useVyralis((state) => state.plugins.length)

  const hotTemps = useMemo(
    () => [...(hardware?.temps ?? [])].sort((a, b) => b.value - a.value).slice(0, 4),
    [hardware],
  )
  const fans = (hardware?.fans ?? []).slice(0, 3)

  return (
    <section className="rail rail-right">
      <h2 className="panel-title">
        System <span className={`verdict verdict-${hardware?.verdict ?? 'unknown'}`}>
          {hardware?.verdict ?? 'unknown'}
        </span>
      </h2>

      <div className="gauge">
        <Gauge label="CPU" value={hardware?.cpuPercent ?? 0} detail={`${Math.round(hardware?.freqMhz ?? 0)} MHz`} />
        <Gauge
          label="RAM"
          value={hardware?.memoryPercent ?? 0}
          detail={`${(hardware?.memoryUsedGb ?? 0).toFixed(1)}/${(hardware?.memoryTotalGb ?? 0).toFixed(1)} GB`}
        />
      </div>

      {hotTemps.length > 0 && (
        <div className="sensors">
          {hotTemps.map((sensor) => (
            <div className="sensor" key={sensor.name}>
              <span className="sensor-name" title={sensor.name}>
                {sensor.name.replace(/^.*?\//, '').slice(0, 18)}
              </span>
              <span className={`sensor-value ${sensor.value >= 85 ? 'hot' : sensor.value >= 75 ? 'warm' : ''}`}>
                {Math.round(sensor.value)}°
              </span>
            </div>
          ))}
        </div>
      )}

      {fans.length > 0 && (
        <div className="sensors">
          {fans.map((sensor) => (
            <div className="sensor" key={sensor.name}>
              <span className="sensor-name" title={sensor.name}>
                {sensor.name.replace(/^.*?\//, '').slice(0, 18)}
              </span>
              <span className="sensor-value">{Math.round(sensor.value)} rpm</span>
            </div>
          ))}
        </div>
      )}

      {(hardware?.disks ?? []).slice(0, 2).map((disk) => (
        <div className="sensor" key={disk.mountpoint}>
          <span className="sensor-name" title={disk.mountpoint}>
            {disk.mountpoint.length > 16 ? `…${disk.mountpoint.slice(-15)}` : disk.mountpoint}
          </span>
          <span className={`sensor-value ${disk.free_gb < 5 ? 'hot' : ''}`}>
            {disk.free_gb.toFixed(1)} GB free
          </span>
        </div>
      ))}

      <h2 className="panel-title">
        Model pool <span className="panel-count">{providers.length}</span>
      </h2>
      <div className="pool">
        {providers.map((provider) => {
          const requestShare = provider.rpm ? provider.requests_minute / provider.rpm : 0
          const tokenShare = provider.tpm ? provider.tokens_minute / provider.tpm : 0
          const share = Math.max(requestShare, tokenShare)
          return (
            <div className="provider-row" key={provider.id}>
              <div className="provider-head">
                <span className={provider.cooling ? 'dot hot' : provider.enabled ? 'dot ok' : 'dot off'} />
                <span className="provider-name">{provider.label || provider.id}</span>
                <span className="provider-model">{provider.model || '—'}</span>
              </div>
              <div className="bar">
                <div
                  className={`bar-fill ${share > 0.85 ? 'hot' : share > 0.6 ? 'warm' : ''}`}
                  style={{ width: `${Math.min(100, share * 100)}%` }}
                />
              </div>
              <div className="provider-foot">
                <span>{provider.tier}</span>
                <span>
                  {provider.requests_minute}
                  {provider.rpm ? `/${provider.rpm}` : ''} rpm
                </span>
                <span>
                  {provider.tokens_minute}
                  {provider.tpm ? `/${provider.tpm}` : ''} tpm
                </span>
                {provider.cooling && <span className="hot">cooling {Math.ceil(provider.cooldown_seconds)}s</span>}
              </div>
            </div>
          )
        })}
        {providers.length === 0 && <p className="empty">No provider configured.</p>}
      </div>

      <div className="counters">
        <Metric label="TASKS" value={String(tasks.length)} />
        <Metric label="SKILLS" value={String(skills)} />
        <Metric label="PLUGINS" value={String(plugins)} />
      </div>

      {(hardware?.alerts ?? []).length > 0 && (
        <div className="alert-box">
          {hardware?.alerts.slice(-3).map((alert, index) => (
            <p key={index} className={`alert-${alert.severity}`}>
              {alert.message}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

function Gauge({ label, value, detail }: { label: string; value: number; detail?: string }): JSX.Element {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="gauge-item">
      <div className="gauge-ring" style={{ ['--value' as string]: `${clamped * 3.6}deg` }}>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div className="gauge-meta">
        <strong>{label}</strong>
        {detail && <span>{detail}</span>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
function streamIcon(item: StreamItem): string {
  switch (item.kind) {
    case 'user':
      return '▸'
    case 'assistant':
      return '◆'
    case 'thought':
      return '·'
    case 'toolError':
      return '⚠'
    case 'alert':
      return '⚠'
    case 'quota':
      return '⇄'
    case 'system':
      return '▪'
    default:
      return '·'
  }
}

export function Stream({ voice }: { voice: { interim: string } }): JSX.Element {
  const items = useVyralis((state) => state.stream)
  const phase = useVyralis((state) => state.phase)
  const speakingText = useVyralis((state) => state.speakingText)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [items.length])

  return (
    <section className="stream">
      <div className="stream-head">
        <h2 className="panel-title">Transcript</h2>
        {speakingText && <span className="speaking-badge">speaking</span>}
        {phase === 'thinking' && <span className="thinking-badge">reasoning…</span>}
      </div>
      <div className="stream-body" ref={containerRef}>
        {items.map((item) => (
          <div className={`stream-item kind-${item.kind}`} key={item.id}>
            <span className="stream-icon">{streamIcon(item)}</span>
            <div className="stream-text">
              {item.agentName && item.kind !== 'user' && (
                <span className="stream-agent">{item.agentName}</span>
              )}
              <pre>{item.text}</pre>
            </div>
          </div>
        ))}
        {voice.interim && (
          <div className="stream-item kind-user interim">
            <span className="stream-icon">▸</span>
            <div className="stream-text">
              <pre>{voice.interim}</pre>
            </div>
          </div>
        )}
        {items.length === 0 && (
          <p className="empty center">
            Speak, or type below. Vyralis can drive this machine and the browser it already has.
          </p>
        )}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
export function Composer({
  onSend,
  onMicDown,
  onMicUp,
  listening,
  sttSupported,
}: {
  onSend: (text: string) => void
  onMicDown: () => void
  onMicUp: () => void
  listening: boolean
  sttSupported: boolean
}): JSX.Element {
  const [text, setText] = useState('')
  const [showChat, setShowChat] = useState(false)

  const submit = () => {
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText('')
  }

  // Hold space to talk, the way a radio works. Ignored while typing.
  useEffect(() => {
    const isTyping = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      return Boolean(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable))
    }
    const down = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTyping(event)) return
      event.preventDefault()
      onMicDown()
    }
    const up = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTyping(event)) return
      event.preventDefault()
      onMicUp()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [onMicDown, onMicUp])

  return (
    <div className="composer">
      <button
        className={`orb ${listening ? 'orb-live' : ''}`}
        onMouseDown={onMicDown}
        onMouseUp={onMicUp}
        onMouseLeave={() => listening && onMicUp()}
        onTouchStart={(event) => {
          event.preventDefault()
          onMicDown()
        }}
        onTouchEnd={(event) => {
          event.preventDefault()
          onMicUp()
        }}
        title={sttSupported ? 'Hold to speak (or hold space)' : 'Speech recognition unavailable in this browser'}
        disabled={!sttSupported}
      >
        <span className="orb-core" />
      </button>

      <div className="composer-main">
        <button className="chip" onClick={() => setShowChat((value) => !value)}>
          {showChat ? 'HIDE KEYBOARD' : 'TYPE INSTEAD'}
        </button>
        {showChat && (
          <form
            className="composer-form"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <input
              value={text}
              autoFocus
              placeholder="Type a request and press Enter…"
              onChange={(event) => setText(event.target.value)}
            />
            <button className="chip chip-primary" type="submit">
              SEND
            </button>
          </form>
        )}
        {!showChat && <span className="composer-hint">Hold the orb or the space bar to speak</span>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export function ConfirmDialog({
  confirmation,
  onDecide,
}: {
  confirmation: ConfirmView
  onDecide: (approved: boolean) => void
}): JSX.Element {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Approval required</h3>
        <p className="modal-sub">
          {confirmation.agent_name ? `${confirmation.agent_name} wants` : 'An agent wants'} to run{' '}
          <code>{confirmation.tool}</code>
        </p>
        <p className="modal-reason">{confirmation.reason}</p>
        <pre className="modal-args">{JSON.stringify(confirmation.args, null, 2)}</pre>
        <div className="modal-actions">
          <button className="chip chip-danger" onClick={() => onDecide(false)}>
            DENY
          </button>
          <button className="chip chip-primary" onClick={() => onDecide(true)}>
            APPROVE
          </button>
        </div>
        <p className="modal-foot">Nothing runs until you answer. This request times out after 2 minutes.</p>
      </div>
    </div>
  )
}

export function Toasts(): JSX.Element | null {
  const notifications = useVyralis((state) => state.notifications)
  const lastError = useVyralis((state) => state.lastError)
  const [dismissed, setDismissed] = useState<number>(0)

  const visible = notifications.slice(-3)
  if (visible.length === 0 && !lastError) return null

  return (
    <div className="toasts">
      {visible.map((notification, index) => (
        <div className={`toast toast-${notification.severity}`} key={`${notification.ts}-${index}`}>
          {notification.message}
        </div>
      ))}
      {lastError && (
        <div className="toast toast-error" onClick={() => setDismissed(dismissed + 1)}>
          {lastError}
        </div>
      )}
    </div>
  )
}
