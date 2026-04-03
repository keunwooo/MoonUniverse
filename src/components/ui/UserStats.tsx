import { useGameStore } from '../../stores/useGameStore'

const XP_PER_LEVEL = 200

export default function UserStats() {
  const progress = useGameStore((s) => s.progress)
  const xpInLevel = progress.xp % XP_PER_LEVEL
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100

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
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>정답 {progress.stats.totalSolved}</span>
        <span style={{ color: '#f87171', fontSize: '0.7rem' }}>오답 {progress.stats.totalWrong}</span>
        <span style={{ color: '#60a5fa', fontSize: '0.7rem' }}>연속 {progress.streak}</span>
      </div>
    </div>
  )
}
