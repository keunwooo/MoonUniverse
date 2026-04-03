import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      </Canvas>
    </div>
  )
}
