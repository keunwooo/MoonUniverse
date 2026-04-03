import type { SolarSystemConfig } from '../types'

export const solarSystem: SolarSystemConfig = {
  sun: {
    name: '최종 도전',
    unlockCondition: '3 planets at hard tier',
  },
  planets: [
    {
      id: 'algebra',
      name: '대수',
      color: '#7c3aed',
      orbitRadius: 8,
      size: 1.2,
      texture: 'textures/algebra.jpg',
      moon: { name: '대수 기초', tutorialProblems: 4 },
    },
    {
      id: 'geometry',
      name: '기하',
      color: '#16a34a',
      orbitRadius: 13,
      size: 1.4,
      texture: 'textures/geometry.jpg',
      moon: { name: '기하 기초', tutorialProblems: 4 },
    },
    {
      id: 'functions',
      name: '함수',
      color: '#2563eb',
      orbitRadius: 18,
      size: 1.1,
      texture: 'textures/functions.jpg',
      moon: { name: '함수 기초', tutorialProblems: 4 },
    },
    {
      id: 'calculus',
      name: '미적분',
      color: '#e11d48',
      orbitRadius: 23,
      size: 1.5,
      texture: 'textures/calculus.jpg',
      moon: { name: '미적분 기초', tutorialProblems: 4 },
    },
    {
      id: 'probability',
      name: '확률통계',
      color: '#0891b2',
      orbitRadius: 28,
      size: 1.3,
      texture: 'textures/probability.jpg',
      moon: { name: '확률통계 기초', tutorialProblems: 4 },
    },
  ],
}
