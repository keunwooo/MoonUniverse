import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import type { Group } from 'three'
import type { PlanetConfig } from '../../types'
import Moon from './Moon'

interface Props {
  config: PlanetConfig
  onClick: (planetId: string) => void
  onMoonClick: (planetId: string) => void
}

export default function Planet({ config, onClick, onMoonClick }: Props) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  // Map each subject to a real planet texture
  const TEXTURE_MAP: Record<string, string> = {
    algebra: '/textures/mercury.jpg',
    geometry: '/textures/earth.jpg',
    functions: '/textures/mars.jpg',
    calculus: '/textures/jupiter.jpg',
    probability: '/textures/saturn.jpg',
  }
  const texture = useTexture(TEXTURE_MAP[config.id] ?? '/textures/mercury.jpg')

  useFrame((_, delta) => {
    angleRef.current += delta * (0.1 / config.orbitRadius)
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * config.orbitRadius
      groupRef.current.position.z = Math.sin(angleRef.current) * config.orbitRadius
    }
  })

  return (
    <>
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.orbitRadius - 0.02, config.orbitRadius + 0.02, 128]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.15} />
      </mesh>

      {/* Planet group */}
      <group ref={groupRef}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onClick(config.id)}
        >
          <sphereGeometry args={[config.size, 32, 32]} />
          <meshStandardMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={hovered ? 0.8 : 0.5}
          />
        </mesh>
        {/* Moon orbiting this planet */}
        <Moon
          parentPosition={[0, 0, 0]}
          color={config.color}
          name={config.moon.name}
          subjectId={config.id}
          onClick={() => onMoonClick(config.id)}
        />
        {hovered && (
          <Html center zIndexRange={[50, 0]}>
            <div style={{
              background: 'rgba(15,23,42,0.92)',
              border: `1px solid ${config.color}`,
              borderRadius: '10px',
              padding: '8px 18px',
              color: '#f1f5f9',
              fontSize: '16px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 12px ${config.color}44`,
            }}>
              {config.name}
            </div>
          </Html>
        )}
      </group>
    </>
  )
}
