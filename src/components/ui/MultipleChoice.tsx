import { useState } from 'react'
import type { Choice } from '../../types'

interface Props {
  choices: Choice[]
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function MultipleChoice({ choices, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {choices.map((choice) => (
          <button
            key={choice.label}
            onClick={() => !disabled && setSelected(choice.label)}
            style={{
              padding: '1rem',
              border: selected === choice.label
                ? '2px solid #60a5fa'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              background: selected === choice.label ? 'rgba(96,165,250,0.08)' : 'transparent',
              color: selected === choice.label ? '#f1f5f9' : '#cbd5e1',
              fontSize: '0.95rem',
              cursor: disabled ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ color: selected === choice.label ? '#60a5fa' : '#64748b', marginRight: '0.5rem' }}>
              {choice.label}.
            </span>
            {choice.text}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || disabled}
          style={{
            background: selected ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e293b',
            color: '#fff',
            padding: '0.7rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: selected && !disabled ? 'pointer' : 'default',
            opacity: selected && !disabled ? 1 : 0.5,
            fontSize: '1rem',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
