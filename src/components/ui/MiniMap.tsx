import { solarSystem } from '../../data/solar-system'

export default function MiniMap() {
  const maxOrbit = Math.max(...solarSystem.planets.map(p => p.orbitRadius))
  const scale = 55 / maxOrbit

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '0.8rem',
      backdropFilter: 'blur(10px)',
      width: '140px',
      height: '140px',
      position: 'relative',
    }}>
      <div style={{ color: '#64748b', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Solar Map
      </div>
      <svg width="120" height="110" viewBox="-60 -55 120 110" style={{ position: 'absolute', top: '25px', left: '10px' }}>
        {solarSystem.planets.map((planet) => (
          <circle
            key={`orbit-${planet.id}`}
            cx={0} cy={0}
            r={planet.orbitRadius * scale}
            fill="none"
            stroke={planet.color}
            strokeOpacity={0.2}
            strokeWidth={0.5}
          />
        ))}
        <circle cx={0} cy={0} r={3} fill="#fbbf24" />
        {solarSystem.planets.map((planet) => (
          <circle
            key={planet.id}
            cx={planet.orbitRadius * scale * 0.7}
            cy={planet.orbitRadius * scale * -0.3}
            r={2.5}
            fill={planet.color}
          />
        ))}
      </svg>
    </div>
  )
}
