import { solarSystem } from '../../data/solar-system'
import { useGameStore } from '../../stores/useGameStore'
import type { Tier } from '../../types'

interface Props {
  planetId: string | null
}

const TIERS: Tier[] = ['tutorial', 'easy', 'medium', 'hard', 'expert']

export default function PlanetInfo({ planetId }: Props) {
  const planet = solarSystem.planets.find(p => p.id === planetId)
  const unlocked = useGameStore((s) => s.progress.unlocked)

  if (!planet) return null

  const currentTier = unlocked[planet.id] ?? 'tutorial'
  const currentTierIndex = TIERS.indexOf(currentTier)

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: `1px solid ${planet.color}33`,
      borderRadius: '12px',
      padding: '1rem 1.2rem',
      backdropFilter: 'blur(10px)',
      width: '220px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          background: planet.color,
        }} />
        <span style={{ color: planet.color, fontWeight: 700, fontSize: '0.9rem' }}>{planet.name}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {TIERS.map((tier, i) => {
          const isUnlocked = i <= currentTierIndex
          return (
            <span key={tier} style={{
              fontSize: '0.6rem',
              color: isUnlocked ? '#4ade80' : '#64748b',
              background: isUnlocked ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {tier} {isUnlocked ? '✓' : '🔒'}
            </span>
          )
        })}
      </div>
    </div>
  )
}
