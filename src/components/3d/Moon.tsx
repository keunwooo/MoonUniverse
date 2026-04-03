import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import { useGameStore } from '../../stores/useGameStore'
import { useTexture } from '@react-three/drei'
import type { Problem } from '../../types'

import algebraData from '../../data/problems/algebra.json'
import geometryData from '../../data/problems/geometry.json'
import functionsData from '../../data/problems/functions.json'
import calculusData from '../../data/problems/calculus.json'
import probabilityData from '../../data/problems/probability.json'

const SUBJECT_PROBLEMS: Record<string, Problem[]> = {
  algebra: algebraData.problems as Problem[],
  geometry: geometryData.problems as Problem[],
  functions: functionsData.problems as Problem[],
  calculus: calculusData.problems as Problem[],
  probability: probabilityData.problems as Problem[],
}

interface Props {
  parentPosition: [number, number, number]
  color: string
  name: string
  subjectId: string
  onClick: () => void
}

export default function Moon({ parentPosition, color, name, subjectId, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const solved = useGameStore((s) => s.progress.solved)

  // Count from actual problem data
  const tutorials = useMemo(() =>
    (SUBJECT_PROBLEMS[subjectId] ?? []).filter(p => p.tier === 'tutorial'),
    [subjectId]
  )
  const tutorialCount = tutorials.length
  const solvedTutorials = tutorials.filter(p => solved[p.id]?.correct).length
  const allComplete = tutorialCount > 0 && solvedTutorials >= tutorialCount
  const moonTexture = useTexture(`${import.meta.env.BASE_URL}textures/moon.jpg`)

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
          map={moonTexture}
          emissiveMap={moonTexture}
          emissive={allComplete ? '#fbbf24' : '#ffffff'}
          emissiveIntensity={hovered ? 0.7 : allComplete ? 0.5 : 0.4}
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
