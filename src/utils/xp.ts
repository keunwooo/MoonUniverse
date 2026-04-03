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
