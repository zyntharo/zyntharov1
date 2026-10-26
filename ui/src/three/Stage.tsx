/**
 * The stage: one renderer, one scene, one frame loop for the whole visual.
 *
 * It is the bridge between the store and the two visual systems. Everything
 * that moves on screen is a response to a real event - a tool call, a spawn, a
 * memory write, a hardware alert - never a decorative animation on a timer.
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { useVyralis } from '../lib/store'
import type { AgentNode } from '../lib/types'
import { CoreSystem, type CoreShape } from './core'
import { WiringSystem } from './wiring'

/** Shape per phase: the core settles into the form that matches the work. */
const SHAPE_BY_PHASE: Record<string, CoreShape> = {
  offline: 'sphere',
  idle: 'sphere',
  listening: 'torus',
  thinking: 'vortex',
  working: 'grid',
  speaking: 'sphere',
  alert: 'cube',
}

/** Category that best matches each pulse kind. */
const PULSE_TARGET: Record<string, string> = {
  tool: '',
  spawn: 'agents',
  team: 'agents',
  plan: 'agents',
  memory: '',
  plugin: 'plugins',
  failover: 'quota',
  alert: 'hardware',
}

export function Stage(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<CoreSystem | null>(null)
  const wiringRef = useRef<WiringSystem | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  const particleCount = useVyralis(
    (state) => state.settings?.gui_particle_count ?? 18000,
  )
  const reducedMotion = useVyralis((state) => state.settings?.gui_reduced_motion ?? false)
  const showWiring = useVyralis((state) => state.settings?.gui_show_wiring ?? true)
  const phase = useVyralis((state) => state.phase)
  const agents = useVyralis((state) => state.agents)
  const categories = useVyralis((state) =>
    Object.keys(state.status?.tools.categories ?? {}).sort(),
  )
  const pulses = useVyralis((state) => state.pulses)
  const memoryPulse = useVyralis((state) => state.memoryPulse)
  const toolCalls = useVyralis((state) => state.toolCalls)
  const routeSwap = useVyralis((state) => state.routeSwap)

  // ---- renderer + systems, created once --------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100)
    camera.position.set(0, 0.5, 4.95)

    const core = new CoreSystem(scene, particleCount, reducedMotion)
    const wiring = new WiringSystem(scene)
    coreRef.current = core
    wiringRef.current = wiring

    const resize = (): void => {
      const parent = canvas.parentElement
      if (!parent) return
      const width = parent.clientWidth
      const height = parent.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    if (canvas.parentElement) observer.observe(canvas.parentElement)
    resize()

    let frame = 0
    const clock = new THREE.Clock()
    let voiceEnvelope = 0

    const animate = (): void => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const time = clock.elapsedTime

      // The browser's speech synthesiser exposes no amplitude, so the metre is
      // a synthetic envelope gated by the real speaking state. It starts and
      // stops with actual speech, which is what makes it read as honest.
      const speaking = document.body.dataset.speaking === '1'
      const target = speaking
        ? 0.45 +
          0.4 * Math.abs(Math.sin(time * 6.2)) * (0.6 + 0.4 * Math.abs(Math.sin(time * 2.1)))
        : 0
      voiceEnvelope += (target - voiceEnvelope) * Math.min(1, delta * 9)
      core.setTalking(voiceEnvelope)

      core.update(delta, time)
      wiring.update(delta, time)

      // Camera drift keyed to speech, so the core feels like it is leaning in.
      camera.position.x = Math.sin(time * 0.13) * 0.2
      camera.position.y = 0.5 + Math.sin(time * 0.17) * 0.12
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      core.dispose()
      wiring.dispose()
      renderer.dispose()
      coreRef.current = null
      wiringRef.current = null
      rendererRef.current = null
    }
    // The systems are intentionally created once; later settings changes are
    // handled by the small effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- live state -> visuals -------------------------------------------
  useEffect(() => {
    coreRef.current?.setPhase(phase)
    const shape = SHAPE_BY_PHASE[phase] ?? 'sphere'
    coreRef.current?.setShape(shape)
  }, [phase])

  useEffect(() => {
    coreRef.current?.setAttention(agents.length)
    wiringRef.current?.setAgents(agents as AgentNode[])
    for (const agent of agents) {
      wiringRef.current?.touch(agent.name)
      wiringRef.current?.send(agent.role === 'main' ? 'main' : agent.name, 1)
    }
  }, [agents])

  useEffect(() => {
    wiringRef.current?.setCategories(categories)
  }, [categories])

  useEffect(() => {
    wiringRef.current?.setVisible(showWiring)
  }, [showWiring])

  // Each pulse is consumed exactly once: the array is append-only and we track
  // how many we have already rendered.
  const seenPulses = useRef(0)
  useEffect(() => {
    const fresh = pulses.slice(seenPulses.current)
    seenPulses.current = pulses.length
    for (const pulse of fresh) {
      coreRef.current?.pulse(pulse.kind, pulse.strength)
      const target = pulse.kind === 'tool' ? pulse.label.split('.')[0] : PULSE_TARGET[pulse.kind]
      if (target) wiringRef.current?.send(target, pulse.kind === 'alert' ? 3 : 1)
      wiringRef.current?.touch(target || pulse.label)
    }
  }, [pulses])

  const seenMemory = useRef(0)
  useEffect(() => {
    if (memoryPulse > seenMemory.current && seenMemory.current !== 0) {
      wiringRef.current?.memoryFilament()
    }
    seenMemory.current = memoryPulse
  }, [memoryPulse])

  const seenTools = useRef(0)
  useEffect(() => {
    const fresh = toolCalls.slice(seenTools.current)
    seenTools.current = toolCalls.length
    for (const call of fresh) {
      wiringRef.current?.send(call.tool.split('.')[0], 1)
    }
  }, [toolCalls])

  useEffect(() => {
    if (routeSwap) wiringRef.current?.send('quota', 4)
  }, [routeSwap])

  return <canvas ref={canvasRef} className="stage-canvas" aria-hidden="true" />
}
