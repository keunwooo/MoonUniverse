import { useMemo } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import Guide from './Guide'
import type { Problem } from '../../types'

import algebraData from '../../data/problems/algebra.json'
import geometryData from '../../data/problems/geometry.json'
import functionsData from '../../data/problems/functions.json'
import calculusData from '../../data/problems/calculus.json'
import probabilityData from '../../data/problems/probability.json'

const ALL_PROBLEMS: Problem[] = [
  ...algebraData.problems as Problem[],
  ...geometryData.problems as Problem[],
  ...functionsData.problems as Problem[],
  ...calculusData.problems as Problem[],
  ...probabilityData.problems as Problem[],
]

const XP_PER_LEVEL = 200

export default function UserStats() {
  const progress = useGameStore((s) => s.progress)
  const xpInLevel = progress.xp % XP_PER_LEVEL
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100

  const totalProblems = ALL_PROBLEMS.length
  const solvedProblems = useMemo(() =>
    ALL_PROBLEMS.filter(p => progress.solved[p.id]?.correct).length,
    [progress.solved]
  )
  const totalPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '0.8rem 1.2rem',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>Lv. {progress.level}</div>
        <div style={{
          flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '99px', width: '100px',
        }}>
          <div style={{
            width: `${xpPercent}%`, height: '100%',
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            borderRadius: '99px', transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{progress.xp} XP</div>
      </div>

      {/* Total progress */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>전체 진행도</span>
          <span style={{ color: '#e2e8f0', fontSize: '0.7rem', fontWeight: 600 }}>
            {solvedProblems}/{totalProblems} ({totalPercent}%)
          </span>
        </div>
        <div style={{
          height: '4px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '99px', overflow: 'hidden',
        }}>
          <div style={{
            width: `${totalPercent}%`, height: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '99px',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>정답 {progress.stats.totalSolved}</span>
        <span style={{ color: '#f87171', fontSize: '0.7rem' }}>오답 {progress.stats.totalWrong}</span>
        <span style={{ color: '#60a5fa', fontSize: '0.7rem' }}>연속 {progress.streak}</span>
      </div>
      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <button
          onClick={() => {
            if (window.confirm('진행도를 초기화하시겠습니까?')) {
              useGameStore.getState().reset()
              localStorage.removeItem('moonuniverse-progress')
              window.location.reload()
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '0.65rem',
            cursor: 'pointer',
            padding: '2px 4px',
          }}
        >
          초기화
        </button>
      </div>
      <Guide />
    </div>
  )
}
