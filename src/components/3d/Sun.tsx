import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { getPlanetTexture } from '../../utils/procedural-textures'

export default function Sun() {
  const ref = useRef<Mesh>(null)
  const texture = useMemo(() => getPlanetTexture('sun'), [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ff8800"
        emissiveIntensity={2.5}
      />
      <pointLight color="#ffd080" intensity={100} distance={200} />
    </mesh>
  )
}
