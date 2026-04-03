import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import type { Mesh } from 'three'

function Moon3D() {
  const ref = useRef<Mesh>(null)
  const texture = useTexture(`${import.meta.env.BASE_URL}textures/moon.jpg`)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 2, 4]} intensity={1.5} color="#ffeedd" />
      <mesh ref={ref}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.15}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </>
  )
}

export default function MoonBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: '0.6rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 12,
        pointerEvents: 'auto',
        cursor: 'default',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* 3D Moon */}
      <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(251,191,36,0.25)',
          flexShrink: 0,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true }}
        >
          <Moon3D />
        </Canvas>
      </div>

      {/* Text */}
      <div style={{ lineHeight: 1.1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '3px',
        }}>
          <span style={{
            color: '#fef3c7',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '2px',
            textShadow: '0 0 12px rgba(251,191,36,0.3)',
          }}>
            MOON
          </span>
          <span style={{
            color: '#64748b',
            fontSize: '16px',
            fontWeight: 400,
            letterSpacing: '1px',
          }}>
            UNIVERSE
          </span>
        </div>
        <div style={{ marginTop: '2px' }}>
          <span style={{
            color: '#fbbf24',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textShadow: '0 0 8px rgba(251,191,36,0.25)',
          }}>
            for 문아현 ✨
          </span>
        </div>
      </div>
    </motion.div>
  )
}
