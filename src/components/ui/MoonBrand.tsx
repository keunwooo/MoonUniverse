import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * MoonUniverse identity — large realistic moon in top-left corner.
 * Inspired by 문아현 (Moon).
 */
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
        top: '-20px',
        left: '-20px',
        zIndex: 8,
        pointerEvents: 'auto',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Large moon image */}
      <motion.div
        animate={{ scale: hovered ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        style={{ position: 'relative' }}
      >
        <img
          src="/textures/moon.jpg"
          alt="Moon"
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 40px rgba(200,190,170,0.25), 0 0 80px rgba(200,190,170,0.1)',
            border: '1px solid rgba(200,190,170,0.15)',
            filter: hovered ? 'brightness(1.2)' : 'brightness(0.9)',
            transition: 'filter 0.3s',
          }}
        />

        {/* Moon glow overlay */}
        <div style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Brand text overlay on moon */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            color: '#fef3c7',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '3px',
            textShadow: '0 0 8px rgba(0,0,0,0.8), 0 0 20px rgba(251,191,36,0.3)',
          }}>
            MOON
          </div>
          <div style={{
            color: 'rgba(254,243,199,0.6)',
            fontSize: '7px',
            letterSpacing: '2px',
            textShadow: '0 0 6px rgba(0,0,0,0.8)',
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
          top: '145px',
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
