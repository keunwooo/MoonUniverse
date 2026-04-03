import Sun from './Sun'
import Planet from './Planet'
import Star from './Star'
import Skybox from './Skybox'
import { solarSystem } from '../../data/solar-system'
import { useStarPositions } from '../../hooks/useStarPositions'
import type { Problem, PlanetConfig } from '../../types'

import algebraData from '../../data/problems/algebra.json'
import geometryData from '../../data/problems/geometry.json'
import functionsData from '../../data/problems/functions.json'
import calculusData from '../../data/problems/calculus.json'
import probabilityData from '../../data/problems/probability.json'

const problemMap: Record<string, Problem[]> = {
  algebra: algebraData.problems as Problem[],
  geometry: geometryData.problems as Problem[],
  functions: functionsData.problems as Problem[],
  calculus: calculusData.problems as Problem[],
  probability: probabilityData.problems as Problem[],
}

interface Props {
  onPlanetClick: (planetId: string) => void
  onStarHover: (problem: Problem | null) => void
  onStarClick: (problem: Problem) => void
  activePlanet: string | null
}

function PlanetStars({ planet, onStarHover, onStarClick, dimmed }: {
  planet: PlanetConfig
  onStarHover: (problem: Problem | null) => void
  onStarClick: (problem: Problem) => void
  dimmed: boolean
}) {
  const problems = problemMap[planet.id] ?? []
  const stars = useStarPositions(problems, planet)

  return (
    <>
      {stars.map((star) => (
        <Star
          key={star.problem.id}
          problem={star.problem}
          position={star.position}
          onHover={onStarHover}
          onClick={onStarClick}
          dimmed={dimmed}
        />
      ))}
    </>
  )
}

export default function SolarSystem({ onPlanetClick, onStarHover, onStarClick, activePlanet }: Props) {
  return (
    <>
      <Skybox />
      <ambientLight intensity={0.05} />
      <Sun />
      {solarSystem.planets.map((planet) => (
        <group key={planet.id}>
          <Planet config={planet} onClick={onPlanetClick} />
          <PlanetStars
            planet={planet}
            onStarHover={onStarHover}
            onStarClick={onStarClick}
            dimmed={activePlanet !== null && activePlanet !== planet.id}
          />
        </group>
      ))}
    </>
  )
}
