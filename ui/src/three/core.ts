/**
 * The particle core.
 *
 * A dense shell of points - tens of thousands of them - that rotates like a
 * planet, breathes while the agent thinks, ripples outward when it speaks, and
 * morphs into different shapes as the work changes.
 *
 * Design notes:
 *  * Positions live in two attributes and the morph happens on the GPU, so
 *    changing shape costs one uniform write instead of 50k CPU lerps a frame.
 *  * Additive blending with a soft circular sprite gives the glow without any
 *    post-processing pass, which keeps the per-frame cost low.
 *  * Every point carries a stable random seed, which is what makes the motion
 *    look organic instead of mechanical.
 *  * The system owns geometry and shader only. The renderer, camera and frame
 *    loop belong to the stage, so the core and the wiring graph share one
 *    WebGL context and one frame budget.
 */

import * as THREE from 'three'

export type CoreShape = 'sphere' | 'torus' | 'helix' | 'cube' | 'grid' | 'vortex'

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  attribute float aBand;

  uniform float uMorph;
  uniform float uTime;
  uniform float uVoice;
  uniform float uThink;
  uniform float uWork;
  uniform float uAlert;
  uniform float uPulse;
  uniform float uPulseRadius;
  uniform vec3  uPulseOrigin;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSpread;

  varying float vSeed;
  varying float vIntensity;
  varying float vDepth;

  void main() {
    vSeed = aSeed;

    // Morph between the base shell and the requested shape.
    float t = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(position, aTarget, t);

    // Slow breathing; deeper while the model is reasoning.
    float breath = sin(uTime * 0.7 + aSeed * 6.2831) * 0.5 + 0.5;
    p *= 1.0 + (0.012 + 0.028 * uThink) * breath;

    // Speech: a travelling ripple that follows the voice envelope.
    if (uVoice > 0.001) {
      float wave = sin(uTime * 5.0 - p.y * 2.2 + aSeed * 0.4);
      p += normalize(p + 0.0001) * wave * 0.10 * uVoice;
    }

    // Work: a faster, tighter swirl, so "acting" reads differently to "thinking".
    if (uWork > 0.001) {
      float angle = uWork * 0.35 * (1.0 + aBand);
      float s = sin(angle);
      float c = cos(angle);
      p.xz = mat2(c, -s, s, c) * p.xz;
    }

    // Pulse: an expanding ring from a point on the shell (a tool call, a spawn).
    if (uPulse > 0.001) {
      float distanceToOrigin = distance(normalize(p + 0.0001), uPulseOrigin);
      float ring = exp(-pow((distanceToOrigin - uPulseRadius) * 5.0, 2.0));
      p += normalize(p + 0.0001) * ring * 0.55 * uPulse;
    }

    p *= 1.0 + uSpread;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = uSize * (0.65 + 0.9 * aSeed) * uPixelRatio;
    size *= 1.0 + 0.5 * uVoice + 0.25 * uPulse + 0.35 * uAlert;
    gl_PointSize = size * (1.0 / -mvPosition.z);

    vIntensity = 0.35 + 0.65 * breath + 0.6 * uPulse + 0.5 * uAlert;
    vDepth = clamp((-mvPosition.z - 1.2) / 3.4, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3  uColorCore;
  uniform vec3  uColorEdge;
  uniform vec3  uColorAlert;
  uniform float uVoice;
  uniform float uPulse;
  uniform float uAlert;
  uniform float uOpacity;

  varying float vSeed;
  varying float vIntensity;
  varying float vDepth;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    if (distance > 0.5) discard;

    float falloff = smoothstep(0.5, 0.02, distance);

    // Colour drifts between the core and edge tones, then to red under alert.
    vec3 colour = mix(uColorCore, uColorEdge, clamp(vDepth + vSeed * 0.25, 0.0, 1.0));
    colour = mix(colour, uColorAlert, clamp(uAlert, 0.0, 1.0));
    colour += vec3(0.35, 0.6, 1.0) * uVoice * 0.4;
    colour += vec3(0.9, 0.75, 0.4) * uPulse * 0.35;

    float alpha = falloff * vIntensity * uOpacity;
    gl_FragColor = vec4(colour, alpha);
  }
`

/** Deterministic pseudo-random, so the same machine always looks the same. */
function makeRandom(seed = 1337): () => number {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function shellPositions(count: number, radius: number, inner = 0.82): Float32Array {
  const random = makeRandom(count + Math.floor(radius * 1000))
  const positions = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let index = 0; index < count; index += 1) {
    const offset = index + 0.5
    const y = 1 - (offset / count) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * offset
    const jitter = inner + (1 - inner) * random()
    positions[index * 3] = Math.cos(theta) * radiusAtY * radius * jitter
    positions[index * 3 + 1] = y * radius * jitter
    positions[index * 3 + 2] = Math.sin(theta) * radiusAtY * radius * jitter
  }
  return positions
}

function torusPositions(count: number, radius = 1, tube = 0.32): Float32Array {
  const random = makeRandom(count + 7)
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const u = random() * Math.PI * 2
    const v = random() * Math.PI * 2
    const r = tube * (0.55 + 0.45 * random())
    positions[index * 3] = (radius + r * Math.cos(v)) * Math.cos(u)
    positions[index * 3 + 1] = r * Math.sin(v)
    positions[index * 3 + 2] = (radius + r * Math.cos(v)) * Math.sin(u)
  }
  return positions
}

function helixPositions(count: number, radius = 0.85, height = 2.1, strands = 3): Float32Array {
  const random = makeRandom(count + 11)
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const t = index / count
    const angle = t * Math.PI * 6
    const strand = index % strands
    const offset = (strand / strands) * Math.PI * 2
    const spread = 0.94 + 0.06 * random()
    positions[index * 3] = Math.cos(angle + offset) * radius * spread
    positions[index * 3 + 1] = (t - 0.5) * height * 2
    positions[index * 3 + 2] = Math.sin(angle + offset) * radius * spread
  }
  return positions
}

function cubePositions(count: number, size = 1.1): Float32Array {
  const random = makeRandom(count + 13)
  const positions = new Float32Array(count * 3)
  const half = size / 2
  for (let index = 0; index < count; index += 1) {
    const face = index % 6
    const a = random() * size - half
    const b = random() * size - half
    const c = half * (index % 2 === 0 ? 1 : -1)
    if (face < 2) positions.set([c, a, b], index * 3)
    else if (face < 4) positions.set([a, c, b], index * 3)
    else positions.set([a, b, c], index * 3)
  }
  return positions
}

function gridPositions(count: number, extent = 1.35, layers = 7): Float32Array {
  const random = makeRandom(count + 17)
  const positions = new Float32Array(count * 3)
  const side = Math.max(2, Math.ceil(Math.cbrt(count)))
  for (let index = 0; index < count; index += 1) {
    const x = (index % side) / (side - 1) - 0.5
    const y = (Math.floor(index / side) % side) / (side - 1) - 0.5
    const z = Math.floor(index / (side * side)) / Math.max(1, layers - 1) - 0.5
    const wobble = 0.02 * (random() - 0.5)
    positions[index * 3] = (x + wobble) * extent * 2
    positions[index * 3 + 1] = (y + wobble) * extent * 2
    positions[index * 3 + 2] = (z + wobble) * extent * 2
  }
  return positions
}

function vortexPositions(count: number, arms = 4): Float32Array {
  const random = makeRandom(count + 19)
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const arm = index % arms
    const t = Math.pow(random(), 0.65)
    const angle = t * Math.PI * 5 + (arm / arms) * Math.PI * 2
    const radius = 0.25 + t * 1.15
    const thickness = 0.1 * (0.4 + random())
    positions[index * 3] = Math.cos(angle) * radius + (random() - 0.5) * thickness
    positions[index * 3 + 1] = (random() - 0.5) * 0.35 * (1 - t * 0.6)
    positions[index * 3 + 2] = Math.sin(angle) * radius + (random() - 0.5) * thickness
  }
  return positions
}

export function shapePositions(shape: CoreShape, count: number): Float32Array {
  switch (shape) {
    case 'torus':
      return torusPositions(count)
    case 'helix':
      return helixPositions(count)
    case 'cube':
      return cubePositions(count)
    case 'grid':
      return gridPositions(count)
    case 'vortex':
      return vortexPositions(count)
    default:
      return shellPositions(count, 1.0)
  }
}

export class CoreSystem {
  readonly group: THREE.Group

  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  private haloGeometry: THREE.BufferGeometry
  private haloMaterial: THREE.PointsMaterial
  private ringGeometry: THREE.RingGeometry
  private ringMaterial: THREE.MeshBasicMaterial
  private halo: THREE.Points
  private count: number
  private reducedMotion: boolean
  private phase = 'idle'
  private morphValue = 0
  private pulseStrength = 0
  private pulseRadius = 0
  private targetAlert = 0
  private targetVoice = 0
  private thinkValue = 0
  private workValue = 0
  private attention = 0

  constructor(scene: THREE.Scene, particleCount: number, reducedMotion = false) {
    this.reducedMotion = reducedMotion
    this.count = Math.max(2000, Math.floor(particleCount))
    this.group = new THREE.Group()
    this.group.rotation.x = 0.18
    scene.add(this.group)

    const geometry = new THREE.BufferGeometry()
    const base = shellPositions(this.count, 1.0)
    geometry.setAttribute('position', new THREE.BufferAttribute(base, 3))
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(base.slice(), 3))

    const seeds = new Float32Array(this.count)
    const bands = new Float32Array(this.count)
    const random = makeRandom(this.count)
    for (let index = 0; index < this.count; index += 1) {
      seeds[index] = random()
      bands[index] = random() * 2 - 1
    }
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geometry.setAttribute('aBand', new THREE.BufferAttribute(bands, 1))
    this.geometry = geometry

    const uniforms = {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uVoice: { value: 0 },
      uThink: { value: 0.25 },
      uWork: { value: 0 },
      uAlert: { value: 0 },
      uPulse: { value: 0 },
      uPulseRadius: { value: 0 },
      uPulseOrigin: { value: new THREE.Vector3(0, 1, 0) },
      uSize: { value: 2.15 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSpread: { value: 0 },
      uColorCore: { value: new THREE.Color('#5B7CFF') },
      uColorEdge: { value: new THREE.Color('#31E6FF') },
      uColorAlert: { value: new THREE.Color('#FF5470') },
      uOpacity: { value: 0.86 },
    }

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, this.material)
    points.frustumCulled = false
    this.group.add(points)

    // A sparse outer halo rotating at a different rate: this is what makes the
    // whole thing read as depth rather than a flat disc.
    const haloCount = Math.max(400, Math.floor(this.count * 0.12))
    this.haloGeometry = new THREE.BufferGeometry()
    this.haloGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(shellPositions(haloCount, 1.34, 0.9), 3),
    )
    this.haloMaterial = new THREE.PointsMaterial({
      color: 0x2a6ea8,
      size: 0.014,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.halo = new THREE.Points(this.haloGeometry, this.haloMaterial)
    this.halo.frustumCulled = false
    this.group.add(this.halo)

    // Ground glow ring under the core, like the base of a reactor.
    this.ringGeometry = new THREE.RingGeometry(1.26, 1.32, 128)
    this.ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x1f4f7a,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ring = new THREE.Mesh(this.ringGeometry, this.ringMaterial)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = -1.3
    this.group.add(ring)
  }

  /** Advance one frame. Called by the stage's single render loop. */
  update(delta: number, time: number): void {
    const uniforms = this.material.uniforms
    uniforms.uTime.value = time

    // Ease animated values so state changes glide instead of snapping.
    const ease = this.reducedMotion ? 1 : 1 - Math.pow(0.001, delta)
    uniforms.uVoice.value += (this.targetVoice - uniforms.uVoice.value) * ease
    uniforms.uThink.value += (this.thinkValue - uniforms.uThink.value) * ease
    uniforms.uWork.value += (this.workValue - uniforms.uWork.value) * ease
    uniforms.uAlert.value += (this.targetAlert - uniforms.uAlert.value) * ease

    // Morph: advance toward the new shape, then bake it in as the new base.
    if (this.morphValue > 0 && this.morphValue < 1) {
      this.morphValue = Math.min(1, this.morphValue + delta * 0.9)
      uniforms.uMorph.value = this.morphValue
      if (this.morphValue >= 1) {
        const target = this.geometry.getAttribute('aTarget') as THREE.BufferAttribute
        const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
        ;(position.array as Float32Array).set(target.array as Float32Array)
        position.needsUpdate = true
        this.morphValue = 0
        uniforms.uMorph.value = 0
      }
    }

    // Pulse ring expanding across the shell.
    if (this.pulseStrength > 0.001) {
      this.pulseStrength *= Math.pow(0.12, delta)
      this.pulseRadius += delta * 2.6
      uniforms.uPulse.value = this.pulseStrength
      uniforms.uPulseRadius.value = this.pulseRadius
    } else {
      this.pulseStrength = 0
      uniforms.uPulse.value = 0
    }

    // Rotation: the planet spin, plus a slow axial precession.
    const spin = this.phase === 'thinking' ? 0.24 : this.phase === 'working' ? 0.17 : 0.075
    const factor = this.reducedMotion ? 0.25 : 1
    this.group.rotation.y += delta * spin * factor
    this.group.rotation.z = Math.sin(time * 0.11) * 0.05
    this.group.rotation.x = 0.18 + Math.sin(time * 0.07) * 0.04
    this.halo.rotation.y -= delta * spin * 0.55 * factor
    this.halo.rotation.x += delta * 0.03 * factor

    // Brightness responds to attention: more agents, more glow.
    uniforms.uSpread.value = Math.min(0.12, this.attention * 0.012)
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    this.ringMaterial.opacity = 0.22 + 0.28 * (uniforms.uVoice.value + uniforms.uWork.value * 0.5)
    this.haloMaterial.opacity = 0.35 + 0.3 * uniforms.uThink.value
  }

  setPhase(next: string): void {
    this.phase = next
    this.thinkValue = next === 'thinking' ? 1 : next === 'idle' || next === 'speaking' ? 0.25 : 0.45
    this.workValue = next === 'working' ? 1 : 0
    this.targetAlert = next === 'alert' ? 1 : 0
  }

  setShape(shape: CoreShape): void {
    const target = this.geometry.getAttribute('aTarget') as THREE.BufferAttribute
    ;(target.array as Float32Array).set(shapePositions(shape, this.count))
    target.needsUpdate = true
    // A tiny non-zero value kicks the morph loop; it is not a visible jump.
    this.morphValue = 0.0001
    this.material.uniforms.uMorph.value = 0.0001
  }

  pulse(_kind: string, strength = 1): void {
    this.pulseStrength = Math.min(1.6, this.pulseStrength + strength * 0.7)
    this.pulseRadius = 0
    this.material.uniforms.uPulseOrigin.value
      .set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      .normalize()
  }

  setTalking(level: number): void {
    this.targetVoice = Math.max(0, Math.min(1, level))
  }

  setAttention(agentCount: number): void {
    this.attention = agentCount
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.haloGeometry.dispose()
    this.haloMaterial.dispose()
    this.ringGeometry.dispose()
    this.ringMaterial.dispose()
  }
}
