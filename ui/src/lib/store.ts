/**
 * The interface state.
 *
 * Every event from the backend is folded into one store object here, so the
 * three renderings of the system - the particle core, the wiring graph and the
 * panels - are always looking at the same truth. Components subscribe with
 * `useVyralis(selector)` and only re-render when their slice changes.
 */

import { useSyncExternalStore } from 'react'
import type {
  AgentNode,
  BusEvent,
  ConfirmView,
  HardwareView,
  MemoryView,
  Notification,
  Phase,
  PluginView,
  ProviderView,
  SkillView,
  StatusPayload,
  StreamItem,
  TaskView,
  ToolView,
  ToolCallView,
  UserSettings,
} from './types'

export interface VyralisState {
  connected: boolean
  status: StatusPayload | null
  settings: UserSettings | null
  phase: Phase
  agents: AgentNode[]
  stream: StreamItem[]
  toolCalls: ToolCallView[]
  skills: SkillView[]
  plugins: PluginView[]
  memories: MemoryView[]
  tasks: TaskView[]
  tools: ToolView[]
  providers: ProviderView[]
  hardware: HardwareView | null
  notifications: Notification[]
  confirmations: ConfirmView[]
  speakingText: string
  listening: boolean
  /** Monotonic counters the renderer watches to trigger effects. */
  pulses: { kind: string; at: number; label: string; strength: number }[]
  memoryPulse: number
  routeSwap: { from?: string; to: string; at: number } | null
  wiringActivity: Record<string, number>
  lastError: string
}

const initialState: VyralisState = {
  connected: false,
  status: null,
  settings: null,
  phase: 'offline',
  agents: [],
  stream: [],
  toolCalls: [],
  skills: [],
  plugins: [],
  memories: [],
  tasks: [],
  tools: [],
  providers: [],
  hardware: null,
  notifications: [],
  confirmations: [],
  speakingText: '',
  listening: false,
  pulses: [],
  memoryPulse: 0,
  routeSwap: null,
  wiringActivity: {},
  lastError: '',
}

const STREAM_LIMIT = 400
const TOOL_LIMIT = 60
const PULSE_LIMIT = 24

let state: VyralisState = initialState
const listeners = new Set<() => void>()

function emit(): void {
  // The store object is replaced immutably for useSyncExternalStore.
  for (const listener of listeners) listener()
}

function set(patch: Partial<VyralisState>): void {
  state = { ...state, ...patch }
  emit()
}

function pushStream(item: Omit<StreamItem, 'id' | 'ts'> & { ts?: number }): void {
  const next: StreamItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: item.ts ?? Date.now() / 1000,
  }
  set({ stream: [...state.stream, next].slice(-STREAM_LIMIT) })
}

function pulse(kind: string, label = '', strength = 1): void {
  set({
    pulses: [...state.pulses, { kind, label, at: Date.now(), strength }].slice(-PULSE_LIMIT),
  })
}

function touchWiring(key: string): void {
  set({ wiringActivity: { ...state.wiringActivity, [key]: Date.now() } })
}

export const vyralisStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  get(): VyralisState {
    return state
  },
  reset(): void {
    state = { ...initialState }
    emit()
  },
  setStatus(status: StatusPayload): void {
    set({ status })
  },
  setSettings(settings: UserSettings): void {
    set({
      settings,
      phase: settings.voice_enabled ? state.phase : 'idle',
    })
  },
  setConnected(connected: boolean): void {
    set({ connected, phase: connected ? (state.phase === 'offline' ? 'idle' : state.phase) : 'offline' })
  },
  setPhase(phase: Phase): void {
    if (state.phase !== phase) set({ phase })
  },
  setError(message: string): void {
    set({ lastError: message })
  },
  setAgents(agents: AgentNode[]): void {
    set({ agents })
  },
  ingestAgents(payload: { agents?: AgentNode[] }): void {
    if (Array.isArray(payload.agents)) set({ agents: payload.agents })
  },
  setSkills(skills: SkillView[]): void {
    set({ skills })
  },
  setPlugins(plugins: PluginView[]): void {
    set({ plugins })
  },
  setMemories(memories: MemoryView[]): void {
    set({ memories })
  },
  setTasks(tasks: TaskView[]): void {
    set({ tasks })
  },
  setTools(tools: ToolView[]): void {
    set({ tools })
  },
  setProviders(providers: ProviderView[]): void {
    set({ providers })
  },
  /** Full hardware detail from the REST endpoint (per-core load, disks, volts). */
  setHardware(detail: any): void {
    const previous = state.hardware
    const sensors = (detail.sensors ?? []) as any[]
    set({
      hardware: {
        cpuPercent: Number(detail.cpu?.percent_total ?? previous?.cpuPercent ?? 0),
        perCore: (detail.cpu?.percent_per_core ?? previous?.perCore ?? []) as number[],
        freqMhz: Number(detail.cpu?.freq_mhz ?? previous?.freqMhz ?? 0),
        memoryPercent: Number(detail.memory?.percent ?? previous?.memoryPercent ?? 0),
        memoryUsedGb: Number(detail.memory?.used_gb ?? previous?.memoryUsedGb ?? 0),
        memoryTotalGb: Number(detail.memory?.total_gb ?? previous?.memoryTotalGb ?? 0),
        disks: ((detail.disks ?? []) as any[])
          .filter((disk) => !disk.io)
          .map((disk) => ({
            mountpoint: String(disk.mountpoint ?? ''),
            free_gb: Number(disk.free_gb ?? 0),
            percent: Number(disk.percent ?? 0),
          })),
        temps: sensors
          .filter((sensor) => sensor.category === 'temperature')
          .map((sensor) => ({
            name: String(sensor.name),
            category: 'temperature',
            value: Number(sensor.value),
            unit: String(sensor.unit ?? 'C'),
            source: String(sensor.source ?? ''),
          })),
        fans: sensors
          .filter((sensor) => sensor.category === 'fan')
          .map((sensor) => ({
            name: String(sensor.name),
            category: 'fan',
            value: Number(sensor.value),
            unit: String(sensor.unit ?? 'RPM'),
            source: String(sensor.source ?? ''),
          })),
        volts: sensors
          .filter((sensor) => sensor.category === 'voltage')
          .map((sensor) => ({
            name: String(sensor.name),
            category: 'voltage',
            value: Number(sensor.value),
            unit: String(sensor.unit ?? 'V'),
            source: String(sensor.source ?? ''),
          })),
        alerts: ((detail.alerts ?? []) as any[]).map((alert) => ({
          severity: String(alert.severity ?? 'warning'),
          message: String(alert.message ?? ''),
          advice: alert.advice as string | undefined,
        })),
        verdict: String(detail.verdict?.verdict ?? previous?.verdict ?? 'unknown'),
        summary: String(detail.summary ?? previous?.summary ?? ''),
        sources: (detail.sources ?? previous?.sources ?? {}) as Record<string, boolean>,
      },
    })
  },
  setConfirmations(confirmations: ConfirmView[]): void {
    set({ confirmations })
  },
  appendStream(item: Omit<StreamItem, 'id' | 'ts'> & { ts?: number }): void {
    pushStream(item)
  },
  clearStream(): void {
    set({ stream: [] })
  },
  notify(notification: Notification): void {
    set({ notifications: [...state.notifications, notification].slice(-50) })
  },
}

/** Fold one bus event into the store. This is the single source of truth. */
export function applyEvent(event: BusEvent): void {
  const payload = event.payload ?? {}
  switch (event.type) {
    case 'agent.thought':
    case 'agent.token': {
      if (event.type === 'agent.token') return // tokens are already coalesced by thoughts
      const kind = (payload.kind as string) === 'error' ? 'toolError' : 'thought'
      vyralisStore.appendStream({
        kind: kind as StreamItem['kind'],
        text: String(payload.text ?? ''),
        agentId: event.agent_id ?? undefined,
        agentName: payload.name as string | undefined,
        role: payload.role as string | undefined,
      })
      break
    }
    case 'agent.spawned': {
      const agent = payload as unknown as AgentNode
      const existing = state.agents.filter((item) => item.id !== agent.id)
      vyralisStore.setAgents([...existing, agent])
      vyralisStore.appendStream({
        kind: 'system',
        text: `${agent.name} joined as ${agent.title ?? agent.role}${payload.parent ? ` under ${payload.parent}` : ''}`,
      })
      pulse('spawn', agent.name)
      break
    }
    case 'agent.state': {
      vyralisStore.setAgents(
        state.agents.map((agent) =>
          agent.id === payload.id ? { ...agent, status: String(payload.status) } : agent,
        ),
      )
      const busy = String(payload.status) === 'thinking' || String(payload.status) === 'acting'
      if (busy && state.phase !== 'speaking') vyralisStore.setPhase('working')
      if (String(payload.status) === 'idle' && state.agents.every((a) => a.status === 'idle')) {
        if (state.phase === 'working') vyralisStore.setPhase('idle')
      }
      break
    }
    case 'agent.retired': {
      vyralisStore.setAgents(state.agents.filter((agent) => agent.id !== payload.id))
      vyralisStore.appendStream({ kind: 'system', text: `${payload.name} retired` })
      break
    }
    case 'agent.report': {
      const text = String(payload.report ?? '')
      if (text) {
        vyralisStore.appendStream({
          kind: 'assistant',
          text,
          agentId: event.agent_id ?? undefined,
          agentName: payload.name as string | undefined,
          role: payload.role as string | undefined,
        })
      }
      vyralisStore.setAgents(
        state.agents.map((agent) =>
          agent.id === payload.id ? { ...agent, status: 'idle', model: agent.model } : agent,
        ),
      )
      if (!payload.kind) vyralisStore.setPhase('idle')
      break
    }
    case 'team.formed': {
      vyralisStore.appendStream({
        kind: 'system',
        text: `Team "${payload.name}" formed with ${payload.size} agents, led by ${payload.head}`,
      })
      pulse('team', String(payload.name ?? ''), 1.4)
      break
    }
    case 'plan': {
      vyralisStore.appendStream({
        kind: 'system',
        text: `▸ ${payload.title}${payload.agent ? ` → ${payload.agent}` : ''}`,
      })
      pulse('plan', String(payload.title ?? ''), 0.6)
      break
    }
    case 'tool.call': {
      const record: ToolCallView = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tool: String(payload.tool),
        agentName: state.agents.find((agent) => agent.id === event.agent_id)?.name,
        running: true,
        ts: Date.now() / 1000,
      }
      set({ toolCalls: [...state.toolCalls, record].slice(-TOOL_LIMIT) })
      pulse('tool', record.tool, 1)
      touchWiring(String(payload.category ?? record.tool.split('.')[0]))
      break
    }
    case 'tool.result': {
      const updated = [...state.toolCalls]
      for (let index = updated.length - 1; index >= 0; index -= 1) {
        if (updated[index].tool === payload.tool && updated[index].running) {
          updated[index] = {
            ...updated[index],
            running: false,
            ok: Boolean(payload.ok),
            durationMs: Number(payload.duration_ms ?? 0),
            error: String(payload.error ?? ''),
          }
          break
        }
      }
      set({ toolCalls: updated })
      touchWiring(String(payload.tool).split('.')[0])
      break
    }
    case 'tool.denied': {
      vyralisStore.appendStream({
        kind: 'alert',
        text: `Blocked ${payload.tool}: ${payload.reason}`,
      })
      break
    }
    case 'permission.request': {
      vyralisStore.setConfirmations([
        ...state.confirmations,
        {
          id: String(payload.id),
          tool: String(payload.tool),
          args: (payload.args ?? {}) as Record<string, unknown>,
          reason: String(payload.reason ?? ''),
          agent_name: payload.agent_name as string | undefined,
        },
      ])
      vyralisStore.setPhase('alert')
      break
    }
    case 'permission.result': {
      vyralisStore.setConfirmations(
        state.confirmations.filter((item) => item.id !== payload.id),
      )
      vyralisStore.setPhase('working')
      break
    }
    case 'model.selected': {
      vyralisStore.setAgents(
        state.agents.map((agent) =>
          agent.id === event.agent_id
            ? { ...agent, model: String(payload.model), provider_id: String(payload.provider_id) }
            : agent,
        ),
      )
      touchWiring(String(payload.provider_id ?? 'model'))
      break
    }
    case 'provider.failover': {
      const to = payload.to?.model ? String(payload.to.model) : String(payload.model ?? 'unknown')
      set({ routeSwap: { to, at: Date.now() } })
      vyralisStore.appendStream({
        kind: 'quota',
        text: `Provider failover → ${to}${payload.reason ? ` (${String(payload.reason).slice(0, 120)})` : ''}`,
      })
      pulse('failover', to, 1.6)
      break
    }
    case 'quota.update': {
      const provider = payload as unknown as ProviderView
      const existing = state.providers.filter((item) => item.id !== provider.id)
      vyralisStore.setProviders([...existing, provider])
      touchWiring('quota')
      break
    }
    case 'quota.event': {
      if (payload.kind === 'manager_report') {
        const changes = (payload.changes ?? []) as string[]
        for (const change of changes) {
          vyralisStore.appendStream({ kind: 'quota', text: `Overwatch: ${change}` })
        }
      } else if (payload.message) {
        vyralisStore.appendStream({
          kind: 'quota',
          text: `${String(payload.severity ?? 'notice').toUpperCase()}: ${payload.message}`,
        })
      }
      break
    }
    case 'memory.write': {
      set({ memoryPulse: state.memoryPulse + 1 })
      pulse('memory', String(payload.kind ?? ''), 0.8)
      break
    }
    case 'hardware.sample': {
      const previous = state.hardware
      const temps = ((payload.temps ?? []) as any[]).map((item) => ({
        name: String(item.name),
        category: 'temperature',
        value: Number(item.value),
        unit: 'C',
        source: 'lhm',
      }))
      const fans = ((payload.fans ?? []) as any[]).map((item) => ({
        name: String(item.name),
        category: 'fan',
        value: Number(item.value),
        unit: 'RPM',
        source: 'lhm',
      }))
      set({
        hardware: {
          cpuPercent: Number(payload.cpu_percent ?? 0),
          perCore: previous?.perCore ?? [],
          freqMhz: previous?.freqMhz ?? 0,
          memoryPercent: Number(payload.memory_percent ?? 0),
          memoryUsedGb: previous?.memoryUsedGb ?? 0,
          memoryTotalGb: previous?.memoryTotalGb ?? 0,
          disks: previous?.disks ?? [],
          temps: temps.length ? temps : (previous?.temps ?? []),
          fans: fans.length ? fans : (previous?.fans ?? []),
          volts: previous?.volts ?? [],
          alerts: ((payload.alerts ?? []) as any[]).map((item) => ({
            severity: String(item.severity),
            message: String(item.message),
            advice: item.advice as string | undefined,
          })),
          verdict: String(payload.verdict ?? previous?.verdict ?? 'unknown'),
          summary: String(payload.summary ?? previous?.summary ?? ''),
          sources: (previous?.sources ?? {}) as Record<string, boolean>,
        },
      })
      break
    }
    case 'hardware.alert': {
      const severity = String(payload.severity ?? 'warning')
      vyralisStore.appendStream({
        kind: 'alert',
        text: `${severity === 'critical' ? 'CRITICAL' : 'WARNING'}: ${payload.message}${payload.advice ? ` — ${payload.advice}` : ''}`,
      })
      vyralisStore.notify({ message: String(payload.message), severity, ts: Date.now() / 1000 })
      pulse('alert', String(payload.sensor ?? ''), severity === 'critical' ? 2 : 1.2)
      if (severity === 'critical') vyralisStore.setPhase('alert')
      break
    }
    case 'plugin.installed':
    case 'plugin.loaded': {
      const plugin = payload as unknown as PluginView
      const others = state.plugins.filter((item) => item.id !== plugin.id)
      vyralisStore.setPlugins([...others, plugin])
      if (event.type === 'plugin.installed' && payload.id) {
        vyralisStore.appendStream({
          kind: 'system',
          text: `Capability installed: ${plugin.name ?? payload.id}${plugin.tools?.length ? ` (${plugin.tools.join(', ')})` : ''}`,
        })
        pulse('plugin', String(plugin.name ?? payload.id), 1.5)
      }
      break
    }
    case 'plugin.error': {
      vyralisStore.appendStream({ kind: 'alert', text: `Plugin ${payload.id} failed: ${payload.error}` })
      break
    }
    case 'voice.speak.start': {
      vyralisStore.setPhase('speaking')
      set({ speakingText: String(payload.text ?? '') })
      break
    }
    case 'voice.speak.end': {
      set({ speakingText: '' })
      if (state.phase === 'speaking') vyralisStore.setPhase('idle')
      break
    }
    case 'voice.listen.start': {
      set({ listening: true })
      vyralisStore.setPhase('listening')
      break
    }
    case 'voice.listen.end': {
      set({ listening: false })
      break
    }
    case 'user.input': {
      vyralisStore.appendStream({ kind: 'user', text: String(payload.text ?? '') })
      vyralisStore.setPhase('thinking')
      break
    }
    case 'browser.tab':
    case 'browser.session':
    case 'whatsapp.state': {
      touchWiring('browser')
      break
    }
    case 'error': {
      const message = String(payload.message ?? payload.error ?? 'unknown error')
      vyralisStore.appendStream({ kind: 'alert', text: message })
      vyralisStore.setError(message)
      break
    }
    case 'log': {
      const level = String(payload.level ?? 'INFO')
      if (level === 'WARNING' || level === 'ERROR') {
        vyralisStore.appendStream({ kind: 'system', text: `${level}: ${payload.message}` })
      }
      break
    }
    default:
      break
  }
}

export function useVyralis<T>(selector: (state: VyralisState) => T): T {
  return useSyncExternalStore(
    vyralisStore.subscribe,
    () => selector(state),
    () => selector(initialState),
  )
}
