import { solarSystem } from '../../data/solar-system'

interface Props {
  activePlanet: string | null
  onPlanetSelect: (planetId: string) => void
}

export default function SubjectNav({ activePlanet, onPlanetSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {solarSystem.planets.map((planet) => (
        <button
          key={planet.id}
          onClick={() => onPlanetSelect(planet.id)}
          style={{
            background: activePlanet === planet.id
              ? `${planet.color}33`
              : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activePlanet === planet.id ? planet.color : 'rgba(255,255,255,0.1)'}`,
            color: activePlanet === planet.id ? planet.color : '#64748b',
            padding: '0.4rem 0.8rem',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {activePlanet === planet.id && '● '}{planet.name}
        </button>
      ))}
    </div>
  )
}
