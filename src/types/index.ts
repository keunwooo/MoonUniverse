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
