import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Html } from '@react-three/drei'
import type { Mesh } from 'three'
import { useGameStore } from '../../stores/useGameStore'

interface Props {
  onClick: (unlocked: boolean) => void
}

export default function Sun({ onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(`${import.meta.env.BASE_URL}textures/sun.jpg`)
  const sunUnlocked = useGameStore((s) => s.progress.sunUnlocked)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      <mesh
        ref={ref}
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(sunUnlocked)
        }}
      >
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ff8800"
          emissiveIntensity={hovered ? 3.0 : 2.5}
        />
        <pointLight color="#ffd080" intensity={100} distance={200} />
      </mesh>

      {hovered && (
        <Html center position={[0, 5, 0]} zIndexRange={[50, 0]}>
          <div style={{
            background: 'rgba(15,23,42,0.92)',
            border: `1px solid ${sunUnlocked ? '#fbbf24' : '#f8717166'}`,
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#f1f5f9',
            fontSize: '14px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: sunUnlocked
              ? '0 0 20px rgba(251,191,36,0.3)'
              : '0 0 15px rgba(248,113,113,0.2)',
            textAlign: 'center',
          }}>
            <div>{sunUnlocked ? '☀️ 최종 도전' : '🔒 최종 도전'}</div>
            <div style={{
              fontSize: '11px',
              color: sunUnlocked ? '#fbbf24' : '#94a3b8',
              marginTop: '3px',
            }}>
              {sunUnlocked
                ? '클릭하여 도전하기!'
                : '3개 행성 심화 달성 필요'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
