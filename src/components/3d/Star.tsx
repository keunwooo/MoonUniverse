import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh } from 'three'
import type { Problem, Tier } from '../../types'
import { useGameStore } from '../../stores/useGameStore'
import { PREFIX_MAP } from '../../utils/planet-lookup'

interface Props {
  problem: Problem
  position: [number, number, number]
  onHover: (problem: Problem | null) => void
  onClick: (problem: Problem) => void
}

const TIER_ORDER: Tier[] = ['tutorial', 'easy', 'medium', 'hard', 'expert']
const TIER_KO: Record<string, string> = {
  tutorial: '입문',
  easy: '기초',
  medium: '보통',
  hard: '심화',
  expert: '전문가',
}

export default function Star({ problem, position, onHover, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const solved = useGameStore((s) => s.progress.solved[problem.id])
  const unlocked = useGameStore((s) => s.progress.unlocked)

  const prefix = problem.id.slice(0, 3).toUpperCase()
  const subjectId = PREFIX_MAP[prefix] ?? 'algebra'
  const unlockedTier = unlocked[subjectId] ?? 'tutorial'
  const unlockedIndex = TIER_ORDER.indexOf(unlockedTier)
  const problemTierIndex = TIER_ORDER.indexOf(problem.tier)
  const isLocked = problemTierIndex > unlockedIndex

  const baseSize = 0.1 + problem.difficulty * 0.06

  // Locked: need to unlock this tier
  const requiredTier = TIER_ORDER[problemTierIndex - 1]
  const requiredTierKo = TIER_KO[requiredTier] ?? requiredTier

  // Dashed ring geometry for locked stars
  const ringGeometry = useMemo(() => {
    if (!isLocked) return null
    const segments = 32
    const radius = baseSize + 0.15
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      // Create dashes by skipping every other segment
      if (i % 2 === 0) {
        const angle1 = (i / segments) * Math.PI * 2
        const angle2 = ((i + 1) / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1) * radius, 0))
        points.push(new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2) * radius, 0))
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [isLocked, baseSize])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }

    // Locked: slow breathing pulse
    if (isLocked && ref.current) {
      const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.1
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = pulse
    }

    // Locked ring: slow rotation
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3
    }
  })

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  // Colors
  let color: string
  let emissiveIntensity: number

  if (isLocked) {
    color = '#6366f1' // indigo tint instead of gray — visible but distinct
    emissiveIntensity = 0.15
  } else if (solved?.correct) {
    color = '#fbbf24'
    emissiveIntensity = 1.5
  } else {
    color = '#ffffff'
    emissiveIntensity = problem.difficulty * 0.5 + (hovered ? 1.0 : 0)
  }

  return (
    <group position={position}>
      {/* Star mesh */}
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          if (isLocked) {
            onHover(null)
            document.body.style.cursor = 'not-allowed'
          } else {
            onHover(problem)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(null)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!isLocked) onClick(problem)
        }}
      >
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          opacity={isLocked ? 0.6 : 1}
          transparent={isLocked}
        />
      </mesh>

      {/* Locked: dashed ring */}
      {isLocked && ringGeometry && (
        <lineSegments ref={ringRef} geometry={ringGeometry}>
          <lineBasicMaterial color="#6366f1" transparent opacity={0.5} />
        </lineSegments>
      )}

      {/* Locked: hover tooltip */}
      {isLocked && hovered && (
        <Html center distanceFactor={12}>
          <div style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '10px',
            padding: '8px 14px',
            color: '#a5b4fc',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>🔒</div>
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
              {TIER_KO[problem.tier]} 단계
            </div>
            <div style={{ fontSize: '11px', color: '#818cf8' }}>
              {requiredTierKo} 티어를 먼저 완료하세요
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
