import { create } from 'zustand'
import type { Problem } from '../types'

interface ProblemStore {
  currentProblem: Problem | null
  hoveredProblem: Problem | null
  isSolving: boolean
  showSolution: boolean
  startTime: number | null
  setCurrentProblem: (problem: Problem | null) => void
  setHoveredProblem: (problem: Problem | null) => void
  startSolving: () => void
  finishSolving: () => void
  showSolutionSteps: () => void
  closeProblem: () => void
}

export const useProblemStore = create<ProblemStore>()((set) => ({
  currentProblem: null,
  hoveredProblem: null,
  isSolving: false,
  showSolution: false,
  startTime: null,

  setCurrentProblem: (problem) => set({
    currentProblem: problem,
    isSolving: false,
    showSolution: false,
    startTime: null,
  }),

  setHoveredProblem: (problem) => set({ hoveredProblem: problem }),

  startSolving: () => set({ isSolving: true, startTime: Date.now() }),

  finishSolving: () => set({ isSolving: false }),

  showSolutionSteps: () => set({ showSolution: true }),

  closeProblem: () => set({
    currentProblem: null,
    isSolving: false,
    showSolution: false,
    startTime: null,
  }),
}))
