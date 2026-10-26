/**
 * Voice in and voice out.
 *
 * Voice is the default channel, so this hook owns push-to-talk (hold space, or
 * hold the orb) and speech synthesis. It uses the browser engines, which means
 * zero install size and instant start; the backend's `local` and `provider`
 * engines are used only for offline listening and for rendering voice notes.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

function getRecognitionConstructor(): (new () => SpeechRecognitionLike) | null {
  const scope = window as unknown as Record<string, unknown>
  return (scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionLike)
    | null
}

export interface VoiceHandle {
  sttSupported: boolean
  ttsSupported: boolean
  listening: boolean
  speaking: boolean
  interim: string
  startListening: () => void
  stopListening: () => void
  speak: (text: string, options?: { onEnd?: () => void }) => void
  stopSpeaking: () => void
}

export function useVoice(options: {
  enabled: boolean
  language?: string
  onTranscript: (text: string) => void
  onListeningChange?: (listening: boolean) => void
}): VoiceHandle {
  const { enabled, onTranscript, onListeningChange } = options
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalRef = useRef('')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [interim, setInterim] = useState('')

  const sttSupported = typeof window !== 'undefined' && getRecognitionConstructor() !== null
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
    onListeningChange?.(false)
  }, [onListeningChange])

  const startListening = useCallback(() => {
    if (!enabled || !sttSupported) return
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
    const Constructor = getRecognitionConstructor()
    if (!Constructor) return
    const recognition = new Constructor()
    recognition.lang = options.language ?? navigator.language ?? 'en-US'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    finalRef.current = ''

    recognition.onstart = () => {
      setListening(true)
      onListeningChange?.(true)
    }
    recognition.onresult = (event: any) => {
      let pending = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const text = String(result[0]?.transcript ?? '')
        if (result.isFinal) finalRef.current += text
        else pending += text
      }
      setInterim(pending)
      if (finalRef.current.trim()) {
        const spoken = finalRef.current.trim()
        finalRef.current = ''
        setInterim('')
        onTranscript(spoken)
      }
    }
    recognition.onerror = () => {
      setListening(false)
      onListeningChange?.(false)
    }
    recognition.onend = () => {
      setListening(false)
      onListeningChange?.(false)
      if (finalRef.current.trim()) {
        const spoken = finalRef.current.trim()
        finalRef.current = ''
        onTranscript(spoken)
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      setListening(false)
    }
  }, [enabled, sttSupported, onTranscript, onListeningChange, options.language])

  const stopSpeaking = useCallback(() => {
    if (!ttsSupported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
    document.body.dataset.speaking = '0'
  }, [ttsSupported])

  const speak = useCallback(
    (text: string, speakOptions?: { onEnd?: () => void }) => {
      if (!ttsSupported || !text.trim()) {
        speakOptions?.onEnd?.()
        return
      }
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const preferred = window.localStorage.getItem('vyralis.voice') ?? ''
      const voices = window.speechSynthesis.getVoices()
      const match =
        voices.find((voice) => preferred && voice.name === preferred) ??
        voices.find((voice) => /google uk english male|daniel|alex|en-GB/i.test(voice.name)) ??
        voices.find((voice) => voice.lang.startsWith('en'))
      if (match) utterance.voice = match
      utterance.rate = 1.02
      utterance.pitch = 0.95
      utterance.onstart = () => {
        setSpeaking(true)
        document.body.dataset.speaking = '1'
      }
      utterance.onend = () => {
        setSpeaking(false)
        document.body.dataset.speaking = '0'
        speakOptions?.onEnd?.()
      }
      utterance.onerror = () => {
        setSpeaking(false)
        document.body.dataset.speaking = '0'
        speakOptions?.onEnd?.()
      }
      window.speechSynthesis.speak(utterance)
    },
    [ttsSupported],
  )

  // Warm the voice list: some browsers populate it asynchronously.
  useEffect(() => {
    if (!ttsSupported) return
    window.speechSynthesis.getVoices()
    const timer = window.setTimeout(() => window.speechSynthesis.getVoices(), 400)
    return () => window.clearTimeout(timer)
  }, [ttsSupported])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      if (ttsSupported) window.speechSynthesis.cancel()
      document.body.dataset.speaking = '0'
    }
  }, [ttsSupported])

  return {
    sttSupported,
    ttsSupported,
    listening,
    speaking,
    interim,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  }
}
