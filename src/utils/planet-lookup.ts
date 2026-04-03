import { solarSystem } from '../data/solar-system'
import type { PlanetConfig } from '../types'

export const PREFIX_MAP: Record<string, string> = {
  ALG: 'algebra',
  GEO: 'geometry',
  FUN: 'functions',
  CAL: 'calculus',
  PRO: 'probability',
  FIN: 'final',
}

const SUN_AS_PLANET: PlanetConfig = {
  id: 'final' as any,
  name: '최종 도전',
  color: '#fbbf24',
  orbitRadius: 0,
  size: 3,
  texture: '',
  moon: { name: '', tutorialProblems: 0 },
}

export function getPlanetForProblem(problemId: string): PlanetConfig {
  const prefix = problemId.slice(0, 3).toUpperCase()
  if (prefix === 'FIN') return SUN_AS_PLANET
  const subjectId = PREFIX_MAP[prefix] ?? 'algebra'
  return solarSystem.planets.find(p => p.id === subjectId) ?? solarSystem.planets[0]
}
