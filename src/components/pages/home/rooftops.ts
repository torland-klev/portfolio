// A Nordic harbor town seen from above: roofs in front, a fjord and mountains behind.
// All four home scenes draw this same layout, so they line up when they cross-fade.

function seeded(seed: number) {
    return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 4294967296
    }
}

export const W = 1600
export const H = 900
export const FJORD_TOP = 470
export const SHORE = 545
// The sun sits in the valley between two peaks, partly behind the far ridge.
export const SUN = { x: 830, y: 372, r: 62 }
// The town sits on this ground, from the shore down.
export const GROUND_TOP = SHORE + 8

// A mountain ridge through the peaks and valleys, closed down to the fjord.
// Each segment bows a little, so the slopes are not ruler-straight.
function ridge(points: [number, number][], bottom: number) {
    let d = `M-20 ${bottom} L-20 ${points[0][1]} L${points[0][0]} ${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1]
        const [x1, y1] = points[i]
        d += ` Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + (y1 < y0 ? 8 : -8)} ${x1} ${y1}`
    }
    return (
        d + ` L${W + 20} ${points[points.length - 1][1]} L${W + 20} ${bottom} Z`
    )
}

// Snow on the peaks of a ridge that rise above the snow line.
function snow(points: [number, number][], line: number) {
    return points
        .map(([x, y], i) => {
            if (y > line || i === 0 || i === points.length - 1) return ''
            const [lx, ly] = points[i - 1]
            const [rx, ry] = points[i + 1]
            const depth = Math.min(line - y, 40)
            const lt = depth / Math.max(ly - y, 1)
            const rt = depth / Math.max(ry - y, 1)
            return `M${x} ${y} L${x + (lx - x) * lt} ${y + depth} L${x + (lx - x) * lt * 0.5} ${y + depth * 0.7} L${x} ${y + depth * 0.9} L${x + (rx - x) * rt * 0.5} ${y + depth * 0.75} L${x + (rx - x) * rt} ${y + depth} Z`
        })
        .join(' ')
}

const FAR_PEAKS: [number, number][] = [
    [0, 410],
    [120, 360],
    [210, 392],
    [330, 300],
    [450, 378],
    [560, 332],
    [660, 392],
    [780, 350],
    [880, 396],
    [1000, 286],
    [1110, 370],
    [1210, 330],
    [1320, 392],
    [1440, 318],
    [1600, 380],
]
const NEAR_PEAKS: [number, number][] = [
    [0, 452],
    [150, 420],
    [300, 452],
    [420, 408],
    [560, 448],
    [700, 430],
    [860, 456],
    [980, 424],
    [1120, 454],
    [1260, 414],
    [1420, 448],
    [1600, 426],
]

export const farSnow = snow(FAR_PEAKS, 345)

export const farRidge = ridge(FAR_PEAKS, FJORD_TOP + 6)
export const nearRidge = ridge(NEAR_PEAKS, FJORD_TOP + 6)

export type Window = {
    x: number
    y: number
    w: number
    h: number
    lit: boolean
    flicker: number
}

export type House = {
    x: number
    w: number
    base: number
    h: number
    roofH: number
    // 'gable' faces us with a triangle, 'long' shows the long side of the roof.
    kind: 'gable' | 'long'
    color: number
    windows: Window[]
    chimney?: { x: number; y: number; w: number; h: number }
}

export function roofPath(b: House) {
    const top = b.base - b.h
    if (b.kind === 'gable')
        return `M${b.x - 3} ${top} L${b.x + b.w / 2} ${top - b.roofH} L${b.x + b.w + 3} ${top} Z`
    return `M${b.x - 4} ${top} L${b.x + b.w * 0.18} ${top - b.roofH} L${b.x + b.w * 0.82} ${top - b.roofH} L${b.x + b.w + 4} ${top} Z`
}

const rand = seeded(1624)

function row(opts: {
    base: number
    minW: number
    maxW: number
    minH: number
    maxH: number
    gap: number
    windowRows: number
    windowSize: [number, number]
    chimneyChance: number
}) {
    const houses: House[] = []
    let x = -30
    while (x < W + 30) {
        const w = opts.minW + rand() * (opts.maxW - opts.minW)
        const h = opts.minH + rand() * (opts.maxH - opts.minH)
        const kind = rand() < 0.3 ? 'long' : 'gable'
        const roofH = w * (kind === 'gable' ? 0.5 + rand() * 0.2 : 0.28)
        const top = opts.base - h
        const [ww, wh] = opts.windowSize
        const windows: Window[] = []
        const cols = Math.max(1, Math.floor((w - ww) / (ww * 2.2)))
        for (let r = 0; r < opts.windowRows; r++) {
            for (let c = 0; c < cols; c++) {
                windows.push({
                    x: x + (w - cols * ww * 2.2) / 2 + c * ww * 2.2 + ww * 0.6,
                    y: top + h * 0.2 + r * wh * 1.9,
                    w: ww,
                    h: wh,
                    lit: rand() < 0.45,
                    flicker: rand() < 0.12 ? rand() * 8 : -1,
                })
            }
        }
        const house: House = {
            x,
            w,
            base: opts.base,
            h,
            roofH,
            kind,
            color: Math.floor(rand() * 6),
            windows,
        }
        if (rand() < opts.chimneyChance)
            house.chimney = {
                x: x + w * (0.25 + rand() * 0.5),
                y: top - roofH * 0.75,
                w: Math.max(6, w * 0.07),
                h: roofH * 0.55,
            }
        houses.push(house)
        x += w + opts.gap * rand()
    }
    return houses
}

export const shoreRow = row({
    base: SHORE + 22,
    minW: 34,
    maxW: 64,
    minH: 14,
    maxH: 26,
    gap: 6,
    windowRows: 1,
    windowSize: [3, 4],
    chimneyChance: 0.1,
})
export const backRow = row({
    base: 650,
    minW: 60,
    maxW: 110,
    minH: 44,
    maxH: 80,
    gap: 6,
    windowRows: 2,
    windowSize: [6, 8],
    chimneyChance: 0.3,
})
export const midRow = row({
    base: 760,
    minW: 100,
    maxW: 170,
    minH: 70,
    maxH: 120,
    gap: 4,
    windowRows: 2,
    windowSize: [10, 14],
    chimneyChance: 0.45,
})

// The big roofs closest to us. Only their top parts are in view.
export const frontRoofs: House[] = [
    {
        x: -80,
        w: 430,
        base: 1010,
        h: 120,
        roofH: 230,
        kind: 'gable',
        color: 0,
        windows: [],
        chimney: { x: 210, y: 700, w: 26, h: 90 },
    },
    {
        x: 420,
        w: 360,
        base: 1010,
        h: 150,
        roofH: 110,
        kind: 'long',
        color: 3,
        windows: [],
    },
    {
        x: 1030,
        w: 330,
        base: 1010,
        h: 140,
        roofH: 120,
        kind: 'long',
        color: 5,
        windows: [],
        chimney: { x: 1250, y: 720, w: 24, h: 70 },
    },
    {
        x: 1330,
        w: 380,
        base: 1010,
        h: 110,
        roofH: 210,
        kind: 'gable',
        color: 2,
        windows: [],
    },
]

// A church in the middle distance, with a tall spire.
export const church = { x: 1150, base: 668, w: 46, towerH: 118, spireH: 150 }

// Chimneys that smoke, taken from the rows above.
export const smokingChimneys = [...midRow, ...frontRoofs]
    .filter((h) => h.chimney)
    .map((h) => ({ x: h.chimney!.x + h.chimney!.w / 2, y: h.chimney!.y }))
    .filter((_, i) => i % 2 === 0)

export const stars = Array.from({ length: 90 }, () => ({
    x: rand() * W,
    y: rand() * 320,
    r: 0.6 + rand() * 1.5,
    delay: rand() * 6,
}))
