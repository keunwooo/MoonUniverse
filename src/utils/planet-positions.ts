/**
 * Global registry of live planet 3D positions.
 * Updated every frame by Planet components.
 * Read by App when SubjectNav is clicked.
 */
const positions: Record<string, [number, number, number]> = {}

export function setPlanetPosition(id: string, x: number, y: number, z: number) {
  positions[id] = [x, y, z]
}

export function getPlanetPosition(id: string): [number, number, number] | null {
  return positions[id] ?? null
}
