import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import type { Mesh } from 'three'

/**
 * MoonUniverse identity — 3D rotating moon in top-left corner.
 * Inspired by 문아현 (Moon).
 */

function Moon3D() {
  const ref = useRef<Mesh>(null)
  const texture = useTexture('/textures/moon.jpg')

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
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        top: '-10px',
        left: '-10px',
        zIndex: 8,
        pointerEvents: 'auto',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        style={{ position: 'relative', width: '160px', height: '160px' }}
      >
        {/* 3D Moon Canvas */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 0 50px rgba(200,190,170,0.35), 0 0 100px rgba(200,190,170,0.15)'
            : '0 0 30px rgba(200,190,170,0.2), 0 0 60px rgba(200,190,170,0.08)',
          transition: 'box-shadow 0.3s',
        }}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true }}
          >
            <Moon3D />
          </Canvas>
        </div>

        {/* Brand text overlay */}
        <div style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            color: '#fef3c7',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '3px',
            textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 15px rgba(251,191,36,0.3)',
          }}>
            MOON
          </div>
          <div style={{
            color: 'rgba(254,243,199,0.5)',
            fontSize: '7px',
            letterSpacing: '2px',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}>
            UNIVERSE
          </div>
        </div>
      </motion.div>

      {/* Hover message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '148px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <span style={{
          color: '#fbbf24',
          fontSize: '11px',
          fontWeight: 600,
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
          letterSpacing: '1px',
        }}>
          for 문아현 ✨
        </span>
      </motion.div>
    </motion.div>
  )
}
