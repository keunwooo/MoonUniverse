import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface Props {
  parentPosition: [number, number, number]
  color: string
}

export default function Moon({ parentPosition, color }: Props) {
  const ref = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    angleRef.current += delta * 1.5
    if (ref.current) {
      ref.current.position.x = parentPosition[0] + Math.cos(angleRef.current) * 2.5
      ref.current.position.y = parentPosition[1]
      ref.current.position.z = parentPosition[2] + Math.sin(angleRef.current) * 2.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#9ca3af" emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}
