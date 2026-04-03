import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import CameraController from './components/3d/CameraController'
import HUD from './components/ui/HUD'
import ProblemPreview from './components/ui/ProblemPreview'
import ProblemSolver from './components/ui/ProblemSolver'
import { useProblemStore } from './stores/useProblemStore'
import { solarSystem } from './data/solar-system'

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null)
  const [activePlanet, setActivePlanet] = useState<string | null>(null)

  const handlePlanetSelect = useCallback((planetId: string) => {
    setActivePlanet(planetId)
    const planet = solarSystem.planets.find(p => p.id === planetId)
    if (planet) {
      setCameraTarget([planet.orbitRadius * 0.7, 2, planet.orbitRadius * 0.7])
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetSelect}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
        />
        <CameraController target={cameraTarget} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
      <HUD activePlanet={activePlanet} onPlanetSelect={handlePlanetSelect} />
      <ProblemPreview />
      <ProblemSolver />
    </div>
  )
}
