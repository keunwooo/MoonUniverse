import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import { useGameStore } from '../../stores/useGameStore'

interface Props {
  parentPosition: [number, number, number]
  color: string
  name: string
  tutorialCount: number
  subjectId: string
  onClick: () => void
}

export default function Moon({ parentPosition, color, name, tutorialCount, subjectId, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const solved = useGameStore((s) => s.progress.solved)

  // Count solved tutorials for this subject
  const prefix = subjectId.slice(0, 3).toUpperCase()
  const solvedTutorials = Object.keys(solved).filter(
    id => id.startsWith(prefix + '-T') && solved[id]?.correct
  ).length
  const allComplete = tutorialCount > 0 && solvedTutorials >= tutorialCount

  useFrame((_, delta) => {
    angleRef.current += delta * 1.5
    if (ref.current) {
      ref.current.position.x = parentPosition[0] + Math.cos(angleRef.current) * 2.5
      ref.current.position.y = parentPosition[1]
      ref.current.position.z = parentPosition[2] + Math.sin(angleRef.current) * 2.5
    }
  })

  useEffect(() => {
    return () => { document.body.style.cursor = 'default' }
  }, [])

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
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={allComplete ? '#fbbf24' : '#c4b5a0'}
          emissive={allComplete ? '#fbbf24' : color}
          emissiveIntensity={hovered ? 0.8 : allComplete ? 0.5 : 0.3}
        />
        {hovered && (
          <Html center zIndexRange={[50, 0]}>
            <div style={{
              background: 'rgba(15,23,42,0.92)',
              border: `1px solid ${color}`,
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 10px ${color}44`,
              textAlign: 'center',
            }}>
              <div>🌙 {name}</div>
              <div style={{ fontSize: '11px', color: allComplete ? '#4ade80' : '#94a3b8', marginTop: '2px' }}>
                {allComplete ? '✓ 입문 완료!' : `입문 ${solvedTutorials}/${tutorialCount} · 클릭하여 시작`}
              </div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}
