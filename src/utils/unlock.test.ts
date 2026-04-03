import { describe, it, expect } from 'vitest'
import { getUnlockedTier, isSunUnlocked } from './unlock'
import type { Problem, SolvedRecord } from '../types'

const makeProblem = (id: string, tier: Problem['tier']): Problem => ({
  id, title: '', difficulty: 1, tier, inputType: 'multiple',
  question: '', answer: '', solution: [], xp: 10, tags: [],
})

describe('getUnlockedTier', () => {
  const problems: Problem[] = [
    makeProblem('T1', 'tutorial'),
    makeProblem('T2', 'tutorial'),
    makeProblem('E1', 'easy'),
    makeProblem('E2', 'easy'),
    makeProblem('E3', 'easy'),
    makeProblem('M1', 'medium'),
    makeProblem('M2', 'medium'),
  ]

  it('returns tutorial when nothing solved', () => {
    expect(getUnlockedTier(problems, {})).toBe('tutorial')
  })

  it('returns easy when all tutorials solved', () => {
    const solved: Record<string, SolvedRecord> = {
      T1: { correct: true, attempts: 1, time: 10 },
      T2: { correct: true, attempts: 1, time: 10 },
    }
    expect(getUnlockedTier(problems, solved)).toBe('easy')
  })

  it('returns medium when 70%+ of easy solved', () => {
    const solved: Record<string, SolvedRecord> = {
      T1: { correct: true, attempts: 1, time: 10 },
      T2: { correct: true, attempts: 1, time: 10 },
      E1: { correct: true, attempts: 1, time: 10 },
      E2: { correct: true, attempts: 1, time: 10 },
    }
    expect(getUnlockedTier(problems, solved)).toBe('easy')
    solved['E3'] = { correct: true, attempts: 1, time: 10 }
    expect(getUnlockedTier(problems, solved)).toBe('medium')
  })
})

describe('isSunUnlocked', () => {
  it('returns false when fewer than 3 planets at hard', () => {
    const unlocked = { algebra: 'hard' as const, geometry: 'medium' as const, functions: 'easy' as const, calculus: 'tutorial' as const, probability: 'tutorial' as const }
    expect(isSunUnlocked(unlocked)).toBe(false)
  })

  it('returns true when 3+ planets at hard or expert', () => {
    const unlocked = { algebra: 'hard' as const, geometry: 'hard' as const, functions: 'hard' as const, calculus: 'tutorial' as const, probability: 'tutorial' as const }
    expect(isSunUnlocked(unlocked)).toBe(true)
  })
})
