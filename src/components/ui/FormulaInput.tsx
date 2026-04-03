import { useState } from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

interface Props {
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function FormulaInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {value && (
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '1.3rem',
        }}>
          <InlineMath math={value || '\\text{...}'} />
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        placeholder="Type LaTeX: e.g. x = \frac{1}{2}"
        style={{
          width: '400px',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#f1f5f9',
          fontSize: '0.95rem',
          fontFamily: 'monospace',
          textAlign: 'center',
          outline: 'none',
        }}
      />
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          style={{
            background: value.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e293b',
            color: '#fff',
            padding: '0.7rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: value.trim() && !disabled ? 'pointer' : 'default',
            opacity: value.trim() && !disabled ? 1 : 0.5,
            fontSize: '1rem',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
