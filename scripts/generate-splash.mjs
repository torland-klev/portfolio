import fs from 'fs'
// Generates the /portfolio backgrounds: splash.svg (light) and splash-dark.svg (dark).
// Run: node scripts/generate-splash.mjs
// Deterministic random numbers, so the image is the same on every build.
let seed = 20260923
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
const range = (a, b) => a + rnd() * (b - a)
const gauss = () => {
    let u = 0,
        v = 0
    while (!u) u = rnd()
    while (!v) v = rnd()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
const f = (n) => Math.round(n * 10) / 10

const W = 1600,
    H = 2000
// Centre line of a swoosh: cubic Bezier segments through these points.
function curve(pts) {
    return (t) => {
        const n = pts.length - 1,
            seg = Math.min(Math.floor(t * n), n - 1),
            u = t * n - seg
        const p0 = pts[Math.max(seg - 1, 0)],
            p1 = pts[seg],
            p2 = pts[seg + 1],
            p3 = pts[Math.min(seg + 2, n)]
        const u2 = u * u,
            u3 = u2 * u
        const c = (a, b, c2, d) =>
            0.5 *
            (2 * b +
                (-a + c2) * u +
                (2 * a - 5 * b + 4 * c2 - d) * u2 +
                (-a + 3 * b - 3 * c2 + d) * u3)
        return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]
    }
}
function pathThrough(fn, offset, wobble, steps = 160) {
    let d = ''
    for (let i = 0; i <= steps; i++) {
        const t = i / steps,
            [x, y] = fn(t),
            [x2, y2] = fn(Math.min(t + 0.01, 1)),
            [x1, y1] = fn(Math.max(t - 0.01, 0))
        const nx = -(y2 - y1),
            ny = x2 - x1,
            len = Math.hypot(nx, ny) || 1
        const o = offset + wobble * Math.sin(t * Math.PI * 2 + offset)
        d +=
            (i ? 'L' : 'M') +
            f(x + (nx / len) * o) +
            ' ' +
            f(y + (ny / len) * o)
    }
    return d
}
// An irregular paint blob: a circle with a noisy radius, smoothed.
function blob(cx, cy, r, spikes = 0) {
    const n = 14,
        pts = []
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        let rr = r * range(0.7, 1.25)
        if (spikes && rnd() < spikes) rr *= range(1.4, 2.2)
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
    }
    let d = `M${f((pts[0][0] + pts[1][0]) / 2)} ${f((pts[0][1] + pts[1][1]) / 2)}`
    for (let i = 1; i <= n; i++) {
        const p = pts[i % n],
            q = pts[(i + 1) % n]
        d += `Q${f(p[0])} ${f(p[1])} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`
    }
    return d + 'Z'
}

const main = curve([
    [1160, -120],
    [1090, 300],
    [1150, 700],
    [1000, 1120],
    [1070, 1560],
    [940, 2120],
])
const echo = curve([
    [300, -120],
    [380, 420],
    [260, 960],
    [390, 1480],
    [290, 2120],
])
function build(variantSeed, stops, highlight) {
    seed = variantSeed
    const out = []

    for (const [fn, ribbons, spread, alpha] of [
        [echo, 7, 70, 0.45],
        [main, 14, 150, 1],
    ]) {
        // Ribbons
        for (let i = 0; i < ribbons; i++) {
            const w = rnd() < 0.3 ? range(30, 70) : range(5, 22)
            out.push(
                `<path d="${pathThrough(fn, range(-spread, spread), range(10, 60))}" stroke="url(#r)" stroke-width="${f(w * (alpha < 1 ? 0.7 : 1))}" fill="none" stroke-linecap="round" opacity="${f(range(0.45, 0.95) * alpha * 100) / 100}"/>`
            )
            if (rnd() < 0.5)
                out.push(
                    `<path d="${pathThrough(fn, range(-spread, spread), range(10, 40))}" stroke="${highlight}" stroke-width="${f(range(2, 6))}" fill="none" stroke-linecap="round" opacity="${f(0.35 * alpha * 100) / 100}"/>`
                )
        }
        // Paint blobs along the flow
        for (let i = 0; i < (alpha < 1 ? 14 : 34); i++) {
            const [x, y] = fn(rnd()),
                dx = gauss() * spread * 1.2,
                dy = gauss() * 40
            out.push(
                `<path d="${blob(x + dx, y + dy, range(18, 70) * (alpha < 1 ? 0.7 : 1), 0.25)}" fill="url(#r)" opacity="${f(range(0.55, 0.92) * alpha * 100) / 100}"/>`
            )
        }
        // Splatter dots, some faded and large
        for (let i = 0; i < (alpha < 1 ? 120 : 320); i++) {
            const [x, y] = fn(rnd()),
                dist = Math.abs(gauss()) * spread * 2.4 * (rnd() < 0.5 ? -1 : 1)
            const big = rnd() < 0.12
            out.push(
                `<circle cx="${f(x + dist)}" cy="${f(y + gauss() * 30)}" r="${f(big ? range(12, 26) : range(2, 10))}" fill="url(#r)" opacity="${f((big ? range(0.2, 0.35) : range(0.4, 0.9)) * alpha * 100) / 100}"/>`
            )
        }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice">
    <defs><linearGradient id="r" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}">
    ${stops}
    </linearGradient></defs>
    ${out.join('\n')}
    </svg>
    `
    console.log('bytes', svg.length, 'elements', out.length)
    return svg
}

const variants = [
    {
        file: 'splash.svg',
        seed: 20260923,
        highlight: '#fff',
        stops: '<stop offset="0" stop-color="#1596f0"/><stop offset="0.16" stop-color="#18b9c9"/><stop offset="0.32" stop-color="#8fd33a"/><stop offset="0.45" stop-color="#e3ea2a"/><stop offset="0.58" stop-color="#ffd21a"/><stop offset="0.72" stop-color="#ff8c1a"/><stop offset="0.86" stop-color="#f23a3a"/><stop offset="1" stop-color="#d81b7a"/>',
    },
    // Neon synthwave for dark mode, with its own shapes.
    {
        file: 'splash-dark.svg',
        seed: 19840101,
        highlight: '#ffe6ff',
        stops: '<stop offset="0" stop-color="#00e5ff"/><stop offset="0.2" stop-color="#3f7cff"/><stop offset="0.4" stop-color="#8b5cff"/><stop offset="0.58" stop-color="#c04dff"/><stop offset="0.74" stop-color="#ff3fb4"/><stop offset="0.88" stop-color="#ff5f7a"/><stop offset="1" stop-color="#ffb35c"/>',
    },
]

for (const v of variants) {
    const svg = build(v.seed, v.stops, v.highlight)
    fs.writeFileSync(new URL(`../src/images/${v.file}`, import.meta.url), svg)
    console.log(v.file, svg.length)
}
