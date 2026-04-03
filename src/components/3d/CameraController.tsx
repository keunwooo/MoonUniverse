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

      // Camera positioned at an offset for good viewing angle
      const dist = 12
      targetPos.current.set(x + dist * 0.5, y + dist * 0.7, z + dist)
      isAnimating.current = true
    } else {
      targetPos.current.set(0, 30, 50)
      targetLookAt.current.set(0, 0, 0)
      isAnimating.current = true
    }
  }, [target])

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return

    // Disable user controls during animation
    controlsRef.current.enabled = false

    camera.position.lerp(targetPos.current, 0.06)
    controlsRef.current.target.lerp(targetLookAt.current, 0.06)
    controlsRef.current.update()

    if (camera.position.distanceTo(targetPos.current) < 0.3) {
      isAnimating.current = false
      controlsRef.current.enabled = true
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
