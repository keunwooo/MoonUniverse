import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

interface Props {
  parentPosition: [number, number, number]
  color: string
  name: string
}

export default function Moon({ parentPosition, color, name }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    angleRef.current += delta * 1.5
    if (ref.current) {
      ref.current.position.x = parentPosition[0] + Math.cos(angleRef.current) * 2.5
      ref.current.position.y = parentPosition[1]
      ref.current.position.z = parentPosition[2] + Math.sin(angleRef.current) * 2.5
    }
  })

  return (
    <group>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#c4b5a0"
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.3}
        />
        {hovered && (
          <Html center zIndexRange={[50, 0]}>
            <div style={{
              background: 'rgba(15,23,42,0.92)',
              border: `1px solid ${color}`,
              borderRadius: '10px',
              padding: '6px 14px',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 10px ${color}44`,
            }}>
              🌙 {name}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}
