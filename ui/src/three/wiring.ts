/**
 * The wiring graph.
 *
 * A live schematic around the core: one ring of agent nodes, one ring of
 * capability nodes (the same categories the backend groups tools into), and
 * curved conductors between them. Wires carry visible packets whenever work
 * flows, they brighten for a couple of seconds after any event that touches
 * them, and they dim again - so the picture is always telling the truth about
 * what the system is doing right now.
 *
 * Everything here is data-driven from the store: agents appear when they are
 * spawned, wires light up from real tool calls, and a memory write throws a
 * filament across the core.
 */

import * as THREE from 'three'
import type { AgentNode } from '../lib/types'

const AGENT_RADIUS = 1.66
const CATEGORY_RADIUS = 2.46
const CURVE_SEGMENTS = 10
const ACTIVITY_DECAY = 2.4 // seconds for a wire to return to idle brightness

const LINE_VERTEX = /* glsl */ `
  attribute float aT;
  attribute float aAlpha;
  attribute float aSpeed;
  attribute vec3  aColor;

  uniform float uTime;

  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    // A moving dash pattern, plus a brighter head travelling the whole wire.
    float dash = fract(aT * 9.0 - uTime * aSpeed);
    float dashes = smoothstep(0.62, 0.38, dash);
    float head = exp(-pow(fract(aT - uTime * aSpeed * 0.18) * 6.0 - 3.0, 2.0));

    vAlpha = aAlpha * (0.35 + 0.65 * dashes) + aAlpha * head * 0.9;
    vColor = aColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0;
  }
`

const LINE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

interface Link {
  key: string
  owner: string
  color: THREE.Color
  start: THREE.Vector3
  end: THREE.Vector3
  control: THREE.Vector3
  tStart: number
  tEnd: number
  speed: number
  base: number
  activity: number
}

interface Packet {
  link: number
  progress: number
  speed: number
}

function makeLabelSprite(text: string, color: string, scale = 0.42): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const padding = 12
  const fontSize = 42
  const context = canvas.getContext('2d')
  if (context) {
    context.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
    const width = Math.ceil(context.measureText(text).width) + padding * 2
    canvas.width = Math.max(64, width)
    canvas.height = fontSize + padding * 2
    const drawing = canvas.getContext('2d')
    if (drawing) {
      drawing.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
      drawing.fillStyle = color
      drawing.textBaseline = 'middle'
      drawing.fillText(text, padding, canvas.height / 2)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.9,
  })
  const sprite = new THREE.Sprite(material)
  const aspect = canvas.width / Math.max(1, canvas.height)
  sprite.scale.set(scale * aspect * 2.2, scale * 1.2, 1)
  return sprite
}

export class WiringSystem {
  readonly group: THREE.Group

  private lineGeometry = new THREE.BufferGeometry()
  private lineMaterial: THREE.ShaderMaterial
  private lines: THREE.Mesh
  private packetGeometry = new THREE.BufferGeometry()
  private packetMaterial: THREE.PointsMaterial
  private packets: THREE.Points
  private packetState: Packet[] = []
  private links: Link[] = []
  private agentNodes: { id: string; key: string; position: THREE.Vector3; activity: number }[] = []
  private categoryNodes: { key: string; position: THREE.Vector3; activity: number }[] = []
  private sprites: THREE.Sprite[] = []
  private filaments: { geometry: THREE.BufferGeometry; material: THREE.LineBasicMaterial; born: number }[] = []
  private ringGroup = new THREE.Group()
  private maxPackets = 140
  private dirty = true

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group()
    scene.add(this.group)
    this.group.add(this.ringGroup)

    this.lineMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: LINE_VERTEX,
      fragmentShader: LINE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.lines = new THREE.Mesh(this.lineGeometry, this.lineMaterial)
    this.lines.frustumCulled = false
    this.group.add(this.lines)

    this.packetGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this.maxPackets * 3), 3),
    )
    this.packetMaterial = new THREE.PointsMaterial({
      color: 0xdff6ff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.packets = new THREE.Points(this.packetGeometry, this.packetMaterial)
    this.packets.frustumCulled = false
    this.group.add(this.packets)

    this.buildRings()
  }

  // -- static furniture ------------------------------------------------
  private buildRings(): void {
    const make = (radius: number, color: number, opacity: number): THREE.LineLoop => {
      const points: THREE.Vector3[] = []
      const segments = 180
      for (let index = 0; index < segments; index += 1) {
        const angle = (index / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      return new THREE.LineLoop(geometry, material)
    }
    this.ringGroup.add(make(AGENT_RADIUS, 0x1d4a6b, 0.5))
    this.ringGroup.add(make(CATEGORY_RADIUS, 0x143a55, 0.35))
    this.ringGroup.rotation.x = -Math.PI / 2
  }

  // -- layout ----------------------------------------------------------
  private layoutAgents(agents: AgentNode[]): void {
    this.agentNodes = agents.map((agent, index) => {
      const count = Math.max(1, agents.length)
      const angle = (index / count) * Math.PI * 2 + Math.PI / 2
      const radius = AGENT_RADIUS + (index % 2 === 0 ? 0 : 0.1)
      return {
        id: agent.id,
        key: `${agent.name}|${agent.id}|${agent.role}`,
        position: new THREE.Vector3(Math.cos(angle) * radius, 0.16, Math.sin(angle) * radius),
        activity: 1,
      }
    })
  }

  private layoutCategories(categories: string[]): void {
    this.categoryNodes = categories.map((category, index) => {
      const count = Math.max(1, categories.length)
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2
      return {
        key: category,
        position: new THREE.Vector3(
          Math.cos(angle) * CATEGORY_RADIUS,
          -0.34,
          Math.sin(angle) * CATEGORY_RADIUS,
        ),
        activity: 0.35,
      }
    })
  }

  private rebuild(): void {
    this.links = []
    const origin = new THREE.Vector3(0, 0, 0)

    const palette = ['#31E6FF', '#5B7CFF', '#7C5CFF', '#2ED573', '#F5A524', '#FF6B9D', '#00C2FF']
    this.agentNodes.forEach((node, index) => {
      this.links.push(
        this.makeLink(
          `${node.key}`,
          node.key,
          new THREE.Color(palette[index % palette.length]),
          origin,
          node.position,
          0.5,
        ),
      )
    })

    this.categoryNodes.forEach((node, index) => {
      this.links.push(
        this.makeLink(
          node.key,
          node.key,
          new THREE.Color(palette[(index + 3) % palette.length]).multiplyScalar(0.9),
          origin,
          node.position,
          0.34,
        ),
      )
    })

    // Two inter-agent conduits make the mesh read as a graph, not a starburst.
    for (let index = 0; index + 1 < this.agentNodes.length; index += 2) {
      const from = this.agentNodes[index]
      const to = this.agentNodes[index + 1]
      this.links.push(
        this.makeLink(
          `${from.key}->${to.key}`,
          `${from.key}|${to.key}`,
          new THREE.Color('#3d7ea6'),
          from.position,
          to.position,
          0.22,
        ),
      )
    }

    this.writeLineGeometry()
    this.rebuildLabels()
    this.dirty = false
  }

  private makeLink(
    key: string,
    owner: string,
    color: THREE.Color,
    start: THREE.Vector3,
    end: THREE.Vector3,
    base: number,
  ): Link {
    // Lift the control point so wires bow outward instead of cutting through
    // the core - the difference between a schematic and a spider web.
    const midpoint = start.clone().add(end).multiplyScalar(0.5)
    const outward = midpoint.clone().normalize().multiplyScalar(0.55)
    const control = midpoint.clone().add(outward).setY(midpoint.y + 0.55)
    return {
      key,
      owner,
      color,
      start,
      end,
      control,
      tStart: 0,
      tEnd: 1,
      speed: 0.6 + Math.random() * 0.5,
      base,
      activity: key.startsWith('quota') ? 0.4 : 0,
    }
  }

  private writeLineGeometry(): void {
    const verticesPerLink = CURVE_SEGMENTS * 2
    const total = this.links.length * verticesPerLink
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const alphas = new Float32Array(total)
    const speeds = new Float32Array(total)
    const ts = new Float32Array(total)

    let cursor = 0
    const point = new THREE.Vector3()
    this.links.forEach((link) => {
      const samples: THREE.Vector3[] = []
      for (let step = 0; step <= CURVE_SEGMENTS; step += 1) {
        const t = step / CURVE_SEGMENTS
        point.copy(this.quadraticAt(link, t))
        samples.push(point.clone())
      }
      link.tStart = cursor / total
      for (let step = 0; step < CURVE_SEGMENTS; step += 1) {
        const a = samples[step]
        const b = samples[step + 1]
        for (const vertex of [a, b]) {
          positions[cursor * 3] = vertex.x
          positions[cursor * 3 + 1] = vertex.y
          positions[cursor * 3 + 2] = vertex.z
          colors[cursor * 3] = link.color.r
          colors[cursor * 3 + 1] = link.color.g
          colors[cursor * 3 + 2] = link.color.b
          alphas[cursor] = link.base
          speeds[cursor] = link.speed
          ts[cursor] = (step + (vertex === b ? 1 : 0)) / CURVE_SEGMENTS
          cursor += 1
        }
      }
      link.tEnd = cursor / total
    })

    this.lineGeometry.dispose()
    this.lineGeometry = new THREE.BufferGeometry()
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.lineGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.lineGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    this.lineGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    this.lineGeometry.setAttribute('aT', new THREE.BufferAttribute(ts, 1))
    this.lines.geometry = this.lineGeometry
  }

  private quadraticAt(link: Link, t: number): THREE.Vector3 {
    const inverse = 1 - t
    return new THREE.Vector3()
      .addScaledVector(link.start, inverse * inverse)
      .addScaledVector(link.control, 2 * inverse * t)
      .addScaledVector(link.end, t * t)
  }

  private rebuildLabels(): void {
    for (const sprite of this.sprites) {
      this.group.remove(sprite)
      const material = sprite.material as THREE.SpriteMaterial
      material.map?.dispose()
      material.dispose()
    }
    this.sprites = []

    this.agentNodes.forEach((node) => {
      const [, , role] = node.key.split('|')
      const label = makeLabelSprite(node.key.split('|')[0], role === 'main' ? '#B9A6FF' : '#8fd8ff')
      label.position.copy(node.position).multiplyScalar(1.24).setY(node.position.y + 0.3)
      this.sprites.push(label)
      this.group.add(label)
    })

    this.categoryNodes.forEach((node) => {
      const label = makeLabelSprite(node.key, '#5f9fc4', 0.3)
      label.position.copy(node.position).multiplyScalar(1.16).setY(node.position.y - 0.34)
      this.sprites.push(label)
      this.group.add(label)
    })
  }

  // -- public API ------------------------------------------------------
  setAgents(agents: AgentNode[]): void {
    const nextKeys = agents.map((agent) => `${agent.id}:${agent.name}`).join(',')
    const currentKeys = this.agentNodes.map((node) => node.key.split('|').slice(1).join(':')).join(',')
    if (nextKeys === currentKeys && this.agentNodes.length === agents.length) return
    const previous = new Map(this.agentNodes.map((node) => [node.id, node.activity]))
    this.layoutAgents(agents)
    this.agentNodes.forEach((node) => {
      node.activity = Math.max(node.activity, previous.get(node.id) ?? 0.6)
    })
    this.dirty = true
  }

  setCategories(categories: string[]): void {
    if (categories.join(',') === this.categoryNodes.map((node) => node.key).join(',')) return
    this.layoutCategories(categories)
    this.dirty = true
  }

  /** Mark everything matching `key` as active. Called on every real event. */
  touch(key: string): void {
    const needle = key.toLowerCase()
    for (const link of this.links) {
      if (link.owner.toLowerCase().includes(needle) || link.key.toLowerCase().includes(needle)) {
        link.activity = 1
      }
    }
    for (const node of this.agentNodes) {
      if (node.key.toLowerCase().includes(needle)) node.activity = 1
    }
    for (const node of this.categoryNodes) {
      if (node.key.toLowerCase().includes(needle)) node.activity = 1
    }
  }

  /** Send a packet along every wire matching the key. */
  send(key: string, count = 1): void {
    const needle = key.toLowerCase()
    this.links.forEach((link, index) => {
      if (!link.owner.toLowerCase().includes(needle) && !link.key.toLowerCase().includes(needle)) return
      link.activity = 1
      for (let sent = 0; sent < count; sent += 1) {
        if (this.packetState.length < this.maxPackets) {
          this.packetState.push({ link: index, progress: -sent * 0.12, speed: 0.85 + Math.random() * 0.5 })
        }
      }
    })
  }

  /** A memory write throws a short filament across the core. */
  memoryFilament(): void {
    if (this.filaments.length > 12) return
    const count = 60
    const positions = new Float32Array(count * 3)
    const a = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.5) * 3,
    )
    const b = a.clone().multiplyScalar(-1)
    for (let index = 0; index < count; index += 1) {
      const t = index / (count - 1)
      const point = a.clone().lerp(b, t)
      const bow = Math.sin(t * Math.PI) * 0.35
      point.y += bow
      positions[index * 3] = point.x
      positions[index * 3 + 1] = point.y
      positions[index * 3 + 2] = point.z
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.LineBasicMaterial({
      color: 0x9fd8ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geometry, material)
    this.group.add(line)
    this.filaments.push({ geometry, material, born: performance.now() / 1000 })
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible
  }

  update(delta: number, time: number): void {
    if (this.dirty) this.rebuild()
    this.lineMaterial.uniforms.uTime.value = time

    // Decay activity and push it into the line alphas.
    const alpha = this.lineGeometry.getAttribute('aAlpha') as THREE.BufferAttribute
    const values = alpha.array as Float32Array
    const decay = Math.pow(0.5, delta / ACTIVITY_DECAY)
    this.links.forEach((link, index) => {
      link.activity *= decay
      if (link.activity < 0.001) link.activity = 0
      const vertexCount = CURVE_SEGMENTS * 2
      const start = index * vertexCount
      const target = link.base + link.activity * 0.95
      for (let vertex = 0; vertex < vertexCount; vertex += 1) {
        const current = values[start + vertex]
        values[start + vertex] = current + (target - current) * Math.min(1, delta * 6)
      }
    })
    alpha.needsUpdate = true

    // Node glow: agent and category sprites brighten with their activity.
    this.agentNodes.forEach((node, index) => {
      node.activity *= decay
      const sprite = this.sprites[index]
      if (sprite) (sprite.material as THREE.SpriteMaterial).opacity = 0.45 + 0.55 * Math.min(1, node.activity)
    })
    const agentCount = this.agentNodes.length
    this.categoryNodes.forEach((node, index) => {
      node.activity = Math.max(0.18, node.activity * decay)
      const sprite = this.sprites[agentCount + index]
      if (sprite) (sprite.material as THREE.SpriteMaterial).opacity = 0.3 + 0.7 * Math.min(1, node.activity)
    })

    // Packets travelling along active wires.
    const positions = this.packetGeometry.getAttribute('position') as THREE.BufferAttribute
    const array = positions.array as Float32Array
    const alive: Packet[] = []
    for (const packet of this.packetState) {
      packet.progress += delta * packet.speed
      if (packet.progress > 1.05) continue
      const link = this.links[packet.link]
      if (!link) continue
      const t = Math.max(0, packet.progress)
      const point = this.quadraticAt(link, t)
      const index = alive.length
      array[index * 3] = point.x
      array[index * 3 + 1] = point.y
      array[index * 3 + 2] = point.z
      alive.push(packet)
    }
    // Park unused packets far away instead of leaving stale glints on screen.
    for (let index = alive.length; index < this.maxPackets; index += 1) {
      array[index * 3] = 0
      array[index * 3 + 1] = -9999
      array[index * 3 + 2] = 0
    }
    this.packetState = alive
    positions.needsUpdate = true

    // Filaments fade out over ~1.4 seconds.
    const now = time
    this.filaments = this.filaments.filter((filament) => {
      const age = now - filament.born
      if (age > 1.4) {
        const stale = this.group.children.filter(
          (child) => (child as THREE.Line).geometry === filament.geometry,
        )
        this.group.remove(...stale)
        filament.geometry.dispose()
        filament.material.dispose()
        return false
      }
      filament.material.opacity = 0.7 * (1 - age / 1.4)
      return true
    })

    // The whole ring assembly turns slowly, giving the HUD parallax.
    this.group.rotation.y += delta * 0.035
  }

  dispose(): void {
    this.lineGeometry.dispose()
    this.lineMaterial.dispose()
    this.packetGeometry.dispose()
    this.packetMaterial.dispose()
    this.rebuildLabels()
    for (const filament of this.filaments) {
      filament.geometry.dispose()
      filament.material.dispose()
    }
    this.ringGroup.children.forEach((child) => {
      const mesh = child as THREE.Line
      mesh.geometry?.dispose()
      ;(mesh.material as THREE.Material)?.dispose()
    })
  }
}
