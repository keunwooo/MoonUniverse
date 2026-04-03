import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './useGameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset()
    localStorage.clear()
  })

  it('starts with default progress', () => {
    const state = useGameStore.getState()
    expect(state.progress.level).toBe(1)
    expect(state.progress.xp).toBe(0)
    expect(state.progress.streak).toBe(0)
  })

  it('solveProblem marks problem as solved and awards XP', () => {
    useGameStore.getState().solveProblem('ALG-001', true, 20, 60)
    const state = useGameStore.getState()
    expect(state.progress.solved['ALG-001']).toEqual({
      correct: true, attempts: 1, time: 60,
    })
    expect(state.progress.xp).toBe(20)
    expect(state.progress.streak).toBe(1)
    expect(state.progress.stats.totalSolved).toBe(1)
  })

  it('tracks wrong answers without awarding XP', () => {
    useGameStore.getState().solveProblem('ALG-001', false, 20, 60)
    const state = useGameStore.getState()
    expect(state.progress.solved['ALG-001']).toEqual({
      correct: false, attempts: 1, time: 60,
    })
    expect(state.progress.xp).toBe(0)
    expect(state.progress.streak).toBe(0)
    expect(state.progress.stats.totalWrong).toBe(1)
  })

  it('increments attempts on retry', () => {
    useGameStore.getState().solveProblem('ALG-001', false, 20, 60)
    useGameStore.getState().solveProblem('ALG-001', true, 20, 45)
    const state = useGameStore.getState()
    expect(state.progress.solved['ALG-001'].correct).toBe(true)
    expect(state.progress.solved['ALG-001'].attempts).toBe(2)
    expect(state.progress.xp).toBe(14)
  })

  it('resets streak on wrong answer', () => {
    useGameStore.getState().solveProblem('ALG-001', true, 10, 30)
    useGameStore.getState().solveProblem('ALG-002', true, 10, 30)
    expect(useGameStore.getState().progress.streak).toBe(2)
    useGameStore.getState().solveProblem('ALG-003', false, 10, 30)
    expect(useGameStore.getState().progress.streak).toBe(0)
  })

  it('persists to localStorage', () => {
    useGameStore.getState().solveProblem('ALG-001', true, 20, 60)
    const raw = localStorage.getItem('moonuniverse-progress')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.state.progress.xp).toBe(20)
  })
})
