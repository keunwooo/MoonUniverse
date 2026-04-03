import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'
import { useProblemStore } from '../../stores/useProblemStore'
import { useGameStore } from '../../stores/useGameStore'
import { calculateXp } from '../../utils/xp'
import MultipleChoice from './MultipleChoice'
import ShortAnswer from './ShortAnswer'
import FormulaInput from './FormulaInput'
import ResultBanner from './ResultBanner'
import StepSolution from './StepSolution'
import { solarSystem } from '../../data/solar-system'

export default function ProblemSolver() {
  const problem = useProblemStore((s) => s.currentProblem)
  const closeProblem = useProblemStore((s) => s.closeProblem)
  const solveProblem = useGameStore((s) => s.solveProblem)
  const streak = useGameStore((s) => s.progress.streak)
  const solved = useGameStore((s) => s.progress.solved)

  const [result, setResult] = useState<{ correct: boolean; xp: number; time: number } | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!result) {
      const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
      return () => clearInterval(interval)
    }
  }, [startTime, result])

  const handleSubmit = useCallback((answer: string) => {
    if (!problem) return

    const isCorrect = answer.toLowerCase() === problem.answer.toLowerCase()
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const attempts = (solved[problem.id]?.attempts ?? 0) + 1
    const xpEarned = isCorrect ? calculateXp(problem.xp, attempts, streak) : 0

    solveProblem(problem.id, isCorrect, problem.xp, timeTaken)
    setResult({ correct: isCorrect, xp: xpEarned, time: timeTaken })
    setShowSolution(true)
  }, [problem, startTime, solveProblem, streak, solved])

  const handleRetry = () => {
    setResult(null)
    setShowSolution(false)
  }

  if (!problem) return null

  const subject = problem.id.slice(0, 3)
  const planet = solarSystem.planets.find(p =>
    p.id.toUpperCase().startsWith(subject)
  ) ?? solarSystem.planets[0]

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timerStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(2,6,23,0.97)',
          overflowY: 'auto',
        }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={closeProblem}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            ← Back to space
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              color: planet.color, fontSize: '0.75rem', fontWeight: 600,
              background: `${planet.color}22`, padding: '3px 10px', borderRadius: '99px',
            }}>
              {planet.name}
            </span>
            <span style={{ display: 'flex', gap: '3px' }}>
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i < problem.difficulty ? '#fbbf24' : 'rgba(251,191,36,0.2)',
                }} />
              ))}
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>{timerStr}</span>
        </div>

        {/* Problem content */}
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Problem #{problem.id}
          </div>
          <div style={{ color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {problem.title}
          </div>

          <div style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '1rem' }}>
            {problem.question}
          </div>
          {problem.questionLatex && (
            <div style={{
              padding: '1.2rem', background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontSize: '1.3rem',
            }}>
              <BlockMath math={problem.questionLatex} />
            </div>
          )}

          {result && (
            <ResultBanner
              correct={result.correct}
              xpEarned={result.xp}
              time={result.time}
              onRetry={!result.correct ? handleRetry : undefined}
            />
          )}

          {showSolution && <StepSolution steps={problem.solution} />}

          {!result && (
            <>
              {problem.inputType === 'multiple' && problem.choices && (
                <MultipleChoice choices={problem.choices} onSubmit={handleSubmit} disabled={!!result} />
              )}
              {problem.inputType === 'short' && (
                <ShortAnswer onSubmit={handleSubmit} disabled={!!result} />
              )}
              {problem.inputType === 'formula' && (
                <FormulaInput onSubmit={handleSubmit} disabled={!!result} />
              )}
            </>
          )}

          {result && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
              <button
                onClick={closeProblem}
                style={{
                  padding: '0.6rem 1.5rem', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem',
                  cursor: 'pointer', background: 'transparent',
                }}
              >
                ← Back to space
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
