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
