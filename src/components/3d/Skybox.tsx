import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Realistic space background using layered approach:
 * 1. Far starfield: 20,000 tiny points (dense background)
 * 2. Mid starfield: 3,000 medium stars with color temperature
 * 3. Near bright stars: 200 large glow sprites
 * 4. Nebula clouds: colored fog patches
 * 5. Milky way band: dense star concentration
 */

// --- Star color temperature (realistic stellar colors) ---
function starColor(temp: number): [number, number, number] {
  // Simplified blackbody: hot=blue, medium=white, cool=orange/red
  if (temp > 0.8) return [0.7, 0.8, 1.0]    // O/B type - blue-white
  if (temp > 0.6) return [0.9, 0.95, 1.0]    // A type - white
  if (temp > 0.4) return [1.0, 1.0, 0.9]     // F/G type - yellow-white
  if (temp > 0.2) return [1.0, 0.85, 0.6]    // K type - orange
  return [1.0, 0.6, 0.4]                      // M type - red
}

// --- Glow texture generator ---
function createGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.1, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.15)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Nebula cloud texture ---
function createNebulaTexture(): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.12)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.06)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.02)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Layer 1: Far dense starfield (tiny points) ---
function FarStarfield() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 25000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 500 + Math.random() * 500

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Brightness distribution: most stars are dim, few are bright
      const brightness = Math.pow(Math.random(), 3) * 0.8 + 0.2
      const temp = Math.random()
      const [cr, cg, cb] = starColor(temp)
      colors[i * 3] = cr * brightness
      colors[i * 3 + 1] = cg * brightness
      colors[i * 3 + 2] = cb * brightness

      sizes[i] = 0.3 + Math.pow(Math.random(), 4) * 1.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points ref={ref} geometry={geometry} material={material} />
}

// --- Layer 2: Mid starfield with twinkle ---
function MidStarfield() {
  const ref = useRef<THREE.Points>(null)
  const sizesRef = useRef<Float32Array | null>(null)
  const baseSizesRef = useRef<Float32Array | null>(null)
  const phasesRef = useRef<Float32Array | null>(null)

  const { geometry, material } = useMemo(() => {
    const count = 4000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const baseSizes = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 300 + Math.random() * 300

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const brightness = Math.pow(Math.random(), 2) * 0.7 + 0.3
      const temp = Math.random()
      const [cr, cg, cb] = starColor(temp)
      colors[i * 3] = cr * brightness
      colors[i * 3 + 1] = cg * brightness
      colors[i * 3 + 2] = cb * brightness

      const s = 1.0 + Math.pow(Math.random(), 3) * 3.0
      sizes[i] = s
      baseSizes[i] = s
      phases[i] = Math.random() * Math.PI * 2
    }

    sizesRef.current = sizes
    baseSizesRef.current = baseSizes
    phasesRef.current = phases

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const tex = createGlowTexture()
    const mat = new THREE.PointsMaterial({
      size: 2,
      map: tex,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  // Twinkle animation
  useFrame((state) => {
    if (!sizesRef.current || !baseSizesRef.current || !phasesRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < sizesRef.current.length; i++) {
      const twinkle = Math.sin(t * (0.5 + phasesRef.current[i]) + phasesRef.current[i] * 10) * 0.3 + 0.7
      sizesRef.current[i] = baseSizesRef.current[i] * twinkle
    }

    geometry.attributes.size.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

// --- Layer 3: Bright star sprites (large glow) ---
function BrightStars() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 150
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 200 + Math.random() * 400

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Bright stars are often blue-white or orange
      const temp = Math.random() > 0.6 ? 0.85 + Math.random() * 0.15 : 0.15 + Math.random() * 0.25
      const [cr, cg, cb] = starColor(temp)
      colors[i * 3] = cr
      colors[i * 3 + 1] = cg
      colors[i * 3 + 2] = cb

      sizes[i] = 4 + Math.random() * 8
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const tex = createGlowTexture()
    const mat = new THREE.PointsMaterial({
      size: 6,
      map: tex,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points ref={ref} geometry={geometry} material={material} />
}

// --- Layer 4: Milky Way band (concentrated star strip) ---
function MilkyWay() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 8000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Band along the XZ plane with gaussian spread in Y
      const angle = Math.random() * Math.PI * 2
      const r = 300 + Math.random() * 400
      const bandWidth = 40 + Math.random() * 60 // Y spread

      // Gaussian-ish distribution for band thickness
      const ySpread = (Math.random() + Math.random() + Math.random() - 1.5) * bandWidth

      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = ySpread
      positions[i * 3 + 2] = Math.sin(angle) * r

      const brightness = Math.pow(Math.random(), 2) * 0.4 + 0.1
      colors[i * 3] = 0.9 * brightness
      colors[i * 3 + 1] = 0.85 * brightness
      colors[i * 3 + 2] = 1.0 * brightness
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const tex = createGlowTexture()
    const mat = new THREE.PointsMaterial({
      size: 1.2,
      map: tex,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points ref={ref} geometry={geometry} material={material} />
}

// --- Layer 5: Nebula clouds ---
function NebulaClouds() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 120
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const palettes: [number, number, number][] = [
      [0.3, 0.1, 0.6],   // purple
      [0.1, 0.2, 0.5],   // deep blue
      [0.4, 0.1, 0.2],   // dark pink
      [0.1, 0.3, 0.35],  // teal
      [0.2, 0.1, 0.45],  // indigo
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 200 + Math.random() * 300

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const p = palettes[Math.floor(Math.random() * palettes.length)]
      colors[i * 3] = p[0] + Math.random() * 0.15
      colors[i * 3 + 1] = p[1] + Math.random() * 0.15
      colors[i * 3 + 2] = p[2] + Math.random() * 0.15
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const tex = createNebulaTexture()
    const mat = new THREE.PointsMaterial({
      size: 80,
      map: tex,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.002
    }
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

// --- Main Skybox ---
export default function Skybox() {
  return (
    <>
      <color attach="background" args={['#020010']} />
      <FarStarfield />
      <MidStarfield />
      <BrightStars />
      <MilkyWay />
      <NebulaClouds />
    </>
  )
}
