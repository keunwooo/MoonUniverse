import { useMemo } from 'react'
import type { Problem, PlanetConfig } from '../types'

interface StarPosition {
  problem: Problem
  position: [number, number, number]
}

function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return () => {
    hash = (hash * 16807) % 2147483647
    return (hash & 0x7fffffff) / 0x7fffffff
  }
}

export function useStarPositions(
  problems: Problem[],
  planet: PlanetConfig,
): StarPosition[] {
  return useMemo(() => {
    return problems.map((problem) => {
      const rand = seededRandom(problem.id)
      const tierOffset = {
        tutorial: 0.9,
        easy: 0.75,
        medium: 0.55,
        hard: 0.35,
        expert: 0.15,
      }
      const baseRadius = planet.orbitRadius * (tierOffset[problem.tier] ?? 0.5)
      const radiusJitter = (rand() - 0.5) * 2
      const radius = baseRadius + radiusJitter
      const angle = rand() * Math.PI * 2
      const yOffset = (rand() - 0.5) * 4

      return {
        problem,
        position: [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      }
    })
  }, [problems, planet])
}
