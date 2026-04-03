import { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import CameraController from './components/3d/CameraController'
import HUD from './components/ui/HUD'
import ProblemPreview from './components/ui/ProblemPreview'
import ProblemSolver from './components/ui/ProblemSolver'
import NextStarHint from './components/ui/NextStarHint'
import { useProblemStore } from './stores/useProblemStore'
import { useGameStore } from './stores/useGameStore'
import { solarSystem } from './data/solar-system'
import { getStarPosition } from './hooks/useStarPositions'
import { PREFIX_MAP } from './utils/planet-lookup'
import type { Problem } from './types'

import algebraData from './data/problems/algebra.json'
import geometryData from './data/problems/geometry.json'
import functionsData from './data/problems/functions.json'
import calculusData from './data/problems/calculus.json'
import probabilityData from './data/problems/probability.json'

const SUBJECT_PROBLEMS: Record<string, Problem[]> = {
  algebra: algebraData.problems as Problem[],
  geometry: geometryData.problems as Problem[],
  functions: functionsData.problems as Problem[],
  calculus: calculusData.problems as Problem[],
  probability: probabilityData.problems as Problem[],
}

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)
  const currentProblem = useProblemStore((s) => s.currentProblem)
  const closeProblem = useProblemStore((s) => s.closeProblem)
  const solved = useGameStore((s) => s.progress.solved)
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null)
  const [activePlanet, setActivePlanet] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentProblem) {
          closeProblem()
        } else if (cameraTarget) {
          setCameraTarget(null)
          setActivePlanet(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentProblem, closeProblem, cameraTarget])

  const handlePlanetSelect = useCallback((planetId: string, position?: [number, number, number]) => {
    if (!planetId) {
      setActivePlanet(null)
      setCameraTarget(null)
      return
    }
    setActivePlanet(planetId)
    if (position) {
      setCameraTarget(position)
    } else {
      // SubjectNav click: target a point on the orbit ring
      const planet = solarSystem.planets.find(p => p.id === planetId)
      if (planet) {
        setCameraTarget([planet.orbitRadius, 0, 0])
      }
    }
  }, [])

  const handleMoonClick = useCallback((planetId: string) => {
    const problems = SUBJECT_PROBLEMS[planetId] ?? []
    const firstUnsolved = problems.find(p => p.tier === 'tutorial' && !solved[p.id]?.correct)
    if (firstUnsolved) {
      setCurrentProblem(firstUnsolved)
    } else {
      handlePlanetSelect(planetId)
    }
  }, [solved, setCurrentProblem, handlePlanetSelect])

  const handleFocusStar = useCallback((problem: Problem) => {
    const prefix = problem.id.slice(0, 3).toUpperCase()
    const subjectId = PREFIX_MAP[prefix] ?? 'algebra'
    const planet = solarSystem.planets.find(p => p.id === subjectId)
    if (!planet) return
    setActivePlanet(subjectId)
    const pos = getStarPosition(problem, planet)
    setCameraTarget(pos)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetSelect}
          onMoonClick={handleMoonClick}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
          activePlanet={activePlanet}
        />
        <CameraController target={cameraTarget} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
      <HUD activePlanet={activePlanet} onPlanetSelect={handlePlanetSelect} />
      <ProblemPreview />
      {currentProblem && <ProblemSolver key={currentProblem.id} />}
      <NextStarHint
        activePlanet={activePlanet}
        onNavigate={(problem) => setCurrentProblem(problem)}
        onFocus={handleFocusStar}
      />
    </div>
  )
}
