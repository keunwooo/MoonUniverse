import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  target: [number, number, number] | null
  onArrived?: () => void
}

export default function CameraController({ target, onArrived }: Props) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 30, 50))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const isAnimating = useRef(false)

  useEffect(() => {
    if (target) {
      const [x, y, z] = target
      targetLookAt.current.set(x, y, z)
      // Position camera offset from target for a good viewing angle
      const dist = Math.sqrt(x * x + z * z) * 0.3 + 8
      targetPos.current.set(x + dist * 0.4, y + dist * 0.6, z + dist * 0.7)
      isAnimating.current = true
    } else {
      targetPos.current.set(0, 30, 50)
      targetLookAt.current.set(0, 0, 0)
      isAnimating.current = true
    }
  }, [target])

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return

    camera.position.lerp(targetPos.current, 0.04)
    controlsRef.current.target.lerp(targetLookAt.current, 0.04)
    controlsRef.current.update()

    if (camera.position.distanceTo(targetPos.current) < 0.1) {
      isAnimating.current = false
      onArrived?.()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      panSpeed={0.8}
      minDistance={3}
      maxDistance={120}
      enableDamping
      dampingFactor={0.08}
    />
  )
}
