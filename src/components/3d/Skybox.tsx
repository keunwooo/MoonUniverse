import { Stars } from '@react-three/drei'

export default function Skybox() {
  return (
    <>
      <color attach="background" args={['#0a0a1a']} />
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  )
}
