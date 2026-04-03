import { useState } from 'react'

interface Props {
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function ShortAnswer({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        placeholder="답을 입력하세요..."
        style={{
          width: '300px',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#f1f5f9',
          fontSize: '1.1rem',
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
          정답 제출
        </button>
      </div>
    </div>
  )
}
