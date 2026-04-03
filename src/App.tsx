import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SolarSystem from './components/3d/SolarSystem'

export default function App() {
  const handlePlanetClick = (planetId: string) => {
    console.log('Planet clicked:', planetId)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem onPlanetClick={handlePlanetClick} />
        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>
    </div>
  )
}
