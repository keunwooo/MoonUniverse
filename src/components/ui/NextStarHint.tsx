import { useMemo } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import { getPlanetForProblem } from '../../utils/planet-lookup'
import type { Problem, Tier } from '../../types'

import algebraData from '../../data/problems/algebra.json'
import geometryData from '../../data/problems/geometry.json'
import functionsData from '../../data/problems/functions.json'
import calculusData from '../../data/problems/calculus.json'
import probabilityData from '../../data/problems/probability.json'

const ALL_PROBLEMS: Record<string, Problem[]> = {
  algebra: algebraData.problems as Problem[],
  geometry: geometryData.problems as Problem[],
  functions: functionsData.problems as Problem[],
  calculus: calculusData.problems as Problem[],
  probability: probabilityData.problems as Problem[],
}

const TIER_ORDER: Tier[] = ['tutorial', 'easy', 'medium', 'hard', 'expert']
const TIER_KO: Record<string, string> = {
  tutorial: '입문', easy: '기초', medium: '보통', hard: '심화', expert: '전문가',
}

interface Props {
  activePlanet: string | null
  onNavigate: (problem: Problem) => void
  onFocus: (problem: Problem) => void
}

export default function NextStarHint({ activePlanet, onNavigate, onFocus }: Props) {
  const solved = useGameStore((s) => s.progress.solved)
  const unlocked = useGameStore((s) => s.progress.unlocked)

  const nextProblem = useMemo(() => {
    if (!activePlanet) return null
    const problems = ALL_PROBLEMS[activePlanet] ?? []
    const unlockedTier = unlocked[activePlanet] ?? 'tutorial'
    const unlockedIndex = TIER_ORDER.indexOf(unlockedTier)

    // Find first unsolved problem in the lowest unlocked tier
    for (let i = 0; i <= unlockedIndex; i++) {
      const tier = TIER_ORDER[i]
      const tierProblems = problems.filter(p => p.tier === tier)
      const unsolved = tierProblems.find(p => !solved[p.id]?.correct)
      if (unsolved) return unsolved
    }
    return null
  }, [activePlanet, solved, unlocked])

  if (!nextProblem) return null

  const planet = getPlanetForProblem(nextProblem.id)

  return (
    <div style={{
      position: 'fixed',
      bottom: '5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 15,
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.9)',
        border: `1px solid ${planet.color}66`,
        borderRadius: '12px',
        padding: '10px 16px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: `0 0 20px ${planet.color}22`,
      }}>
        <span style={{ fontSize: '1.2rem' }}>⭐</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', color: planet.color, fontWeight: 600 }}>
            다음 추천 문제
          </div>
          <div style={{ fontSize: '0.85rem', color: '#f1f5f9' }}>
            {nextProblem.title} · {TIER_KO[nextProblem.tier]}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
          <button
            onClick={() => onFocus(nextProblem)}
            title="별 위치로 이동"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: '#94a3b8',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🔍 초점
          </button>
          <button
            onClick={() => onNavigate(nextProblem)}
            style={{
              background: `linear-gradient(135deg, ${planet.color}, ${planet.color}cc)`,
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            풀기 →
          </button>
        </div>
      </div>
    </div>
  )
}
