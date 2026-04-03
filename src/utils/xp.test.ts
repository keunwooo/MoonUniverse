import { describe, it, expect } from 'vitest'
import { calculateXp } from './xp'

describe('calculateXp', () => {
  it('returns full XP on first attempt', () => {
    expect(calculateXp(20, 1, 0)).toBe(20)
  })
  it('returns 70% XP on 2nd attempt', () => {
    expect(calculateXp(20, 2, 0)).toBe(14)
  })
  it('returns 70% XP on 3rd attempt', () => {
    expect(calculateXp(20, 3, 0)).toBe(14)
  })
  it('returns 50% XP on 4th+ attempt', () => {
    expect(calculateXp(20, 4, 0)).toBe(10)
    expect(calculateXp(20, 10, 0)).toBe(10)
  })
  it('applies 1.5x streak bonus when streak >= 3', () => {
    expect(calculateXp(20, 1, 3)).toBe(30)
    expect(calculateXp(20, 1, 5)).toBe(30)
  })
  it('no streak bonus when streak < 3', () => {
    expect(calculateXp(20, 1, 2)).toBe(20)
    expect(calculateXp(20, 1, 0)).toBe(20)
  })
  it('combines attempt scaling and streak bonus', () => {
    expect(calculateXp(20, 2, 3)).toBe(21)
  })
})
