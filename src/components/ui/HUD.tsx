import SubjectNav from './SubjectNav'
import UserStats from './UserStats'
import PlanetInfo from './PlanetInfo'
import MiniMap from './MiniMap'
import MoonBrand from './MoonBrand'

interface Props {
  activePlanet: string | null
  onPlanetSelect: (planetId: string) => void
}

export default function HUD({ activePlanet, onPlanetSelect }: Props) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      padding: '1rem',
      zIndex: 10,
    }}>
      <MoonBrand />

      <div style={{ position: 'absolute', top: '3.8rem', left: '1rem', pointerEvents: 'auto' }}>
        <SubjectNav activePlanet={activePlanet} onPlanetSelect={onPlanetSelect} />
      </div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', pointerEvents: 'auto' }}>
        <UserStats />
      </div>
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', pointerEvents: 'auto' }}>
        <PlanetInfo planetId={activePlanet} />
      </div>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', pointerEvents: 'auto' }}>
        <MiniMap />
      </div>
    </div>
  )
}
