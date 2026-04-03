import { describe, it, expect } from 'vitest'
import type { Problem, UserProgress } from './index'

describe('types', () => {
  it('Problem type accepts valid problem', () => {
    const p: Problem = {
      id: 'ALG-001',
      title: 'Quadratic Equations',
      difficulty: 3,
      tier: 'medium',
      inputType: 'multiple',
      question: 'Solve: x² − 5x + 6 = 0',
      questionLatex: 'x^2 - 5x + 6 = 0',
      choices: [
        { label: 'A', text: 'x = 1, x = 6' },
        { label: 'B', text: 'x = 2, x = 3', correct: true },
      ],
      answer: 'B',
      answerLatex: 'x = 2, \\; x = 3',
      solution: [
        { step: 1, title: 'Factor', text: 'Find factors', latex: '(x-2)(x-3)=0' }
      ],
      xp: 20,
      tags: ['quadratic'],
    }
    expect(p.id).toBe('ALG-001')
  })

  it('UserProgress type accepts valid progress', () => {
    const progress: UserProgress = {
      level: 7,
      xp: 1240,
      streak: 5,
      solved: {
        'ALG-001': { correct: true, attempts: 1, time: 138 },
      },
      unlocked: {
        algebra: 'hard',
        geometry: 'medium',
        functions: 'easy',
        calculus: 'tutorial',
        probability: 'tutorial',
      },
      sunUnlocked: false,
      stats: { totalSolved: 47, totalWrong: 8, bestStreak: 12, totalTime: 14520 },
    }
    expect(progress.level).toBe(7)
  })
})
