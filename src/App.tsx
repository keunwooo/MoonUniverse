import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import { useProblemStore } from './stores/useProblemStore'

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)

  const handlePlanetClick = (planetId: string) => {
    console.log('Planet clicked:', planetId)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetClick}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
        />
        <OrbitControls enablePan={false} minDistance={10} maxDistance={100} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
