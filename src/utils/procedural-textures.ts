import * as THREE from 'three'

/**
 * Generate realistic-looking planet textures procedurally using Canvas.
 * No external images needed.
 */

function createCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx }
}

// Simple noise function for organic patterns
function noise2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 113.5) * 43758.5453
  return n - Math.floor(n)
}

function fbm(x: number, y: number, seed: number, octaves: number = 4): number {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency, seed + i * 17)
    amplitude *= 0.5
    frequency *= 2
  }
  return value
}

// --- Sun texture: turbulent plasma surface ---
export function createSunTexture(): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = createCanvas(size)
  const imageData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 6
      const ny = y / size * 6
      const v = fbm(nx, ny, 42, 6)

      // Sun colors: yellow-orange-white
      const r = Math.min(255, 200 + v * 55)
      const g = Math.min(255, 140 + v * 80)
      const b = Math.min(255, 20 + v * 60)

      const i = (y * size + x) * 4
      imageData.data[i] = r
      imageData.data[i + 1] = g
      imageData.data[i + 2] = b
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Rocky planet (Mercury-like): craters and gray surface ---
export function createRockyTexture(
  baseColor: [number, number, number] = [160, 140, 130],
  seed: number = 1
): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = createCanvas(size)
  const imageData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 8
      const ny = y / size * 8
      const terrain = fbm(nx, ny, seed, 5)
      const crater = fbm(nx * 3, ny * 3, seed + 100, 3)

      const dark = crater < 0.35 ? 0.6 : 1.0
      const brightness = (terrain * 0.4 + 0.6) * dark

      const i = (y * size + x) * 4
      imageData.data[i] = baseColor[0] * brightness
      imageData.data[i + 1] = baseColor[1] * brightness
      imageData.data[i + 2] = baseColor[2] * brightness
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Earth-like: oceans, continents, clouds ---
export function createEarthTexture(seed: number = 2): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = createCanvas(size)
  const imageData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 5
      const ny = y / size * 5
      const land = fbm(nx, ny, seed, 5)
      const cloud = fbm(nx * 2 + 10, ny * 2 + 10, seed + 50, 3)

      let r: number, g: number, b: number

      if (land > 0.52) {
        // Land: greens and browns
        const t = (land - 0.52) * 5
        r = 60 + t * 80
        g = 120 + t * 30
        b = 40 + t * 20
      } else {
        // Ocean: deep blue
        r = 20 + land * 40
        g = 50 + land * 60
        b = 140 + land * 80
      }

      // Cloud overlay
      if (cloud > 0.55) {
        const c = (cloud - 0.55) * 4
        r = r + (255 - r) * c * 0.5
        g = g + (255 - g) * c * 0.5
        b = b + (255 - b) * c * 0.5
      }

      // Polar ice caps
      const lat = Math.abs(y / size - 0.5) * 2
      if (lat > 0.85) {
        const ice = (lat - 0.85) * 6
        r = r + (240 - r) * ice
        g = g + (245 - g) * ice
        b = b + (255 - b) * ice
      }

      const i = (y * size + x) * 4
      imageData.data[i] = Math.min(255, r)
      imageData.data[i + 1] = Math.min(255, g)
      imageData.data[i + 2] = Math.min(255, b)
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Mars-like: red dusty surface with dark areas ---
export function createMarsTexture(seed: number = 3): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = createCanvas(size)
  const imageData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 7
      const ny = y / size * 7
      const terrain = fbm(nx, ny, seed, 5)
      const detail = fbm(nx * 4, ny * 4, seed + 30, 3)

      const brightness = terrain * 0.5 + detail * 0.3 + 0.3

      // Mars: reds and oranges
      const r = Math.min(255, 180 * brightness + 40)
      const g = Math.min(255, 100 * brightness + 15)
      const b = Math.min(255, 60 * brightness + 10)

      // Polar caps
      const lat = Math.abs(y / size - 0.5) * 2
      const i = (y * size + x) * 4
      if (lat > 0.88) {
        const ice = (lat - 0.88) * 8
        imageData.data[i] = Math.min(255, r + (220 - r) * ice)
        imageData.data[i + 1] = Math.min(255, g + (210 - g) * ice)
        imageData.data[i + 2] = Math.min(255, b + (200 - b) * ice)
      } else {
        imageData.data[i] = r
        imageData.data[i + 1] = g
        imageData.data[i + 2] = b
      }
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Gas giant (Jupiter-like): horizontal bands ---
export function createGasGiantTexture(
  colors: [number, number, number][] = [[200, 170, 130], [180, 140, 100], [220, 200, 160], [160, 120, 80]],
  seed: number = 4
): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = createCanvas(size)
  const imageData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 10
      const ny = y / size

      // Horizontal bands with noise
      const bandNoise = fbm(nx, ny * 20, seed, 4) * 0.1
      const band = (ny + bandNoise) * colors.length
      const bandIdx = Math.floor(band) % colors.length
      const nextIdx = (bandIdx + 1) % colors.length
      const t = band - Math.floor(band)

      // Storm spots
      const storm = fbm(nx * 3, ny * 15, seed + 20, 3)

      const c1 = colors[bandIdx]
      const c2 = colors[nextIdx]
      const mix = t * t * (3 - 2 * t) // smoothstep

      let r = c1[0] * (1 - mix) + c2[0] * mix
      let g = c1[1] * (1 - mix) + c2[1] * mix
      let b = c1[2] * (1 - mix) + c2[2] * mix

      // Storm brightness variation
      const stormFactor = 0.85 + storm * 0.3
      r *= stormFactor
      g *= stormFactor
      b *= stormFactor

      const i = (y * size + x) * 4
      imageData.data[i] = Math.min(255, r)
      imageData.data[i + 1] = Math.min(255, g)
      imageData.data[i + 2] = Math.min(255, b)
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// --- Ringed gas giant (Saturn-like) ---
export function createSaturnTexture(seed: number = 5): THREE.CanvasTexture {
  return createGasGiantTexture(
    [[210, 190, 150], [190, 170, 130], [230, 210, 170], [180, 160, 120], [200, 180, 140]],
    seed
  )
}

// --- Moon texture: gray cratered surface ---
export function createMoonTexture(seed: number = 6): THREE.CanvasTexture {
  return createRockyTexture([180, 175, 170], seed)
}

// --- Texture cache ---
const textureCache: Record<string, THREE.CanvasTexture> = {}

export function getPlanetTexture(planetId: string): THREE.CanvasTexture {
  if (textureCache[planetId]) return textureCache[planetId]

  let tex: THREE.CanvasTexture
  switch (planetId) {
    case 'sun':
      tex = createSunTexture()
      break
    case 'algebra':
      // Mercury-like rocky
      tex = createRockyTexture([170, 150, 140], 10)
      break
    case 'geometry':
      // Earth-like
      tex = createEarthTexture(20)
      break
    case 'functions':
      // Mars-like
      tex = createMarsTexture(30)
      break
    case 'calculus':
      // Jupiter-like gas giant
      tex = createGasGiantTexture(
        [[200, 160, 120], [180, 130, 90], [220, 190, 150], [170, 120, 80], [210, 170, 130]],
        40
      )
      break
    case 'probability':
      // Saturn-like
      tex = createSaturnTexture(50)
      break
    case 'moon':
      tex = createMoonTexture(60)
      break
    default:
      tex = createRockyTexture([150, 150, 150], 99)
  }

  textureCache[planetId] = tex
  return tex
}
