import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * MoonUniverse identity brand — always visible.
 * Inspired by 문아현 (Moon).
 * Crescent moon logo + subtle branding at top center.
 */
export default function MoonBrand() {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        top: '0.8rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 12,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Crescent Moon SVG */}
      <motion.svg
        width="28"
        height="28"
        viewBox="0 0 100 100"
        animate={{ rotate: hovered ? 15 : 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </radialGradient>
          <filter id="moonShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.6" />
          </filter>
        </defs>
        {/* Crescent: circle minus overlapping circle */}
        <circle cx="45" cy="50" r="35" fill="url(#moonGlow)" filter="url(#moonShadow)" />
        <circle cx="60" cy="42" r="30" fill="#020010" />
      </motion.svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          color: '#fef3c7',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(251,191,36,0.3)',
        }}>
          MOON
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>UNIVERSE</span>
        </span>
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: hovered ? 1 : 0,
            width: hovered ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            color: '#fbbf24',
            fontSize: '9px',
            letterSpacing: '1px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            marginTop: '2px',
          }}
        >
          for 문아현 ✨
        </motion.span>
      </div>
    </motion.div>
  )
}
