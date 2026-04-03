import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import type { PlanetConfig } from '../../types'
import Moon from './Moon'

interface Props {
  config: PlanetConfig
  onClick: (planetId: string) => void
}

export default function Planet({ config, onClick }: Props) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

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
            color={config.color}
            emissive={config.color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
          />
        </mesh>
        {/* Moon orbiting this planet */}
        <Moon parentPosition={[0, 0, 0]} color={config.color} />
        {hovered && (
          <Html center distanceFactor={15}>
            <div style={{
              background: 'rgba(15,23,42,0.9)',
              border: `1px solid ${config.color}`,
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
              {config.name}
            </div>
          </Html>
        )}
      </group>
    </>
  )
}
