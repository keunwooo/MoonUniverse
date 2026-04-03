import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'
import type { SolutionStep } from '../../types'

interface Props {
  steps: SolutionStep[]
}

export default function StepSolution({ steps }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < steps.length) {
      const timer = setTimeout(() => setVisibleCount(v => v + 1), 600)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, steps.length])

  return (
    <div>
      <div style={{
        color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: '1rem',
      }}>
        단계별 풀이
      </div>
      <div style={{ borderLeft: '2px solid rgba(96,165,250,0.3)', paddingLeft: '1.5rem' }}>
        <AnimatePresence>
          {steps.slice(0, visibleCount).map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: '1.5rem', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: '-1.85rem', top: 0,
                width: '12px', height: '12px', borderRadius: '50%',
                background: i === steps.length - 1 ? '#4ade80' : '#3b82f6',
              }} />
              <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                풀이 {step.step}: {step.title}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{step.text}</div>
              {step.latex && (
                <div style={{
                  marginTop: '0.5rem', padding: '0.6rem',
                  background: 'rgba(255,255,255,0.03)', borderRadius: '6px',
                  fontSize: '1.1rem', textAlign: 'center',
                }}>
                  <InlineMath math={step.latex} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
