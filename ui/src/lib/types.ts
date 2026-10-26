/** Shared types mirroring the backend's event and REST payloads. */

export type Phase =
  | 'offline'
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'working'
  | 'alert'

export interface AgentNode {
  id: string
  name: string
  role: string
  title?: string
  rank: number
  parent_id?: string | null
  team_id?: string | null
  status: string
  mandate?: string
  model?: string | null
  provider_id?: string | null
  color?: string
  grant?: string[]
  budget?: Record<string, unknown>
}

export interface StreamItem {
  id: string
  kind: 'user' | 'assistant' | 'thought' | 'tool' | 'toolError' | 'alert' | 'system' | 'quota'
  text: string
  agentId?: string
  agentName?: string
  role?: string
  tool?: string
  ok?: boolean
  detail?: string
  durationMs?: number
  ts: number
}

export interface ToolCallView {
  id: string
  tool: string
  agentName?: string
  ok?: boolean
  running: boolean
  durationMs?: number
  error?: string
  ts: number
}

export interface ProviderView {
  id: string
  label: string
  model: string
  tier: string
  enabled: boolean
  has_key: boolean
  base_url?: string
  requests_minute: number
  requests_day: number
  tokens_minute: number
  tokens_day: number
  rpm: number
  rpd: number
  tpm: number
  tpd: number
  cooling: boolean
  cooldown_seconds: number
  failures: number
  last_error?: string
  allowed?: boolean
  blocked_reason?: string
  supports_tools?: boolean
  supports_vision?: boolean
  supports_audio?: boolean
  audio_model?: string
  env_key?: string
}

export interface SensorView {
  name: string
  category: string
  value: number
  unit: string
  source: string
}

export interface HardwareView {
  cpuPercent: number
  perCore: number[]
  freqMhz: number
  memoryPercent: number
  memoryUsedGb: number
  memoryTotalGb: number
  disks: { mountpoint: string; free_gb: number; percent: number }[]
  temps: SensorView[]
  fans: SensorView[]
  volts: SensorView[]
  alerts: { severity: string; message: string; advice?: string }[]
  verdict: string
  summary: string
  sources: Record<string, boolean>
}

export interface SkillView {
  id: string
  name: string
  description: string
  step_count: number
  uses: number
  successes: number
  failures: number
  reliability: number
  stale: boolean
  parameters: Record<string, { type?: string; description?: string; example?: string }>
}

export interface PluginView {
  id: string
  name: string
  version?: string
  description?: string
  tools?: string[]
  ok?: boolean
  error?: string
  generated?: boolean
  trusted?: boolean
}

export interface MemoryView {
  id: string
  agent_id?: string | null
  kind: string
  scope: string
  content: string
  importance?: number
  created_at?: number
  access_count?: number
  tags?: string[]
}

export interface TaskView {
  id: string
  title: string
  status: string
  agent_id?: string | null
  parent_id?: string | null
  result?: string
  updated_at?: number
}

export interface ToolView {
  name: string
  description: string
  category: string
  permission: string
}

export interface ConfirmView {
  id: string
  tool: string
  args: Record<string, unknown>
  reason: string
  agent_name?: string
}

export interface StatusPayload {
  info: { version: string; codename: string; tagline: string; uptime_s: number; platform: string }
  agents: { agents: number; by_role: Record<string, number>; running: number; teams: number }
  model: { open_routes: number; by_tier: Record<string, number>; configured: number }
  tools: { count: number; categories: Record<string, number> }
  services: string[]
  memory: Record<string, number>
  voice: { enabled: boolean; engine: string }
  permissions: { mode: string; fs_allowlist: string[]; require_confirmation_for: string[] }
  providers: ProviderView[]
  skills: number
}

export interface Notification {
  message: string
  severity: string
  ts: number
}

export interface UserSettings {
  permission_mode: string
  voice_enabled: boolean
  voice_engine: string
  voice_name: string
  input_mode: string
  browser_channel: string
  browser_headless: boolean
  max_subagents: number
  max_parallel_tools: number
  gui_particle_count: number
  gui_show_wiring: boolean
  gui_reduced_motion: boolean
  require_confirmation_for: string[]
  fs_allowlist: string[]
  hardware: Record<string, number>
}

export interface BusEvent {
  type: string
  payload: Record<string, any>
  agent_id?: string | null
  task_id?: string | null
  ts: number
  seq: number
}
