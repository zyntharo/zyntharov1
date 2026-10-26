/**
 * The Vyralis interface.
 *
 * Layout: the particle core and wiring graph fill the screen as a live
 * schematic of what the system is doing; the HUD frames it with agents on the
 * left, machine telemetry and model quota on the right, and the transcript and
 * voice orb along the bottom. Voice is the default channel - the text box is
 * behind a button, exactly as specified.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AgentRail, Composer, ConfirmDialog, Stream, Telemetry, Toasts, TopBar } from './components/HudParts'
import { Panels } from './components/Panels'
import { useVoice } from './hooks/voice'
import { api, connect, getToken } from './lib/api'
import { useVyralis, vyralisStore } from './lib/store'
import { Stage } from './three/Stage'

export default function App(): JSX.Element {
  const [panelsOpen, setPanelsOpen] = useState(false)
  const [bootError, setBootError] = useState('')
  const [ready, setReady] = useState(false)

  const connected = useVyralis((state) => state.connected)
  const phase = useVyralis((state) => state.phase)
  const settings = useVyralis((state) => state.settings)
  const confirmation = useVyralis((state) => state.confirmations[0] ?? null)
  const speakingText = useVyralis((state) => state.speakingText)
  const speechHandled = useRef('')
  const voiceEnabled = settings?.voice_enabled ?? true

  // ---- backend session -------------------------------------------------
  useEffect(() => {
    if (!getToken()) {
      // The launcher passes ?token=...; if it is missing the API will reject
      // calls, so say so plainly instead of failing silently.
      setBootError('No session token. Launch Vyralis with `vyralis run` so the interface is opened with its token.')
    }
    const connection = connect()
    const load = async () => {
      try {
        const status = await api.status()
        vyralisStore.setStatus(status)
        vyralisStore.setProviders(status.providers ?? [])
        const loaded = await api.settings()
        vyralisStore.setSettings(loaded)
        setReady(true)
      } catch (error) {
        setBootError(String(error))
      }
    }
    void load()
    return () => connection.close()
  }, [])

  // Poll the slow-moving state; events cover everything that is live.
  useEffect(() => {
    if (!ready) return
    const interval = window.setInterval(() => {
      void api.hardware().then((detail) => vyralisStore.setHardware(detail)).catch(() => undefined)
      void api.tasks().then((payload) => vyralisStore.setTasks(payload.tasks)).catch(() => undefined)
      void api.providers().then((payload) => vyralisStore.setProviders(payload.providers)).catch(() => undefined)
    }, 6000)
    void api.hardware().then((detail) => vyralisStore.setHardware(detail)).catch(() => undefined)
    return () => window.clearInterval(interval)
  }, [ready])

  // ---- voice -----------------------------------------------------------
  const send = useCallback((text: string, channel: 'voice' | 'chat' = 'voice') => {
    void api.sendMessage(text, channel).catch((error) => vyralisStore.setError(String(error)))
  }, [])

  const voice = useVoice({
    enabled: voiceEnabled,
    onTranscript: (text) => send(text, 'voice'),
    onListeningChange: (listening) => vyralisStore.setPhase(listening ? 'listening' : 'idle'),
  })

  // Speak whatever the backend asked the voice channel to say.
  useEffect(() => {
    if (!speakingText || !voiceEnabled) return
    if (speechHandled.current === speakingText) return
    speechHandled.current = speakingText
    voice.speak(speakingText, { onEnd: () => vyralisStore.setPhase('idle') })
  }, [speakingText, voiceEnabled, voice])

  // ---- keyboard --------------------------------------------------------
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (panelsOpen) setPanelsOpen(false)
        else if (voice.speaking) voice.stopSpeaking()
      }
      if (event.key === 'Tab' && event.ctrlKey) {
        event.preventDefault()
        setPanelsOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [panelsOpen, voice])

  const bootProgress = useMemo(() => {
    if (!connected) return 'connecting to the runtime…'
    if (!ready) return 'loading system state…'
    return ''
  }, [connected, ready])

  if (bootError) {
    return (
      <div className="boot">
        <h1>VYRALIS</h1>
        <p className="boot-error">{bootError}</p>
        <p className="hint">
          Start the backend with <code>vyralis run</code>, then open the URL it prints (it includes
          the session token).
        </p>
      </div>
    )
  }

  return (
    <div className="app" data-phase={phase}>
      <Stage />

      <div className="hud">
        <TopBar
          onTogglePanels={() => setPanelsOpen((value) => !value)}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => void api.updateSettings({ voice_enabled: !voiceEnabled })}
        />

        {bootProgress && <div className="boot-progress">{bootProgress}</div>}

        <main className="hud-body">
          <AgentRail />
          <section className="center-column">
            <div className="core-caption">
              <span className="core-caption-name">VYRALIS</span>
              <span className="core-caption-sub">
                {phase === 'idle' ? 'awaiting instruction' : phase}
              </span>
            </div>
          </section>
          <Telemetry />
        </main>

        <footer className="hud-foot">
          <Stream voice={voice} />
          <Composer
            onSend={(text) => send(text, voiceEnabled ? 'voice' : 'chat')}
            onMicDown={() => voice.startListening()}
            onMicUp={() => voice.stopListening()}
            listening={voice.listening}
            sttSupported={voice.sttSupported}
          />
        </footer>
      </div>

      <Panels open={panelsOpen} onClose={() => setPanelsOpen(false)} />

      {confirmation && (
        <ConfirmDialog
          confirmation={confirmation}
          onDecide={(approved) => {
            vyralisStore.setConfirmations(
              vyralisStore.get().confirmations.filter((item) => item.id !== confirmation.id),
            )
            void api.resolveConfirmation(confirmation.id, approved)
          }}
        />
      )}

      <Toasts />
    </div>
  )
}
