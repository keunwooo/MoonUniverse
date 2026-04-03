import { useMemo } from 'react'
import { solarSystem } from '../../data/solar-system'
import { useGameStore } from '../../stores/useGameStore'
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

interface Props {
  planetId: string | null
}

const TIERS: Tier[] = ['tutorial', 'easy', 'medium', 'hard', 'expert']

const TIER_KO: Record<Tier, string> = {
  tutorial: '입문',
  easy: '기초',
  medium: '보통',
  hard: '심화',
  expert: '전문가',
}

export default function PlanetInfo({ planetId }: Props) {
  const planet = solarSystem.planets.find(p => p.id === planetId)
  const unlocked = useGameStore((s) => s.progress.unlocked)
  const solved = useGameStore((s) => s.progress.solved)

  const stats = useMemo(() => {
    if (!planet) return null
    const problems = ALL_PROBLEMS[planet.id] ?? []
    const total = problems.length
    const solvedCount = problems.filter(p => solved[p.id]?.correct).length
    const remaining = total - solvedCount
    const percent = total > 0 ? Math.round((solvedCount / total) * 100) : 0

    // Per-tier stats
    const tierStats = TIERS.map(tier => {
      const tierProblems = problems.filter(p => p.tier === tier)
      const tierSolved = tierProblems.filter(p => solved[p.id]?.correct).length
      return { tier, total: tierProblems.length, solved: tierSolved }
    }).filter(t => t.total > 0)

    return { total, solvedCount, remaining, percent, tierStats }
  }, [planet, solved])

  if (!planet || !stats) return null

  const currentTier = unlocked[planet.id] ?? 'tutorial'
  const currentTierIndex = TIERS.indexOf(currentTier)

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: `1px solid ${planet.color}33`,
      borderRadius: '12px',
      padding: '1rem 1.2rem',
      backdropFilter: 'blur(10px)',
      width: '280px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          background: planet.color,
        }} />
        <span style={{ color: planet.color, fontWeight: 700, fontSize: '1rem' }}>{planet.name}</span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {stats.solvedCount} / {stats.total} 문제
          </span>
          <span style={{ color: planet.color, fontSize: '0.8rem', fontWeight: 600 }}>
            {stats.percent}%
          </span>
        </div>
        <div style={{
          height: '6px', background: 'rgba(255,255,255,0.08)',
          borderRadius: '99px', overflow: 'hidden',
        }}>
          <div style={{
            width: `${stats.percent}%`, height: '100%',
            background: `linear-gradient(90deg, ${planet.color}, ${planet.color}aa)`,
            borderRadius: '99px',
            transition: 'width 0.3s',
          }} />
        </div>
        {stats.remaining > 0 && (
          <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '3px' }}>
            남은 문제: {stats.remaining}개
          </div>
        )}
        {stats.remaining === 0 && (
          <div style={{ color: '#4ade80', fontSize: '0.7rem', marginTop: '3px' }}>
            🎉 전부 완료!
          </div>
        )}
      </div>

      {/* Tier badges with counts */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {stats.tierStats.map(({ tier, total, solved: tierSolved }) => {
          const tierIndex = TIERS.indexOf(tier)
          const isUnlocked = tierIndex <= currentTierIndex
          const isComplete = tierSolved === total
          return (
            <span key={tier} style={{
              fontSize: '0.75rem',
              color: isComplete ? '#4ade80' : isUnlocked ? '#e2e8f0' : '#64748b',
              background: isComplete
                ? 'rgba(34,197,94,0.15)'
                : isUnlocked
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.03)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: `1px solid ${isComplete ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
            }}>
              {isUnlocked ? '' : '🔒 '}{TIER_KO[tier]} {tierSolved}/{total}
            </span>
          )
        })}
      </div>
    </div>
  )
}
