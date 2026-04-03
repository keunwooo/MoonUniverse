import { solarSystem } from '../data/solar-system'
import type { PlanetConfig } from '../types'

export const PREFIX_MAP: Record<string, string> = {
  ALG: 'algebra',
  GEO: 'geometry',
  FUN: 'functions',
  CAL: 'calculus',
  PRO: 'probability',
}

export function getPlanetForProblem(problemId: string): PlanetConfig {
  const prefix = problemId.slice(0, 3).toUpperCase()
  const subjectId = PREFIX_MAP[prefix] ?? 'algebra'
  return solarSystem.planets.find(p => p.id === subjectId) ?? solarSystem.planets[0]
}
