import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Multi-layer starfield with nebula clouds for a realistic space feel.
 * Layer 1: Dense tiny stars (far background)
 * Layer 2: Medium stars with slight color variation
 * Layer 3: Sparse bright stars (foreground sparkle)
 * Layer 4: Nebula clouds (colored fog patches)
 */

function NebulaClouds() {
  const cloudsRef = useRef<THREE.Points>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    // Nebula color palettes
    const palettes = [
      [0.15, 0.05, 0.35], // deep purple
      [0.05, 0.1, 0.3],   // dark blue
      [0.2, 0.05, 0.15],  // dark red/pink
      [0.05, 0.15, 0.2],  // teal
      [0.1, 0.05, 0.25],  // indigo
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 150 + Math.random() * 150

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      const palette = palettes[Math.floor(Math.random() * palettes.length)]
      col[i * 3] = palette[0] + Math.random() * 0.1
      col[i * 3 + 1] = palette[1] + Math.random() * 0.1
      col[i * 3 + 2] = palette[2] + Math.random() * 0.1

      siz[i] = 30 + Math.random() * 80
    }

    return { positions: pos, colors: col, sizes: siz }
  }, [])

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.003
    }
  })

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,0.15)')
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.05)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  return (
    <points ref={cloudsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={60}
        map={texture}
        transparent
        opacity={0.6}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

function StarLayer({
  count,
  radius,
  depth,
  factor,
  saturation,
}: {
  count: number
  radius: number
  depth: number
  factor: number
  saturation: number
}) {
  return (
    <group>
      <Stars
        radius={radius}
        depth={depth}
        count={count}
        factor={factor}
        saturation={saturation}
        fade
        speed={0.5}
      />
    </group>
  )
}

export default function Skybox() {
  return (
    <>
      <color attach="background" args={['#030014']} />

      {/* Layer 1: Dense tiny background stars */}
      <StarLayer count={15000} radius={400} depth={200} factor={2} saturation={0.1} />

      {/* Layer 2: Medium stars with color */}
      <StarLayer count={5000} radius={300} depth={150} factor={4} saturation={0.3} />

      {/* Layer 3: Sparse bright foreground stars */}
      <StarLayer count={1000} radius={200} depth={80} factor={7} saturation={0.5} />

      {/* Nebula clouds */}
      <NebulaClouds />
    </>
  )
}
