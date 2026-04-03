import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
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

export default function Star({ problem, position, onHover, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const solved = useGameStore((s) => s.progress.solved[problem.id])
  const unlocked = useGameStore((s) => s.progress.unlocked)

  // Determine if this star's tier is accessible
  const prefix = problem.id.slice(0, 3).toUpperCase()
  const subjectId = PREFIX_MAP[prefix] ?? 'algebra'
  const unlockedTier = unlocked[subjectId] ?? 'tutorial'
  const unlockedIndex = TIER_ORDER.indexOf(unlockedTier)
  const problemTierIndex = TIER_ORDER.indexOf(problem.tier)
  const isLocked = problemTierIndex > unlockedIndex

  const baseSize = 0.1 + problem.difficulty * 0.06
  const color = isLocked ? '#4b5563' : (solved?.correct ? '#fbbf24' : '#ffffff')
  const emissiveIntensity = isLocked
    ? 0.1
    : (solved?.correct
        ? 1.5
        : problem.difficulty * 0.5 + (hovered ? 1.0 : 0))

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!isLocked) {
          setHovered(true)
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
        opacity={isLocked ? 0.4 : 1}
        transparent={isLocked}
      />
    </mesh>
  )
}
