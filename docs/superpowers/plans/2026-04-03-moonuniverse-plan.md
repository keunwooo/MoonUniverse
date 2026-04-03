# MoonUniverse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3D space-themed math learning platform where stars are math problems in a realistic solar system.

**Architecture:** React Three Fiber for 3D rendering with React HTML overlay for UI. Zustand manages game state (progress, XP, unlocks) persisted to LocalStorage. Problem data loaded from static JSON files.

**Tech Stack:** Vite, TypeScript, React, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Zustand, Framer Motion, KaTeX, react-katex

---

## File Map

```
src/
  types/index.ts                    ← All TypeScript types
  data/solar-system.ts              ← Solar system config (planets, orbits, colors)
  data/problems/algebra.json        ← Algebra problems
  data/problems/geometry.json       ← Geometry problems
  data/problems/functions.json      ← Functions problems
  data/problems/calculus.json       ← Calculus problems
  data/problems/probability.json    ← Probability problems
  stores/useGameStore.ts            ← Progress, XP, unlocks, streak
  stores/useProblemStore.ts         ← Current problem, solving state
  utils/xp.ts                       ← XP calculation (attempt scaling, streak)
  utils/unlock.ts                    ← Tier unlock logic
  hooks/useStarPositions.ts         ← Generate star 3D positions from problem data
  components/3d/SolarSystem.tsx     ← Root 3D scene
  components/3d/Sun.tsx             ← Sun mesh with glow
  components/3d/Planet.tsx          ← Planet mesh with orbit ring
  components/3d/Moon.tsx            ← Moon satellite orbiting planet
  components/3d/Star.tsx            ← Individual star (problem) with glow
  components/3d/StarField.tsx       ← Background decorative stars
  components/3d/Skybox.tsx          ← HDRI environment
  components/3d/CameraController.tsx ← Orbit controls + fly-to animation
  components/ui/HUD.tsx             ← HUD container layout
  components/ui/SubjectNav.tsx      ← Top-left planet quick-jump pills
  components/ui/UserStats.tsx       ← Top-right level, XP, streak
  components/ui/PlanetInfo.tsx      ← Bottom-left current planet progress
  components/ui/MiniMap.tsx         ← Bottom-right solar system overview
  components/ui/ProblemPreview.tsx  ← Hover tooltip near star
  components/ui/ProblemSolver.tsx   ← Full-screen problem overlay
  components/ui/MultipleChoice.tsx  ← A/B/C/D input
  components/ui/ShortAnswer.tsx     ← Text/number input
  components/ui/FormulaInput.tsx    ← KaTeX formula input
  components/ui/StepSolution.tsx    ← Step-by-step solution reveal
  components/ui/ResultBanner.tsx    ← Correct/incorrect banner
  App.tsx                           ← Root: Canvas + HUD + overlays
  main.tsx                          ← Vite entry point
  index.css                         ← Global styles, dark theme
public/
  hdri/space.hdr                    ← Space environment map
```

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite project**

Run:
```bash
cd "C:/Users/kwoo/Desktop/근우/MoonUniverse"
npm create vite@latest . -- --template react-ts
```
Expected: Vite scaffolds React+TS into current directory.

- [ ] **Step 2: Install core dependencies**

Run:
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing zustand framer-motion katex react-katex
```

- [ ] **Step 3: Install dev dependencies**

Run:
```bash
npm install -D @types/three vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Configure Vitest**

Add to `vite.config.ts`:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
})
```

- [ ] **Step 5: Set up global styles**

Write `src/index.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a0a1a;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

- [ ] **Step 6: Create minimal App.tsx**

Write `src/App.tsx`:
```tsx
import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 7: Verify dev server**

Run: `npm run dev`
Expected: Browser shows a glowing yellow sphere on dark background at localhost:5173.

- [ ] **Step 8: Commit**

```bash
git init
echo "node_modules\ndist\n.superpowers" > .gitignore
git add -A
git commit -m "chore: scaffold Vite + React + R3F project"
```

---

### Task 2: TypeScript Types & Data Layer

**Files:**
- Create: `src/types/index.ts`, `src/data/solar-system.ts`

- [ ] **Step 1: Write type tests**

Create `src/types/index.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import type { Problem, Choice, SolutionStep, PlanetConfig, SolarSystemConfig, UserProgress, SolvedRecord, Tier, Subject, InputType } from './index'

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/types/index.test.ts`
Expected: FAIL — cannot find module './index'

- [ ] **Step 3: Write types**

Create `src/types/index.ts`:
```typescript
export type Subject = 'algebra' | 'geometry' | 'functions' | 'calculus' | 'probability'
export type Tier = 'tutorial' | 'easy' | 'medium' | 'hard' | 'expert'
export type InputType = 'multiple' | 'short' | 'formula'

export interface Choice {
  label: string
  text: string
  correct?: boolean
}

export interface SolutionStep {
  step: number
  title: string
  text: string
  latex?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: number
  tier: Tier
  inputType: InputType
  question: string
  questionLatex?: string
  choices?: Choice[]
  answer: string
  answerLatex?: string
  solution: SolutionStep[]
  xp: number
  tags: string[]
}

export interface SubjectProblems {
  subject: Subject
  problems: Problem[]
}

export interface PlanetConfig {
  id: Subject
  name: string
  color: string
  orbitRadius: number
  size: number
  texture: string
  moon: { name: string; tutorialProblems: number }
}

export interface SolarSystemConfig {
  sun: { name: string; unlockCondition: string }
  planets: PlanetConfig[]
}

export interface SolvedRecord {
  correct: boolean
  attempts: number
  time: number
}

export interface UserProgress {
  level: number
  xp: number
  streak: number
  solved: Record<string, SolvedRecord>
  unlocked: Record<string, Tier>
  sunUnlocked: boolean
  stats: {
    totalSolved: number
    totalWrong: number
    bestStreak: number
    totalTime: number
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/types/index.test.ts`
Expected: PASS

- [ ] **Step 5: Write solar system config**

Create `src/data/solar-system.ts`:
```typescript
import type { SolarSystemConfig } from '../types'

export const solarSystem: SolarSystemConfig = {
  sun: {
    name: 'Final Challenge',
    unlockCondition: '3 planets at hard tier',
  },
  planets: [
    {
      id: 'algebra',
      name: 'Algebra',
      color: '#7c3aed',
      orbitRadius: 8,
      size: 1.2,
      texture: 'textures/algebra.jpg',
      moon: { name: 'Algebra Basics', tutorialProblems: 5 },
    },
    {
      id: 'geometry',
      name: 'Geometry',
      color: '#16a34a',
      orbitRadius: 13,
      size: 1.4,
      texture: 'textures/geometry.jpg',
      moon: { name: 'Geometry Basics', tutorialProblems: 5 },
    },
    {
      id: 'functions',
      name: 'Functions',
      color: '#2563eb',
      orbitRadius: 18,
      size: 1.1,
      texture: 'textures/functions.jpg',
      moon: { name: 'Function Basics', tutorialProblems: 5 },
    },
    {
      id: 'calculus',
      name: 'Calculus',
      color: '#e11d48',
      orbitRadius: 23,
      size: 1.5,
      texture: 'textures/calculus.jpg',
      moon: { name: 'Calculus Basics', tutorialProblems: 5 },
    },
    {
      id: 'probability',
      name: 'Probability',
      color: '#0891b2',
      orbitRadius: 28,
      size: 1.3,
      texture: 'textures/probability.jpg',
      moon: { name: 'Probability Basics', tutorialProblems: 5 },
    },
  ],
}
```

- [ ] **Step 6: Commit**

```bash
git add src/types src/data/solar-system.ts
git commit -m "feat: add TypeScript types and solar system config"
```

---

### Task 3: XP & Unlock Utility Functions

**Files:**
- Create: `src/utils/xp.ts`, `src/utils/xp.test.ts`, `src/utils/unlock.ts`, `src/utils/unlock.test.ts`

- [ ] **Step 1: Write XP calculation tests**

Create `src/utils/xp.test.ts`:
```typescript
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
    // 20 * 0.7 (2nd attempt) * 1.5 (streak 3) = 21
    expect(calculateXp(20, 2, 3)).toBe(21)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/xp.test.ts`
Expected: FAIL — cannot find module './xp'

- [ ] **Step 3: Implement XP calculation**

Create `src/utils/xp.ts`:
```typescript
export function calculateXp(baseXp: number, attempts: number, streak: number): number {
  let scale: number
  if (attempts <= 1) {
    scale = 1.0
  } else if (attempts <= 3) {
    scale = 0.7
  } else {
    scale = 0.5
  }

  const streakMultiplier = streak >= 3 ? 1.5 : 1.0

  return Math.round(baseXp * scale * streakMultiplier)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/xp.test.ts`
Expected: PASS

- [ ] **Step 5: Write unlock logic tests**

Create `src/utils/unlock.test.ts`:
```typescript
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
      // E3 not solved — 66%, but we need 70%
    }
    expect(getUnlockedTier(problems, solved)).toBe('easy')

    // Add E3 → 100% of easy
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
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/utils/unlock.test.ts`
Expected: FAIL — cannot find module './unlock'

- [ ] **Step 7: Implement unlock logic**

Create `src/utils/unlock.ts`:
```typescript
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
      // Tutorial requires 100% completion
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
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/utils/unlock.test.ts`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/utils
git commit -m "feat: add XP calculation and tier unlock logic"
```

---

### Task 4: Zustand Stores

**Files:**
- Create: `src/stores/useGameStore.ts`, `src/stores/useGameStore.test.ts`, `src/stores/useProblemStore.ts`

- [ ] **Step 1: Write game store tests**

Create `src/stores/useGameStore.test.ts`:
```typescript
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
    // 2nd attempt = 70% of 20 = 14
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stores/useGameStore.test.ts`
Expected: FAIL — cannot find module './useGameStore'

- [ ] **Step 3: Implement game store**

Create `src/stores/useGameStore.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, Tier } from '../types'
import { calculateXp } from '../utils/xp'

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
  reset: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
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

      reset: () => set({ progress: { ...DEFAULT_PROGRESS, solved: {}, unlocked: { ...DEFAULT_PROGRESS.unlocked }, stats: { ...DEFAULT_PROGRESS.stats } } }),
    }),
    { name: 'moonuniverse-progress' }
  )
)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/stores/useGameStore.test.ts`
Expected: PASS

- [ ] **Step 5: Create problem store**

Create `src/stores/useProblemStore.ts`:
```typescript
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
```

- [ ] **Step 6: Commit**

```bash
git add src/stores
git commit -m "feat: add Zustand game and problem stores with persistence"
```

---

### Task 5: Sample Problem Data

**Files:**
- Create: `src/data/problems/algebra.json`, `src/data/problems/geometry.json`, `src/data/problems/functions.json`, `src/data/problems/calculus.json`, `src/data/problems/probability.json`

- [ ] **Step 1: Create algebra problems**

Create `src/data/problems/algebra.json`:
```json
{
  "subject": "algebra",
  "problems": [
    {
      "id": "ALG-T01",
      "title": "Simple Equation",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "Solve: 2x = 10",
      "questionLatex": "2x = 10",
      "choices": [
        { "label": "A", "text": "x = 3" },
        { "label": "B", "text": "x = 5", "correct": true },
        { "label": "C", "text": "x = 8" },
        { "label": "D", "text": "x = 20" }
      ],
      "answer": "B",
      "solution": [
        { "step": 1, "title": "Divide both sides by 2", "text": "2x ÷ 2 = 10 ÷ 2", "latex": "\\frac{2x}{2} = \\frac{10}{2}" },
        { "step": 2, "title": "Simplify", "text": "x = 5", "latex": "x = 5" }
      ],
      "xp": 10,
      "tags": ["linear", "basic"]
    },
    {
      "id": "ALG-T02",
      "title": "Variable Both Sides",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "Solve: 3x + 2 = 14",
      "questionLatex": "3x + 2 = 14",
      "choices": [
        { "label": "A", "text": "x = 4", "correct": true },
        { "label": "B", "text": "x = 6" },
        { "label": "C", "text": "x = 3" },
        { "label": "D", "text": "x = 5" }
      ],
      "answer": "A",
      "solution": [
        { "step": 1, "title": "Subtract 2", "text": "3x = 14 - 2 = 12", "latex": "3x = 12" },
        { "step": 2, "title": "Divide by 3", "text": "x = 12 ÷ 3 = 4", "latex": "x = 4" }
      ],
      "xp": 10,
      "tags": ["linear", "basic"]
    },
    {
      "id": "ALG-E01",
      "title": "Linear Equation",
      "difficulty": 2,
      "tier": "easy",
      "inputType": "multiple",
      "question": "Solve: 5x - 3 = 2x + 9",
      "questionLatex": "5x - 3 = 2x + 9",
      "choices": [
        { "label": "A", "text": "x = 2" },
        { "label": "B", "text": "x = 4", "correct": true },
        { "label": "C", "text": "x = 3" },
        { "label": "D", "text": "x = 6" }
      ],
      "answer": "B",
      "solution": [
        { "step": 1, "title": "Move x terms", "text": "5x - 2x = 9 + 3", "latex": "3x = 12" },
        { "step": 2, "title": "Divide", "text": "x = 4", "latex": "x = 4" }
      ],
      "xp": 15,
      "tags": ["linear"]
    },
    {
      "id": "ALG-M01",
      "title": "Quadratic Equation",
      "difficulty": 3,
      "tier": "medium",
      "inputType": "multiple",
      "question": "Solve: x² - 5x + 6 = 0",
      "questionLatex": "x^2 - 5x + 6 = 0",
      "choices": [
        { "label": "A", "text": "x = 1, x = 6" },
        { "label": "B", "text": "x = 2, x = 3", "correct": true },
        { "label": "C", "text": "x = -2, x = -3" },
        { "label": "D", "text": "x = 5, x = 1" }
      ],
      "answer": "B",
      "solution": [
        { "step": 1, "title": "Identify form", "text": "ax² + bx + c where a=1, b=-5, c=6", "latex": "a=1,\\; b=-5,\\; c=6" },
        { "step": 2, "title": "Factor", "text": "Find numbers that multiply to 6 and add to -5", "latex": "(x-2)(x-3) = 0" },
        { "step": 3, "title": "Solve", "text": "Set each factor to zero", "latex": "x = 2 \\;\\text{or}\\; x = 3" }
      ],
      "xp": 20,
      "tags": ["quadratic", "factoring"]
    },
    {
      "id": "ALG-H01",
      "title": "Quadratic Formula",
      "difficulty": 5,
      "tier": "hard",
      "inputType": "short",
      "question": "Using the quadratic formula, solve: 2x² + 3x - 2 = 0. Enter the positive root.",
      "questionLatex": "2x^2 + 3x - 2 = 0",
      "answer": "0.5",
      "answerLatex": "x = \\frac{1}{2}",
      "solution": [
        { "step": 1, "title": "Identify coefficients", "text": "a=2, b=3, c=-2", "latex": "a=2,\\; b=3,\\; c=-2" },
        { "step": 2, "title": "Apply formula", "text": "x = (-b ± √(b²-4ac)) / 2a", "latex": "x = \\frac{-3 \\pm \\sqrt{9+16}}{4} = \\frac{-3 \\pm 5}{4}" },
        { "step": 3, "title": "Two solutions", "text": "x = 1/2 or x = -2", "latex": "x = \\frac{1}{2} \\;\\text{or}\\; x = -2" }
      ],
      "xp": 35,
      "tags": ["quadratic", "formula"]
    }
  ]
}
```

- [ ] **Step 2: Create geometry problems**

Create `src/data/problems/geometry.json`:
```json
{
  "subject": "geometry",
  "problems": [
    {
      "id": "GEO-T01",
      "title": "Triangle Angles",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "A triangle has angles 60° and 80°. What is the third angle?",
      "choices": [
        { "label": "A", "text": "40°", "correct": true },
        { "label": "B", "text": "50°" },
        { "label": "C", "text": "60°" },
        { "label": "D", "text": "30°" }
      ],
      "answer": "A",
      "solution": [
        { "step": 1, "title": "Sum of angles", "text": "Triangle angles sum to 180°", "latex": "\\angle_1 + \\angle_2 + \\angle_3 = 180°" },
        { "step": 2, "title": "Calculate", "text": "180 - 60 - 80 = 40", "latex": "180° - 60° - 80° = 40°" }
      ],
      "xp": 10,
      "tags": ["triangle", "angles"]
    },
    {
      "id": "GEO-T02",
      "title": "Rectangle Area",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "What is the area of a rectangle with width 5 and height 8?",
      "choices": [
        { "label": "A", "text": "13" },
        { "label": "B", "text": "26" },
        { "label": "C", "text": "40", "correct": true },
        { "label": "D", "text": "45" }
      ],
      "answer": "C",
      "solution": [
        { "step": 1, "title": "Area formula", "text": "Area = width × height", "latex": "A = w \\times h" },
        { "step": 2, "title": "Calculate", "text": "5 × 8 = 40", "latex": "A = 5 \\times 8 = 40" }
      ],
      "xp": 10,
      "tags": ["rectangle", "area"]
    },
    {
      "id": "GEO-E01",
      "title": "Pythagorean Theorem",
      "difficulty": 2,
      "tier": "easy",
      "inputType": "short",
      "question": "A right triangle has legs 3 and 4. What is the hypotenuse?",
      "questionLatex": "a^2 + b^2 = c^2",
      "answer": "5",
      "solution": [
        { "step": 1, "title": "Apply theorem", "text": "c² = 3² + 4²", "latex": "c^2 = 9 + 16 = 25" },
        { "step": 2, "title": "Solve", "text": "c = √25 = 5", "latex": "c = \\sqrt{25} = 5" }
      ],
      "xp": 15,
      "tags": ["pythagorean", "right-triangle"]
    },
    {
      "id": "GEO-M01",
      "title": "Circle Area",
      "difficulty": 3,
      "tier": "medium",
      "inputType": "short",
      "question": "What is the area of a circle with radius 7? (Round to nearest integer)",
      "questionLatex": "A = \\pi r^2",
      "answer": "154",
      "solution": [
        { "step": 1, "title": "Apply formula", "text": "A = π × 7²", "latex": "A = \\pi \\times 49" },
        { "step": 2, "title": "Calculate", "text": "A ≈ 153.94 ≈ 154", "latex": "A \\approx 154" }
      ],
      "xp": 20,
      "tags": ["circle", "area"]
    }
  ]
}
```

- [ ] **Step 3: Create functions, calculus, and probability problems**

Create `src/data/problems/functions.json`:
```json
{
  "subject": "functions",
  "problems": [
    {
      "id": "FUN-T01",
      "title": "Function Evaluation",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "If f(x) = 2x + 1, what is f(3)?",
      "questionLatex": "f(x) = 2x + 1",
      "choices": [
        { "label": "A", "text": "5" },
        { "label": "B", "text": "7", "correct": true },
        { "label": "C", "text": "6" },
        { "label": "D", "text": "9" }
      ],
      "answer": "B",
      "solution": [
        { "step": 1, "title": "Substitute x=3", "text": "f(3) = 2(3) + 1", "latex": "f(3) = 2(3) + 1" },
        { "step": 2, "title": "Calculate", "text": "f(3) = 7", "latex": "f(3) = 6 + 1 = 7" }
      ],
      "xp": 10,
      "tags": ["evaluation", "linear"]
    },
    {
      "id": "FUN-T02",
      "title": "Domain Basics",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "What value of x makes f(x) = 1/x undefined?",
      "questionLatex": "f(x) = \\frac{1}{x}",
      "choices": [
        { "label": "A", "text": "x = 0", "correct": true },
        { "label": "B", "text": "x = 1" },
        { "label": "C", "text": "x = -1" },
        { "label": "D", "text": "No value" }
      ],
      "answer": "A",
      "solution": [
        { "step": 1, "title": "Division by zero", "text": "A fraction is undefined when denominator = 0", "latex": "x \\neq 0" },
        { "step": 2, "title": "Answer", "text": "x = 0 makes f(x) undefined", "latex": "f(0) = \\frac{1}{0} \\;\\text{(undefined)}" }
      ],
      "xp": 10,
      "tags": ["domain"]
    }
  ]
}
```

Create `src/data/problems/calculus.json`:
```json
{
  "subject": "calculus",
  "problems": [
    {
      "id": "CAL-T01",
      "title": "Limit Concept",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
      "questionLatex": "\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}",
      "choices": [
        { "label": "A", "text": "0" },
        { "label": "B", "text": "1" },
        { "label": "C", "text": "2", "correct": true },
        { "label": "D", "text": "Undefined" }
      ],
      "answer": "C",
      "solution": [
        { "step": 1, "title": "Factor numerator", "text": "x² - 1 = (x+1)(x-1)", "latex": "\\frac{(x+1)(x-1)}{x-1}" },
        { "step": 2, "title": "Cancel", "text": "Simplify to x + 1", "latex": "= x + 1" },
        { "step": 3, "title": "Evaluate", "text": "Substitute x = 1", "latex": "1 + 1 = 2" }
      ],
      "xp": 10,
      "tags": ["limits"]
    },
    {
      "id": "CAL-T02",
      "title": "Slope of Tangent",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "The derivative of f(x) = 3x is?",
      "questionLatex": "f(x) = 3x",
      "choices": [
        { "label": "A", "text": "3", "correct": true },
        { "label": "B", "text": "3x" },
        { "label": "C", "text": "x" },
        { "label": "D", "text": "0" }
      ],
      "answer": "A",
      "solution": [
        { "step": 1, "title": "Power rule", "text": "d/dx(ax) = a", "latex": "\\frac{d}{dx}(3x) = 3" }
      ],
      "xp": 10,
      "tags": ["derivative", "basic"]
    }
  ]
}
```

Create `src/data/problems/probability.json`:
```json
{
  "subject": "probability",
  "problems": [
    {
      "id": "PRO-T01",
      "title": "Coin Flip",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "What is the probability of getting heads on a fair coin?",
      "choices": [
        { "label": "A", "text": "1/4" },
        { "label": "B", "text": "1/2", "correct": true },
        { "label": "C", "text": "1/3" },
        { "label": "D", "text": "1" }
      ],
      "answer": "B",
      "solution": [
        { "step": 1, "title": "Count outcomes", "text": "2 possible: heads or tails", "latex": "P = \\frac{1}{2}" }
      ],
      "xp": 10,
      "tags": ["basic", "coin"]
    },
    {
      "id": "PRO-T02",
      "title": "Dice Roll",
      "difficulty": 1,
      "tier": "tutorial",
      "inputType": "multiple",
      "question": "What is the probability of rolling a 6 on a fair die?",
      "choices": [
        { "label": "A", "text": "1/2" },
        { "label": "B", "text": "1/3" },
        { "label": "C", "text": "1/6", "correct": true },
        { "label": "D", "text": "1/12" }
      ],
      "answer": "C",
      "solution": [
        { "step": 1, "title": "Count outcomes", "text": "6 equally likely faces", "latex": "P(6) = \\frac{1}{6}" }
      ],
      "xp": 10,
      "tags": ["basic", "dice"]
    }
  ]
}
```

- [ ] **Step 4: Verify JSON is valid**

Run: `node -e "['algebra','geometry','functions','calculus','probability'].forEach(s => { const d = require('./src/data/problems/'+s+'.json'); console.log(s+':', d.problems.length, 'problems') })"`
Expected: Lists count of problems per subject.

- [ ] **Step 5: Commit**

```bash
git add src/data/problems
git commit -m "feat: add sample math problems for all 5 subjects"
```

---

### Task 6: 3D Scene — Sun, Planets, Orbits

**Files:**
- Create: `src/components/3d/Sun.tsx`, `src/components/3d/Planet.tsx`, `src/components/3d/Moon.tsx`, `src/components/3d/SolarSystem.tsx`, `src/components/3d/Skybox.tsx`

- [ ] **Step 1: Create Sun component**

Create `src/components/3d/Sun.tsx`:
```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export default function Sun() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={3}
      />
      <pointLight color="#fbbf24" intensity={100} distance={200} />
    </mesh>
  )
}
```

- [ ] **Step 2: Create Planet component**

Create `src/components/3d/Planet.tsx`:
```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import type { PlanetConfig } from '../../types'
import Moon from './Moon'

interface Props {
  config: PlanetConfig
  onClick: (planetId: string) => void
}

export default function Planet({ config, onClick }: Props) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    angleRef.current += delta * (0.1 / config.orbitRadius)
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * config.orbitRadius
      groupRef.current.position.z = Math.sin(angleRef.current) * config.orbitRadius
    }
  })

  return (
    <>
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.orbitRadius - 0.02, config.orbitRadius + 0.02, 128]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.15} />
      </mesh>

      {/* Planet group */}
      <group ref={groupRef}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onClick(config.id)}
        >
          <sphereGeometry args={[config.size, 32, 32]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
          />
        </mesh>
        {/* Moon orbiting this planet */}
        <Moon parentPosition={[0, 0, 0]} color={config.color} />
        {hovered && (
          <Html center distanceFactor={15}>
            <div style={{
              background: 'rgba(15,23,42,0.9)',
              border: `1px solid ${config.color}`,
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
              {config.name}
            </div>
          </Html>
        )}
      </group>
    </>
  )
}
```

- [ ] **Step 3: Create Moon component**

Create `src/components/3d/Moon.tsx`:
```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface Props {
  parentPosition: [number, number, number]
  color: string
}

export default function Moon({ parentPosition, color }: Props) {
  const ref = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    angleRef.current += delta * 1.5
    if (ref.current) {
      ref.current.position.x = parentPosition[0] + Math.cos(angleRef.current) * 2.5
      ref.current.position.y = parentPosition[1]
      ref.current.position.z = parentPosition[2] + Math.sin(angleRef.current) * 2.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#9ca3af" emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}
```

- [ ] **Step 4: Create Skybox component**

Create `src/components/3d/Skybox.tsx`:
```tsx
import { Stars } from '@react-three/drei'

export default function Skybox() {
  return (
    <>
      <color attach="background" args={['#0a0a1a']} />
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  )
}
```

- [ ] **Step 5: Create SolarSystem scene**

Create `src/components/3d/SolarSystem.tsx`:
```tsx
import Sun from './Sun'
import Planet from './Planet'
import Skybox from './Skybox'
import { solarSystem } from '../../data/solar-system'

interface Props {
  onPlanetClick: (planetId: string) => void
}

export default function SolarSystem({ onPlanetClick }: Props) {
  return (
    <>
      <Skybox />
      <ambientLight intensity={0.05} />
      <Sun />
      {solarSystem.planets.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          onClick={onPlanetClick}
        />
      ))}
    </>
  )
}
```

- [ ] **Step 6: Update App.tsx to render SolarSystem**

Replace `src/App.tsx`:
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SolarSystem from './components/3d/SolarSystem'

export default function App() {
  const handlePlanetClick = (planetId: string) => {
    console.log('Planet clicked:', planetId)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem onPlanetClick={handlePlanetClick} />
        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 7: Verify visual**

Run: `npm run dev`
Expected: Browser shows a solar system with a glowing sun, 5 colored planets orbiting, orbit rings, and a starfield background. Hovering a planet shows its name. Mouse drag orbits camera, scroll zooms.

- [ ] **Step 8: Commit**

```bash
git add src/components/3d src/App.tsx
git commit -m "feat: add 3D solar system with sun, planets, orbits, and skybox"
```

---

### Task 7: Star (Problem) 3D Component with Bloom

**Files:**
- Create: `src/components/3d/Star.tsx`, `src/hooks/useStarPositions.ts`
- Modify: `src/components/3d/SolarSystem.tsx`, `src/App.tsx`

- [ ] **Step 1: Create star position hook**

Create `src/hooks/useStarPositions.ts`:
```typescript
import { useMemo } from 'react'
import type { Problem, PlanetConfig } from '../types'

interface StarPosition {
  problem: Problem
  position: [number, number, number]
}

function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return () => {
    hash = (hash * 16807) % 2147483647
    return (hash & 0x7fffffff) / 0x7fffffff
  }
}

export function useStarPositions(
  problems: Problem[],
  planet: PlanetConfig,
): StarPosition[] {
  return useMemo(() => {
    return problems.map((problem) => {
      const rand = seededRandom(problem.id)

      // Difficulty maps to distance from sun
      // Higher difficulty = closer to sun (smaller radius)
      const tierOffset = {
        tutorial: 0.9,
        easy: 0.75,
        medium: 0.55,
        hard: 0.35,
        expert: 0.15,
      }
      const baseRadius = planet.orbitRadius * (tierOffset[problem.tier] ?? 0.5)
      const radiusJitter = (rand() - 0.5) * 2
      const radius = baseRadius + radiusJitter

      const angle = rand() * Math.PI * 2
      const yOffset = (rand() - 0.5) * 4

      return {
        problem,
        position: [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      }
    })
  }, [problems, planet])
}
```

- [ ] **Step 2: Create Star component**

Create `src/components/3d/Star.tsx`:
```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Problem } from '../../types'
import { useGameStore } from '../../stores/useGameStore'

interface Props {
  problem: Problem
  position: [number, number, number]
  onHover: (problem: Problem | null) => void
  onClick: (problem: Problem) => void
}

export default function Star({ problem, position, onHover, onClick }: Props) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const solved = useGameStore((s) => s.progress.solved[problem.id])

  // Size based on difficulty (1-7)
  const baseSize = 0.1 + problem.difficulty * 0.06

  // Color based on state
  const color = solved?.correct ? '#fbbf24' : '#ffffff'
  const emissiveIntensity = solved?.correct
    ? 1.5
    : problem.difficulty * 0.5 + (hovered ? 1.0 : 0)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(problem)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(problem)
      }}
    >
      <sphereGeometry args={[baseSize, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}
```

- [ ] **Step 3: Add stars to SolarSystem**

Replace `src/components/3d/SolarSystem.tsx`:
```tsx
import Sun from './Sun'
import Planet from './Planet'
import Star from './Star'
import Skybox from './Skybox'
import { solarSystem } from '../../data/solar-system'
import { useStarPositions } from '../../hooks/useStarPositions'
import type { Problem, PlanetConfig } from '../../types'

import algebraData from '../../data/problems/algebra.json'
import geometryData from '../../data/problems/geometry.json'
import functionsData from '../../data/problems/functions.json'
import calculusData from '../../data/problems/calculus.json'
import probabilityData from '../../data/problems/probability.json'

const problemMap: Record<string, Problem[]> = {
  algebra: algebraData.problems as Problem[],
  geometry: geometryData.problems as Problem[],
  functions: functionsData.problems as Problem[],
  calculus: calculusData.problems as Problem[],
  probability: probabilityData.problems as Problem[],
}

interface Props {
  onPlanetClick: (planetId: string) => void
  onStarHover: (problem: Problem | null) => void
  onStarClick: (problem: Problem) => void
}

function PlanetStars({ planet, onStarHover, onStarClick }: {
  planet: PlanetConfig
  onStarHover: (problem: Problem | null) => void
  onStarClick: (problem: Problem) => void
}) {
  const problems = problemMap[planet.id] ?? []
  const stars = useStarPositions(problems, planet)

  return (
    <>
      {stars.map((star) => (
        <Star
          key={star.problem.id}
          problem={star.problem}
          position={star.position}
          onHover={onStarHover}
          onClick={onStarClick}
        />
      ))}
    </>
  )
}

export default function SolarSystem({ onPlanetClick, onStarHover, onStarClick }: Props) {
  return (
    <>
      <Skybox />
      <ambientLight intensity={0.05} />
      <Sun />
      {solarSystem.planets.map((planet) => (
        <group key={planet.id}>
          <Planet config={planet} onClick={onPlanetClick} />
          <PlanetStars
            planet={planet}
            onStarHover={onStarHover}
            onStarClick={onStarClick}
          />
        </group>
      ))}
    </>
  )
}
```

- [ ] **Step 4: Add bloom postprocessing to App**

Replace `src/App.tsx`:
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import { useProblemStore } from './stores/useProblemStore'

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)

  const handlePlanetClick = (planetId: string) => {
    console.log('Planet clicked:', planetId)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetClick}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
        />
        <OrbitControls enablePan={false} minDistance={10} maxDistance={100} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 5: Verify visual**

Run: `npm run dev`
Expected: Stars appear around each planet orbit. Harder stars are bigger and brighter with bloom glow. Hovering changes cursor. Clicking logs problem to console.

- [ ] **Step 6: Commit**

```bash
git add src/components/3d src/hooks src/App.tsx
git commit -m "feat: add star problem markers with bloom glow effects"
```

---

### Task 8: Camera Fly-To Animation

**Files:**
- Create: `src/components/3d/CameraController.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CameraController**

Create `src/components/3d/CameraController.tsx`:
```tsx
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  target: [number, number, number] | null
  onArrived?: () => void
}

export default function CameraController({ target, onArrived }: Props) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 30, 50))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const isAnimating = useRef(false)

  useEffect(() => {
    if (target) {
      const [x, y, z] = target
      targetLookAt.current.set(x, y, z)
      targetPos.current.set(x + 5, y + 8, z + 10)
      isAnimating.current = true
    } else {
      targetPos.current.set(0, 30, 50)
      targetLookAt.current.set(0, 0, 0)
      isAnimating.current = true
    }
  }, [target])

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return

    camera.position.lerp(targetPos.current, 0.03)
    controlsRef.current.target.lerp(targetLookAt.current, 0.03)
    controlsRef.current.update()

    if (camera.position.distanceTo(targetPos.current) < 0.1) {
      isAnimating.current = false
      onArrived?.()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={5}
      maxDistance={100}
    />
  )
}
```

- [ ] **Step 2: Wire CameraController into App**

Replace `src/App.tsx`:
```tsx
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import CameraController from './components/3d/CameraController'
import { useProblemStore } from './stores/useProblemStore'
import { solarSystem } from './data/solar-system'

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null)

  const handlePlanetClick = useCallback((planetId: string) => {
    const planet = solarSystem.planets.find(p => p.id === planetId)
    if (planet) {
      // Fly to planet orbit area (approximate position)
      setCameraTarget([planet.orbitRadius * 0.7, 2, planet.orbitRadius * 0.7])
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetClick}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
        />
        <CameraController target={cameraTarget} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: Clicking a planet smoothly animates camera toward it. Orbit controls still work. ESC handling will come with HUD.

- [ ] **Step 4: Commit**

```bash
git add src/components/3d/CameraController.tsx src/App.tsx
git commit -m "feat: add smooth fly-to camera animation on planet click"
```

---

### Task 9: HUD — SubjectNav, UserStats, PlanetInfo, MiniMap

**Files:**
- Create: `src/components/ui/HUD.tsx`, `src/components/ui/SubjectNav.tsx`, `src/components/ui/UserStats.tsx`, `src/components/ui/PlanetInfo.tsx`, `src/components/ui/MiniMap.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SubjectNav**

Create `src/components/ui/SubjectNav.tsx`:
```tsx
import { solarSystem } from '../../data/solar-system'

interface Props {
  activePlanet: string | null
  onPlanetSelect: (planetId: string) => void
}

export default function SubjectNav({ activePlanet, onPlanetSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {solarSystem.planets.map((planet) => (
        <button
          key={planet.id}
          onClick={() => onPlanetSelect(planet.id)}
          style={{
            background: activePlanet === planet.id
              ? `${planet.color}33`
              : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activePlanet === planet.id ? planet.color : 'rgba(255,255,255,0.1)'}`,
            color: activePlanet === planet.id ? planet.color : '#64748b',
            padding: '0.4rem 0.8rem',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {activePlanet === planet.id && '● '}{planet.name}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create UserStats**

Create `src/components/ui/UserStats.tsx`:
```tsx
import { useGameStore } from '../../stores/useGameStore'

const XP_PER_LEVEL = 200

export default function UserStats() {
  const progress = useGameStore((s) => s.progress)
  const xpInLevel = progress.xp % XP_PER_LEVEL
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '0.8rem 1.2rem',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>Lv. {progress.level}</div>
        <div style={{
          flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '99px', width: '100px',
        }}>
          <div style={{
            width: `${xpPercent}%`, height: '100%',
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            borderRadius: '99px', transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{progress.xp} XP</div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>✓ {progress.stats.totalSolved}</span>
        <span style={{ color: '#f87171', fontSize: '0.7rem' }}>✗ {progress.stats.totalWrong}</span>
        <span style={{ color: '#60a5fa', fontSize: '0.7rem' }}>🔥 {progress.streak}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create PlanetInfo**

Create `src/components/ui/PlanetInfo.tsx`:
```tsx
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
```

- [ ] **Step 4: Create MiniMap**

Create `src/components/ui/MiniMap.tsx`:
```tsx
import { solarSystem } from '../../data/solar-system'

export default function MiniMap() {
  const maxOrbit = Math.max(...solarSystem.planets.map(p => p.orbitRadius))
  const scale = 55 / maxOrbit

  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '0.8rem',
      backdropFilter: 'blur(10px)',
      width: '140px',
      height: '140px',
      position: 'relative',
    }}>
      <div style={{ color: '#64748b', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Solar Map
      </div>
      <svg width="120" height="110" viewBox="-60 -55 120 110" style={{ position: 'absolute', top: '25px', left: '10px' }}>
        {/* Orbits */}
        {solarSystem.planets.map((planet) => (
          <circle
            key={`orbit-${planet.id}`}
            cx={0} cy={0}
            r={planet.orbitRadius * scale}
            fill="none"
            stroke={planet.color}
            strokeOpacity={0.2}
            strokeWidth={0.5}
          />
        ))}
        {/* Sun */}
        <circle cx={0} cy={0} r={3} fill="#fbbf24" />
        {/* Planets */}
        {solarSystem.planets.map((planet) => (
          <circle
            key={planet.id}
            cx={planet.orbitRadius * scale * 0.7}
            cy={planet.orbitRadius * scale * -0.3}
            r={2.5}
            fill={planet.color}
          />
        ))}
      </svg>
    </div>
  )
}
```

- [ ] **Step 5: Create HUD container**

Create `src/components/ui/HUD.tsx`:
```tsx
import SubjectNav from './SubjectNav'
import UserStats from './UserStats'
import PlanetInfo from './PlanetInfo'
import MiniMap from './MiniMap'

interface Props {
  activePlanet: string | null
  onPlanetSelect: (planetId: string) => void
}

export default function HUD({ activePlanet, onPlanetSelect }: Props) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      padding: '1rem',
      zIndex: 10,
    }}>
      {/* Top-left: Subject Nav */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', pointerEvents: 'auto' }}>
        <SubjectNav activePlanet={activePlanet} onPlanetSelect={onPlanetSelect} />
      </div>

      {/* Top-right: User Stats */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', pointerEvents: 'auto' }}>
        <UserStats />
      </div>

      {/* Bottom-left: Planet Info */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', pointerEvents: 'auto' }}>
        <PlanetInfo planetId={activePlanet} />
      </div>

      {/* Bottom-right: Mini Map */}
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', pointerEvents: 'auto' }}>
        <MiniMap />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Wire HUD into App**

Replace `src/App.tsx`:
```tsx
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './components/3d/SolarSystem'
import CameraController from './components/3d/CameraController'
import HUD from './components/ui/HUD'
import { useProblemStore } from './stores/useProblemStore'
import { solarSystem } from './data/solar-system'

export default function App() {
  const setHoveredProblem = useProblemStore((s) => s.setHoveredProblem)
  const setCurrentProblem = useProblemStore((s) => s.setCurrentProblem)
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null)
  const [activePlanet, setActivePlanet] = useState<string | null>(null)

  const handlePlanetSelect = useCallback((planetId: string) => {
    setActivePlanet(planetId)
    const planet = solarSystem.planets.find(p => p.id === planetId)
    if (planet) {
      setCameraTarget([planet.orbitRadius * 0.7, 2, planet.orbitRadius * 0.7])
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <SolarSystem
          onPlanetClick={handlePlanetSelect}
          onStarHover={setHoveredProblem}
          onStarClick={setCurrentProblem}
        />
        <CameraController target={cameraTarget} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
      <HUD activePlanet={activePlanet} onPlanetSelect={handlePlanetSelect} />
    </div>
  )
}
```

- [ ] **Step 7: Verify**

Run: `npm run dev`
Expected: HUD elements overlay on 3D scene — subject pills at top-left, user stats at top-right, planet info at bottom-left (shows when planet selected), minimap at bottom-right. Clicking subject pills flies camera to that planet.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui src/App.tsx
git commit -m "feat: add HUD overlay with subject nav, stats, planet info, minimap"
```

---

### Task 10: Problem Preview Tooltip

**Files:**
- Create: `src/components/ui/ProblemPreview.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ProblemPreview**

Create `src/components/ui/ProblemPreview.tsx`:
```tsx
import { useProblemStore } from '../../stores/useProblemStore'
import { solarSystem } from '../../data/solar-system'

export default function ProblemPreview() {
  const problem = useProblemStore((s) => s.hoveredProblem)
  if (!problem) return null

  const subject = problem.id.slice(0, 3)
  const planet = solarSystem.planets.find(p =>
    p.id.toUpperCase().startsWith(subject)
  ) ?? solarSystem.planets[0]

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '2rem',
      transform: 'translateY(-50%)',
      background: 'rgba(15,23,42,0.95)',
      border: `1px solid ${planet.color}44`,
      borderRadius: '12px',
      padding: '1rem',
      width: '280px',
      backdropFilter: 'blur(10px)',
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{
          color: planet.color,
          fontSize: '0.7rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          {planet.name}
        </span>
        <span style={{ display: 'flex', gap: '3px' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: i < problem.difficulty ? '#fbbf24' : 'rgba(251,191,36,0.2)',
            }} />
          ))}
        </span>
      </div>
      <div style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>
        {problem.title}
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.7rem' }}>
        {problem.question}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
          {problem.tier} · {problem.inputType}
        </span>
        <span style={{ color: '#60a5fa', fontSize: '0.75rem' }}>
          Click to solve →
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add ProblemPreview to App**

In `src/App.tsx`, add import and render after HUD:
```tsx
import ProblemPreview from './components/ui/ProblemPreview'
```

Add `<ProblemPreview />` after `<HUD ... />` in the JSX.

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: Hovering a star in 3D shows a preview card on the right side with problem title, subject, difficulty dots, and question preview.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProblemPreview.tsx src/App.tsx
git commit -m "feat: add problem preview tooltip on star hover"
```

---

### Task 11: Problem Solver Overlay

**Files:**
- Create: `src/components/ui/ProblemSolver.tsx`, `src/components/ui/MultipleChoice.tsx`, `src/components/ui/ShortAnswer.tsx`, `src/components/ui/FormulaInput.tsx`, `src/components/ui/ResultBanner.tsx`, `src/components/ui/StepSolution.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create MultipleChoice input**

Create `src/components/ui/MultipleChoice.tsx`:
```tsx
import { useState } from 'react'
import type { Choice } from '../../types'

interface Props {
  choices: Choice[]
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function MultipleChoice({ choices, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {choices.map((choice) => (
          <button
            key={choice.label}
            onClick={() => !disabled && setSelected(choice.label)}
            style={{
              padding: '1rem',
              border: selected === choice.label
                ? '2px solid #60a5fa'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              background: selected === choice.label ? 'rgba(96,165,250,0.08)' : 'transparent',
              color: selected === choice.label ? '#f1f5f9' : '#cbd5e1',
              fontSize: '0.95rem',
              cursor: disabled ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ color: selected === choice.label ? '#60a5fa' : '#64748b', marginRight: '0.5rem' }}>
              {choice.label}.
            </span>
            {choice.text}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || disabled}
          style={{
            background: selected ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e293b',
            color: '#fff',
            padding: '0.7rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: selected && !disabled ? 'pointer' : 'default',
            opacity: selected && !disabled ? 1 : 0.5,
            fontSize: '1rem',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ShortAnswer input**

Create `src/components/ui/ShortAnswer.tsx`:
```tsx
import { useState } from 'react'

interface Props {
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function ShortAnswer({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        placeholder="Enter your answer..."
        style={{
          width: '300px',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#f1f5f9',
          fontSize: '1.1rem',
          textAlign: 'center',
          outline: 'none',
        }}
      />
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          style={{
            background: value.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e293b',
            color: '#fff',
            padding: '0.7rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: value.trim() && !disabled ? 'pointer' : 'default',
            opacity: value.trim() && !disabled ? 1 : 0.5,
            fontSize: '1rem',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create FormulaInput**

Create `src/components/ui/FormulaInput.tsx`:
```tsx
import { useState } from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

interface Props {
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function FormulaInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {value && (
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '1.3rem',
        }}>
          <InlineMath math={value || '\\text{...}'} />
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        placeholder="Type LaTeX: e.g. x = \frac{1}{2}"
        style={{
          width: '400px',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#f1f5f9',
          fontSize: '0.95rem',
          fontFamily: 'monospace',
          textAlign: 'center',
          outline: 'none',
        }}
      />
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          style={{
            background: value.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e293b',
            color: '#fff',
            padding: '0.7rem 2.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: value.trim() && !disabled ? 'pointer' : 'default',
            opacity: value.trim() && !disabled ? 1 : 0.5,
            fontSize: '1rem',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create ResultBanner**

Create `src/components/ui/ResultBanner.tsx`:
```tsx
import { motion } from 'framer-motion'

interface Props {
  correct: boolean
  xpEarned: number
  time: number
  onRetry?: () => void
}

export default function ResultBanner({ correct, xpEarned, time, onRetry }: Props) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: '12px',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>
        {correct ? '✓' : '✗'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: correct ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '1.05rem' }}>
          {correct ? 'Correct!' : 'Incorrect'}
        </div>
        <div style={{ color: correct ? '#86efac' : '#fca5a5', fontSize: '0.8rem' }}>
          {correct ? `+${xpEarned} XP · Solved in ${timeStr}` : `Time: ${timeStr}`}
        </div>
      </div>
      {!correct && onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Retry
        </button>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 5: Create StepSolution**

Create `src/components/ui/StepSolution.tsx`:
```tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'
import type { SolutionStep } from '../../types'

interface Props {
  steps: SolutionStep[]
}

export default function StepSolution({ steps }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < steps.length) {
      const timer = setTimeout(() => setVisibleCount(v => v + 1), 600)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, steps.length])

  return (
    <div>
      <div style={{
        color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: '1rem',
      }}>
        Step-by-step Solution
      </div>
      <div style={{ borderLeft: '2px solid rgba(96,165,250,0.3)', paddingLeft: '1.5rem' }}>
        <AnimatePresence>
          {steps.slice(0, visibleCount).map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: '1.5rem', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: '-1.85rem', top: 0,
                width: '12px', height: '12px', borderRadius: '50%',
                background: i === steps.length - 1 ? '#4ade80' : '#3b82f6',
              }} />
              <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Step {step.step}: {step.title}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{step.text}</div>
              {step.latex && (
                <div style={{
                  marginTop: '0.5rem', padding: '0.6rem',
                  background: 'rgba(255,255,255,0.03)', borderRadius: '6px',
                  fontSize: '1.1rem', textAlign: 'center',
                }}>
                  <InlineMath math={step.latex} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create ProblemSolver**

Create `src/components/ui/ProblemSolver.tsx`:
```tsx
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'
import { useProblemStore } from '../../stores/useProblemStore'
import { useGameStore } from '../../stores/useGameStore'
import { calculateXp } from '../../utils/xp'
import MultipleChoice from './MultipleChoice'
import ShortAnswer from './ShortAnswer'
import FormulaInput from './FormulaInput'
import ResultBanner from './ResultBanner'
import StepSolution from './StepSolution'
import { solarSystem } from '../../data/solar-system'

export default function ProblemSolver() {
  const problem = useProblemStore((s) => s.currentProblem)
  const closeProblem = useProblemStore((s) => s.closeProblem)
  const solveProblem = useGameStore((s) => s.solveProblem)
  const streak = useGameStore((s) => s.progress.streak)
  const solved = useGameStore((s) => s.progress.solved)

  const [result, setResult] = useState<{ correct: boolean; xp: number; time: number } | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!result) {
      const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
      return () => clearInterval(interval)
    }
  }, [startTime, result])

  const handleSubmit = useCallback((answer: string) => {
    if (!problem) return

    const isCorrect = answer.toLowerCase() === problem.answer.toLowerCase()
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const attempts = (solved[problem.id]?.attempts ?? 0) + 1
    const xpEarned = isCorrect ? calculateXp(problem.xp, attempts, streak) : 0

    solveProblem(problem.id, isCorrect, problem.xp, timeTaken)
    setResult({ correct: isCorrect, xp: xpEarned, time: timeTaken })
    setShowSolution(true)
  }, [problem, startTime, solveProblem, streak, solved])

  const handleRetry = () => {
    setResult(null)
    setShowSolution(false)
  }

  if (!problem) return null

  const subject = problem.id.slice(0, 3)
  const planet = solarSystem.planets.find(p =>
    p.id.toUpperCase().startsWith(subject)
  ) ?? solarSystem.planets[0]

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timerStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(2,6,23,0.97)',
          overflowY: 'auto',
        }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={closeProblem}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            ← Back to space
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              color: planet.color, fontSize: '0.75rem', fontWeight: 600,
              background: `${planet.color}22`, padding: '3px 10px', borderRadius: '99px',
            }}>
              {planet.name}
            </span>
            <span style={{ display: 'flex', gap: '3px' }}>
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i < problem.difficulty ? '#fbbf24' : 'rgba(251,191,36,0.2)',
                }} />
              ))}
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>{timerStr}</span>
        </div>

        {/* Problem content */}
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Problem #{problem.id}
          </div>
          <div style={{ color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {problem.title}
          </div>

          {/* Question */}
          <div style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '1rem' }}>
            {problem.question}
          </div>
          {problem.questionLatex && (
            <div style={{
              padding: '1.2rem', background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontSize: '1.3rem',
            }}>
              <BlockMath math={problem.questionLatex} />
            </div>
          )}

          {/* Result */}
          {result && (
            <ResultBanner
              correct={result.correct}
              xpEarned={result.xp}
              time={result.time}
              onRetry={!result.correct ? handleRetry : undefined}
            />
          )}

          {/* Solution */}
          {showSolution && <StepSolution steps={problem.solution} />}

          {/* Input */}
          {!result && (
            <>
              {problem.inputType === 'multiple' && problem.choices && (
                <MultipleChoice choices={problem.choices} onSubmit={handleSubmit} disabled={!!result} />
              )}
              {problem.inputType === 'short' && (
                <ShortAnswer onSubmit={handleSubmit} disabled={!!result} />
              )}
              {problem.inputType === 'formula' && (
                <FormulaInput onSubmit={handleSubmit} disabled={!!result} />
              )}
            </>
          )}

          {/* Action buttons after solution */}
          {result && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
              <button
                onClick={closeProblem}
                style={{
                  padding: '0.6rem 1.5rem', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem',
                  cursor: 'pointer', background: 'transparent',
                }}
              >
                ← Back to space
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 7: Add ProblemSolver to App**

In `src/App.tsx`, add:
```tsx
import ProblemSolver from './components/ui/ProblemSolver'
```
Add `<ProblemSolver />` after `<ProblemPreview />` in the JSX.

- [ ] **Step 8: Verify full flow**

Run: `npm run dev`
Expected: Hover star → preview card appears. Click star → full-screen solver overlay with problem, input, timer. Submit answer → result banner + step-by-step solution animates in. "Back to space" returns to 3D view.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui
git commit -m "feat: add problem solver with multiple choice, short answer, formula input, and step-by-step solutions"
```

---

### Task 12: Polish & Integration Testing

**Files:**
- Modify: `src/App.tsx`, `src/index.css`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Add ESC key handler to close problem**

In `src/App.tsx`, add useEffect:
```tsx
import { useEffect } from 'react'
import { useProblemStore } from './stores/useProblemStore'

// Inside App component:
const currentProblem = useProblemStore((s) => s.currentProblem)
const closeProblem = useProblemStore((s) => s.closeProblem)

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (currentProblem) {
        closeProblem()
      } else if (cameraTarget) {
        setCameraTarget(null)
        setActivePlanet(null)
      }
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentProblem, closeProblem, cameraTarget])
```

- [ ] **Step 2: Add KaTeX CSS import to index.css**

Add to `src/index.css`:
```css
@import 'katex/dist/katex.min.css';

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.2s ease;
}

button:hover {
  filter: brightness(1.1);
}
```

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (types, XP, unlock, game store).

- [ ] **Step 4: Run dev server and manual test full flow**

Run: `npm run dev`
Manual test checklist:
1. Solar system renders with sun, 5 planets, stars
2. Subject nav pills work (camera flies to planet)
3. Star hover shows preview
4. Star click opens solver
5. Submit answer shows result + solution
6. ESC closes solver
7. ESC again zooms out to overview
8. User stats update after solving

- [ ] **Step 5: Build for production**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ESC handling, polish, and verify production build"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Project scaffolding | package.json, vite.config.ts, App.tsx |
| 2 | Types & data config | types/index.ts, data/solar-system.ts |
| 3 | XP & unlock utilities | utils/xp.ts, utils/unlock.ts |
| 4 | Zustand stores | stores/useGameStore.ts, stores/useProblemStore.ts |
| 5 | Sample problem data | data/problems/*.json |
| 6 | 3D solar system scene | components/3d/Sun,Planet,Moon,SolarSystem,Skybox |
| 7 | Star markers with bloom | components/3d/Star.tsx, hooks/useStarPositions.ts |
| 8 | Camera fly-to animation | components/3d/CameraController.tsx |
| 9 | HUD overlay | components/ui/HUD,SubjectNav,UserStats,PlanetInfo,MiniMap |
| 10 | Problem preview tooltip | components/ui/ProblemPreview.tsx |
| 11 | Problem solver + solution | components/ui/ProblemSolver,MultipleChoice,ShortAnswer,FormulaInput,ResultBanner,StepSolution |
| 12 | Polish & integration | ESC handling, CSS, build verification |
