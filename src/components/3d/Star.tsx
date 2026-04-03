import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Problem } from '../../types'
import { useGameStore } from '../../stores/useGameStore'

interface Props {
  problem: Problem
  position: [number, number, number]
  onHover: (problem: Problem | null) => void
  onClick: (problem: Problem) => void
}

export default function Star({ problem, position, onHover, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const solved = useGameStore((s) => s.progress.solved[problem.id])

  const baseSize = 0.1 + problem.difficulty * 0.06
  const color = solved?.correct ? '#fbbf24' : '#ffffff'
  const emissiveIntensity = solved?.correct
    ? 1.5
    : problem.difficulty * 0.5 + (hovered ? 1.0 : 0)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(problem)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(problem)
      }}
    >
      <sphereGeometry args={[baseSize, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}
