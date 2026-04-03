import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, Tier, Problem } from '../types'
import { calculateXp } from '../utils/xp'
import { getUnlockedTier, isSunUnlocked } from '../utils/unlock'

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  streak: 0,
  solved: {},
  unlocked: {
    algebra: 'tutorial',
    geometry: 'tutorial',
    functions: 'tutorial',
    calculus: 'tutorial',
    probability: 'tutorial',
  },
  sunUnlocked: false,
  stats: { totalSolved: 0, totalWrong: 0, bestStreak: 0, totalTime: 0 },
}

const XP_PER_LEVEL = 200

interface GameStore {
  progress: UserProgress
  solveProblem: (id: string, correct: boolean, baseXp: number, time: number) => void
  updateUnlock: (subject: string, tier: Tier) => void
  checkAndUpdateUnlocks: (subjectId: string, problems?: Problem[]) => void
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, _get) => ({
      progress: { ...DEFAULT_PROGRESS },

      solveProblem: (id, correct, baseXp, time) => {
        set((state) => {
          const prev = state.progress.solved[id]
          const attempts = (prev?.attempts ?? 0) + 1
          const newStreak = correct ? state.progress.streak + 1 : 0

          let xpGained = 0
          if (correct) {
            xpGained = calculateXp(baseXp, attempts, newStreak)
          }

          const newXp = state.progress.xp + xpGained
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1

          return {
            progress: {
              ...state.progress,
              xp: newXp,
              level: newLevel,
              streak: newStreak,
              solved: {
                ...state.progress.solved,
                [id]: { correct, attempts, time },
              },
              stats: {
                totalSolved: state.progress.stats.totalSolved + (correct ? 1 : 0),
                totalWrong: state.progress.stats.totalWrong + (correct ? 0 : 1),
                bestStreak: Math.max(state.progress.stats.bestStreak, newStreak),
                totalTime: state.progress.stats.totalTime + time,
              },
            },
          }
        })
      },

      updateUnlock: (subject, tier) => {
        set((state) => ({
          progress: {
            ...state.progress,
            unlocked: { ...state.progress.unlocked, [subject]: tier },
          },
        }))
      },

      checkAndUpdateUnlocks: (subjectId, problems) => {
        if (!problems || problems.length === 0) return
        set((state) => {
          const newTier = getUnlockedTier(problems, state.progress.solved)
          const currentTier = state.progress.unlocked[subjectId]
          if (newTier !== currentTier) {
            const newUnlocked = { ...state.progress.unlocked, [subjectId]: newTier }
            return {
              progress: {
                ...state.progress,
                unlocked: newUnlocked,
                sunUnlocked: isSunUnlocked(newUnlocked),
              },
            }
          }
          return state
        })
      },

      reset: () => set({ progress: { ...DEFAULT_PROGRESS, solved: {}, unlocked: { ...DEFAULT_PROGRESS.unlocked }, stats: { ...DEFAULT_PROGRESS.stats } } }),
    }),
    { name: 'moonuniverse-progress' }
  )
)
