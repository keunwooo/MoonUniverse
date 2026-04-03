import type { Problem, SolvedRecord, Tier } from '../types'

const TIER_ORDER: Tier[] = ['tutorial', 'easy', 'medium', 'hard', 'expert']
const UNLOCK_THRESHOLD = 0.7

export function getUnlockedTier(
  problems: Problem[],
  solved: Record<string, SolvedRecord>,
): Tier {
  let highestUnlocked: Tier = 'tutorial'

  for (let i = 0; i < TIER_ORDER.length - 1; i++) {
    const currentTier = TIER_ORDER[i]
    const nextTier = TIER_ORDER[i + 1]

    const tierProblems = problems.filter(p => p.tier === currentTier)
    if (tierProblems.length === 0) continue

    const solvedCount = tierProblems.filter(p => solved[p.id]?.correct).length
    const ratio = solvedCount / tierProblems.length

    if (currentTier === 'tutorial') {
      if (ratio >= 1.0) highestUnlocked = nextTier
      else break
    } else {
      if (ratio >= UNLOCK_THRESHOLD) highestUnlocked = nextTier
      else break
    }
  }

  return highestUnlocked
}

export function isSunUnlocked(unlocked: Record<string, Tier>): boolean {
  const hardOrAbove = Object.values(unlocked).filter(
    tier => tier === 'hard' || tier === 'expert'
  )
  return hardOrAbove.length >= 3
}
