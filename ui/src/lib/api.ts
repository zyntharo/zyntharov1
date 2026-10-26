/** REST helpers and the live WebSocket connection to the backend. */

import { applyEvent, vyralisStore } from './store'
import type {
  BusEvent,
  ConfirmView,
  MemoryView,
  PluginView,
  ProviderView,
  SkillView,
  StatusPayload,
  TaskView,
  ToolView,
  UserSettings,
} from './types'

const TOKEN_KEY = 'vyralis.token'

/** The token is passed by the launcher as ?token=..., or remembered locally. */
export function resolveToken(): string {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('token')
  if (fromUrl) {
    window.localStorage.setItem(TOKEN_KEY, fromUrl)
    return fromUrl
  }
  return window.localStorage.getItem(TOKEN_KEY) ?? ''
}

let token = resolveToken()

export function getToken(): string {
  return token
}

function headers(): HeadersInit {
  const base: Record<string, string> = { 'content-type': 'application/json' }
  if (token) base['x-vyralis-token'] = token
  return base
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  })
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch {
      /* body was not JSON */
    }
    throw new Error(detail)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  status: () => request<StatusPayload>('/api/status'),
  tools: () => request<{ tools: ToolView[] }>('/api/tools'),
  skills: () => request<{ skills: SkillView[] }>('/api/skills'),
  plugins: () => request<{ plugins: PluginView[] }>('/api/plugins'),
  tasks: () => request<{ tasks: TaskView[] }>('/api/tasks'),
  memory: (query = '') =>
    request<{ memories: MemoryView[] }>(`/api/memory?limit=80${query ? `&query=${encodeURIComponent(query)}` : ''}`),
  providers: () => request<{ providers: ProviderView[] }>('/api/providers'),
  confirmations: () => request<{ pending: ConfirmView[] }>('/api/confirmations'),
  settings: () => request<UserSettings>('/api/settings'),
  probe: () => request<{ missing_setup: string[] }>('/api/config/probe'),

  sendMessage: (text: string, channel: 'voice' | 'chat' = 'chat') =>
    request<{ accepted: boolean }>('/api/message', {
      method: 'POST',
      body: JSON.stringify({ text, channel, background: true }),
    }),

  stop: () => request<{ cancelled: number }>('/api/stop', { method: 'POST' }),

  resolveConfirmation: (id: string, approved: boolean) =>
    request<{ approved: boolean }>(`/api/confirmations/${id}`, {
      method: 'POST',
      body: JSON.stringify({ approved }),
    }),

  speak: (text: string) =>
    request<{ spoken: boolean }>('/api/speech', { method: 'POST', body: JSON.stringify({ text }) }),

  updateSettings: (patch: Record<string, unknown>) =>
    request<{ changed: string[]; settings: UserSettings }>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  addProvider: (payload: Record<string, unknown>) =>
    request<{ added: string }>('/api/providers', { method: 'POST', body: JSON.stringify(payload) }),

  updateProvider: (id: string, patch: Record<string, unknown>) =>
    request<{ updated: string }>(`/api/providers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  deleteProvider: (id: string) =>
    request<{ removed: string }>(`/api/providers/${id}`, { method: 'DELETE' }),

  testProvider: (id: string) =>
    request<{ ok: boolean; reply?: string; error?: string }>(`/api/providers/${id}/test`, { method: 'POST' }),

  providerModels: (id: string) =>
    request<{ models: string[] }>(`/api/providers/${id}/models`, { method: 'POST' }),

  hardware: () => request<any>('/api/hardware?processes=6&history=true'),

  retireAgent: (id: string) =>
    request<{ retired: boolean }>(`/api/agents/${id}/retire`, { method: 'POST' }),

  runSkill: (id: string, inputs: Record<string, unknown>) =>
    request<any>(`/api/skills/${id}/run`, { method: 'POST', body: JSON.stringify({ inputs }) }),

  forgetSkill: (id: string) => request<{ forgotten: boolean }>(`/api/skills/${id}`, { method: 'DELETE' }),
  forgetMemory: (id: string) => request<{ forgotten: string }>(`/api/memory/${id}`, { method: 'DELETE' }),
  reloadPlugin: (id: string) => request<any>(`/api/plugins/${id}/reload`, { method: 'POST' }),
  uninstallPlugin: (id: string) => request<any>(`/api/plugins/${id}`, { method: 'DELETE' }),
}

export interface ConnectionHandle {
  close: () => void
  send: (type: string, payload: Record<string, unknown>) => void
}

/**
 * Open the live channel.
 *
 * Reconnects with backoff, and replays nothing on reconnection - the store is
 * already consistent, and the backend sends a fresh `hello` with full status.
 */
export function connect(): ConnectionHandle {
  let socket: WebSocket | null = null
  let closed = false
  let attempt = 0
  let timer: number | undefined

  const open = (): void => {
    if (closed) return
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${scheme}://${window.location.host}/ws${token ? `?token=${encodeURIComponent(token)}` : ''}`
    socket = new WebSocket(url)

    socket.onopen = () => {
      attempt = 0
      vyralisStore.setConnected(true)
    }

    socket.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data) as BusEvent & { type: string; payload: any }
        if (parsed.type === 'hello') {
          if (parsed.payload?.status) vyralisStore.setStatus(parsed.payload.status)
          if (parsed.payload?.settings) vyralisStore.setSettings(parsed.payload.settings)
          if (parsed.payload?.status?.providers) vyralisStore.setProviders(parsed.payload.status.providers)
          return
        }
        if (parsed.type === 'probe') {
          vyralisStore.setStatus(parsed.payload as StatusPayload)
          return
        }
        applyEvent(parsed as BusEvent)
      } catch {
        /* ignore malformed frames */
      }
    }

    socket.onclose = () => {
      vyralisStore.setConnected(false)
      if (closed) return
      attempt += 1
      const delay = Math.min(8000, 400 * 2 ** Math.min(attempt, 5))
      timer = window.setTimeout(open, delay)
    }

    socket.onerror = () => {
      socket?.close()
    }
  }

  open()

  return {
    close: () => {
      closed = true
      if (timer) window.clearTimeout(timer)
      socket?.close()
    },
    send: (type, payload) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, payload }))
      }
    },
  }
}
