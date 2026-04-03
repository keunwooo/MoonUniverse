import { useProblemStore } from '../../stores/useProblemStore'
import { solarSystem } from '../../data/solar-system'

export default function ProblemPreview() {
  const problem = useProblemStore((s) => s.hoveredProblem)
  if (!problem) return null

  const subject = problem.id.slice(0, 3)
  const planet = solarSystem.planets.find(p =>
    p.id.toUpperCase().startsWith(subject)
  ) ?? solarSystem.planets[0]

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '2rem',
      transform: 'translateY(-50%)',
      background: 'rgba(15,23,42,0.95)',
      border: `1px solid ${planet.color}44`,
      borderRadius: '12px',
      padding: '1rem',
      width: '280px',
      backdropFilter: 'blur(10px)',
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{
          color: planet.color,
          fontSize: '0.7rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
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
      <div style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>
        {problem.title}
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.7rem' }}>
        {problem.question}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
          {problem.tier} · {problem.inputType}
        </span>
        <span style={{ color: '#60a5fa', fontSize: '0.75rem' }}>
          Click to solve →
        </span>
      </div>
    </div>
  )
}
