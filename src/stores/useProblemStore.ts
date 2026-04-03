import { create } from 'zustand'
import type { Problem } from '../types'

interface ProblemStore {
  currentProblem: Problem | null
  hoveredProblem: Problem | null
  setCurrentProblem: (problem: Problem | null) => void
  setHoveredProblem: (problem: Problem | null) => void
  closeProblem: () => void
}

export const useProblemStore = create<ProblemStore>()((set) => ({
  currentProblem: null,
  hoveredProblem: null,

  setCurrentProblem: (problem) => set({ currentProblem: problem }),

  setHoveredProblem: (problem) => set({ hoveredProblem: problem }),

  closeProblem: () => set({ currentProblem: null }),
}))
