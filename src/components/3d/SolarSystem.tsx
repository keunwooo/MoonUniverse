import Sun from './Sun'
import Planet from './Planet'
import Skybox from './Skybox'
import { solarSystem } from '../../data/solar-system'

interface Props {
  onPlanetClick: (planetId: string) => void
}

export default function SolarSystem({ onPlanetClick }: Props) {
  return (
    <>
      <Skybox />
      <ambientLight intensity={0.05} />
      <Sun />
      {solarSystem.planets.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          onClick={onPlanetClick}
        />
      ))}
    </>
  )
}
