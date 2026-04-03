import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export default function Sun() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={3}
      />
      <pointLight color="#fbbf24" intensity={100} distance={200} />
    </mesh>
  )
}
