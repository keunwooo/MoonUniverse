import { motion } from 'framer-motion'

interface Props {
  correct: boolean
  xpEarned: number
  time: number
  onRetry?: () => void
}

export default function ResultBanner({ correct, xpEarned, time, onRetry }: Props) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: '12px',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>
        {correct ? '✓' : '✗'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: correct ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '1.05rem' }}>
          {correct ? 'Correct!' : 'Incorrect'}
        </div>
        <div style={{ color: correct ? '#86efac' : '#fca5a5', fontSize: '0.8rem' }}>
          {correct ? `+${xpEarned} XP · Solved in ${timeStr}` : `Time: ${timeStr}`}
        </div>
      </div>
      {!correct && onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Retry
        </button>
      )}
    </motion.div>
  )
}
