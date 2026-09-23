// The city layout that both home scenes share, so they line up when they cross-fade.

function seeded(seed: number) {
    return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 4294967296
    }
}

export const W = 1600
export const H = 900
export const HORIZON = 640
export const SUN = { x: W / 2, y: HORIZON - 110, r: 200 }
export const PALMS = [
    { x: 110, scale: 1.15, flip: false },
    { x: 260, scale: 0.8, flip: false },
    { x: 1500, scale: 1.2, flip: true },
    { x: 1360, scale: 0.75, flip: true },
]
export const PALM_FRONDS = [-150, -115, -80, -45, -10, 25, 60]
export const PALM_TRUNK = 'M0 0 Q 30 -170 70 -330'
export const PALM_FROND = 'M0 0 Q 70 -34 160 14 Q 80 -8 0 10 Z'

const WINDOW_COLORS = ['#ffcf6b', '#ff5fa2', '#5ff2ff', '#ffe9a8']

export type Building = {
    x: number
    w: number
    h: number
    neon?: string
    windows: { x: number; y: number; color: string; flicker: number }[]
}

function buildRow(
    rand: () => number,
    minH: number,
    maxH: number,
    withWindows: boolean
) {
    const row: Building[] = []
    let x = -20
    while (x < W + 20) {
        const w = 50 + rand() * 90
        // Keep the middle low, so the sun shows between the towers.
        const fromCenter = Math.min(Math.abs(x + w / 2 - W / 2) / 420, 1)
        const h = (minH + rand() * (maxH - minH)) * (0.25 + 0.75 * fromCenter)
        const building: Building = { x, w, h, windows: [] }
        if (withWindows) {
            if (rand() < 0.14)
                building.neon = rand() < 0.5 ? '#ff3fa4' : '#3ff0ff'
            for (let wy = HORIZON - h + 18; wy < HORIZON - 14; wy += 20) {
                for (let wx = x + 10; wx < x + w - 12; wx += 16) {
                    if (rand() < 0.33)
                        building.windows.push({
                            x: wx,
                            y: wy,
                            color: WINDOW_COLORS[
                                Math.floor(rand() * WINDOW_COLORS.length)
                            ],
                            flicker: rand() < 0.12 ? rand() * 8 : -1,
                        })
                }
            }
        }
        row.push(building)
        x += w + (withWindows ? 4 + rand() * 10 : 0)
    }
    return row
}

const rand = seeded(1984)
export const farRow = buildRow(rand, 90, 260, false)
export const nearRow = buildRow(rand, 120, 360, true)
export const stars = Array.from({ length: 70 }, () => ({
    x: rand() * W,
    y: rand() * 330,
    r: 0.6 + rand() * 1.6,
    delay: rand() * 6,
}))
