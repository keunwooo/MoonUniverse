# MoonUniverse — Design Spec

A 3D space-themed math learning platform for middle and high school students. Stars represent math problems in a realistic solar system, where difficulty maps to brightness, size, and proximity to the sun.

## Target Audience

Middle and high school students (algebra, geometry, functions, calculus, probability).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D | Three.js via React Three Fiber (@react-three/fiber, @react-three/drei, @react-three/postprocessing) |
| UI | React + Framer Motion (HTML overlay on 3D canvas) |
| Math rendering | KaTeX + react-katex |
| State | Zustand |
| Persistence | LocalStorage (v1), expandable to auth + DB |
| Build | Vite + TypeScript |
| Problem data | Static JSON (v1), expandable to AI generation |

## Architecture

Three layers, cleanly separated:

- **3D Layer** (React Three Fiber): SolarSystem, Planet, Star, Skybox, CameraController components. Renders the interactive 3D universe.
- **UI Layer** (React HTML overlay): HUD, ProblemPreview, ProblemSolver, StepSolution, SubjectNav components. Floats on top of the 3D canvas.
- **Data Layer** (Zustand + JSON): useGameStore (progress, XP, unlocks), useProblemStore (problem loading, current problem state). Persists to LocalStorage.

```
src/
  components/
    3d/          ← R3F components
    ui/          ← HTML overlay UI
  stores/        ← Zustand stores
  data/          ← Problem JSON files
  types/         ← TypeScript types
  hooks/         ← Custom hooks
  utils/         ← Helpers
  App.tsx        ← Root (Canvas + UI)
  main.tsx       ← Entry point
public/
  textures/      ← Planet/star textures
  hdri/          ← Space environment maps
```

## Solar System Structure

### Layout

- **Sun** (center): Final challenge hub. Cross-subject expert problems. Unlocked when 3+ planets reach hard tier.
- **Planets** (5 orbital rings): Each planet represents a math subject with a unique color.
  - Orbit 1 (closest): Algebra (#7c3aed, purple)
  - Orbit 2: Geometry (#16a34a, green)
  - Orbit 3: Functions (#2563eb, blue)
  - Orbit 4: Calculus (#e11d48, red)
  - Orbit 5 (farthest): Probability (#0891b2, cyan)
- **Moons** (per planet): Tutorial/intro problems for that subject. Always accessible.
- **Stars** (scattered around planets): Individual math problems. Positioned between planet orbit and sun.

### Star Visual Rules

| Property | Rule |
|----------|------|
| Size | Harder problems = bigger star |
| Brightness | Harder problems = brighter glow (postprocessing bloom) |
| Color | Unsolved = white, Solved = gold, Locked = dim gray |
| Position | Closer to sun = harder tier, farther = easier |

### Difficulty Tiers (per planet)

1. **Tutorial** (Moon/satellite) — intro problems, always open
2. **Easy** (Lv.1-2) — outer stars, small dim glow
3. **Medium** (Lv.3-4) — mid-range stars
4. **Hard** (Lv.5-6) — inner stars, bright glow
5. **Expert** (Lv.7) — near-sun stars, intense glow

### Camera & Navigation

- Scroll: zoom in/out
- Drag: orbit around solar system
- Click planet: smooth fly-to animation
- Double-click star: zoom to star detail
- ESC / back button: zoom out to previous view
- Subject nav pills (top-left HUD): quick-jump to planet

## Problem Solving Flow

Three-step interaction:

### Step 1: Star Hover — Mini Preview

A tooltip-style card appears near the hovered star showing:
- Subject tag (color-coded)
- Difficulty stars (1-7 filled dots)
- Problem title
- Problem text preview
- Input type and "Click to solve →" prompt

### Step 2: Star Click — Problem Solver (Full Overlay)

Full-screen overlay with blurred 3D background:
- **Top bar**: Back button, subject tag, difficulty stars, timer
- **Problem area**: Problem ID, title, question text with KaTeX-rendered formulas
- **Input area** (varies by difficulty):
  - Multiple choice (Easy): A/B/C/D buttons in 2x2 grid
  - Short answer (Medium): Number/text input field
  - Formula input (Hard+): KaTeX math editor
- **Submit button**

### Step 3: After Submit — Step-by-Step Solution

- **Result banner**: Correct (green) or incorrect (red) with XP earned and solve time. On incorrect, user can retry the same problem (attempts tracked). XP scales by attempt: 1st = 100%, 2nd-3rd = 70%, 4th+ = 50% (minimum guarantee). Progression (tier unlocks) is based on solved count only, not XP — so retries never block progress.
- **Solution timeline**: Vertical timeline with numbered steps, each containing a title, explanation text, and LaTeX formula. Steps reveal one by one with animation.
- **Action buttons**: "Back to space" or "Next problem →"

## HUD (Heads-Up Display)

Overlaid on 3D space at all times:

| Position | Element | Content |
|----------|---------|---------|
| Top-left | Subject Nav | Pill buttons for each planet (quick-jump) |
| Top-right | User Stats | Level, XP bar, solved count, wrong count, streak |
| Bottom-left | Planet Info | Current planet name, progress bar, tier completion badges |
| Bottom-right | Mini Map | Top-down solar system with camera position indicator |

## Progress & Unlock System

### XP & Leveling

- Correct answer: +10 to +50 XP (scales with difficulty 1-7)
- Retry scaling: 1st attempt = 100% XP, 2nd-3rd = 70%, 4th+ = 50% (minimum guarantee)
- Streak bonus: 3+ consecutive correct = 1.5x XP multiplier
- Level up: unlocks cosmetic titles (displayed in user stats)
- Progression (tier unlocks) is solved-count based, never blocked by XP

### Unlock Rules

| Tier | Unlock Condition |
|------|-----------------|
| Tutorial (Moon) | Always open |
| Easy | Complete tutorial |
| Medium | 70%+ of easy tier solved |
| Hard | 70%+ of medium tier solved |
| Sun challenges | 3+ planets at hard tier |

## Data Model

### Problem Schema (JSON)

Each subject has its own file: `data/problems/{subject}.json`

```typescript
interface Problem {
  id: string;              // e.g. "ALG-001"
  title: string;
  difficulty: number;      // 1-7
  tier: "tutorial" | "easy" | "medium" | "hard" | "expert";
  inputType: "multiple" | "short" | "formula";
  question: string;
  questionLatex?: string;
  choices?: Choice[];      // only for inputType: "multiple"
  answer: string;
  answerLatex?: string;
  solution: SolutionStep[];
  xp: number;
  tags: string[];
}

interface Choice {
  label: string;           // "A", "B", "C", "D"
  text: string;
  correct?: boolean;
}

interface SolutionStep {
  step: number;
  title: string;
  text: string;
  latex?: string;
}
```

### Solar System Config

```typescript
interface SolarSystemConfig {
  sun: { name: string; unlockCondition: string };
  planets: PlanetConfig[];
}

interface PlanetConfig {
  id: string;              // subject ID
  name: string;
  color: string;           // hex
  orbitRadius: number;     // 3D units from sun
  size: number;
  texture: string;
  moon: { name: string; tutorialProblems: number };
}
```

### User Progress (LocalStorage)

Stored under key `"moonuniverse-progress"`:

```typescript
interface UserProgress {
  level: number;
  xp: number;
  streak: number;
  solved: Record<string, SolvedRecord>;
  unlocked: Record<string, Tier>;
  sunUnlocked: boolean;
  stats: {
    totalSolved: number;
    totalWrong: number;
    bestStreak: number;
    totalTime: number;     // seconds
  };
}

interface SolvedRecord {
  correct: boolean;
  attempts: number;
  time: number;            // seconds
}
```

## Visual Style

Realistic space aesthetic (NASA-like):
- Dark background with real star field (HDRI environment map)
- Physically-based planet textures
- Bloom postprocessing for star glow (brighter = harder)
- Smooth camera animations (spring-based via drei)
- UI: dark translucent panels with backdrop blur, subtle borders

## Future Expansion Points

- **AI problem generation**: Replace static JSON with LLM API calls
- **Authentication**: Add social login (Google) + server-side progress storage
- **Pretext.js**: Potential use for high-performance text layout in problem lists
- **Multiplayer**: Competitive problem-solving races
- **Custom subjects**: User-created problem sets as new planets
