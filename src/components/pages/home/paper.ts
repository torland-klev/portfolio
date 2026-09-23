import { W } from './city'

// A wavy paper edge across the width, with room on both sides for it to slide.
export function wavePath(
    baseY: number,
    amplitude: number,
    wavelength: number,
    bottom: number,
    phase = 0
) {
    const start = -200
    const end = W + 200
    let d = `M${start} ${bottom} L${start} ${baseY}`
    for (let x = start; x <= end; x += wavelength / 2) {
        const i = Math.round((x - start) / (wavelength / 2))
        const peak = (i + phase) % 2 === 0 ? -amplitude : amplitude
        d += ` Q${x + wavelength / 4} ${baseY + peak} ${x + wavelength / 2} ${baseY}`
    }
    return d + ` L${end} ${bottom} Z`
}

// A paper cloud: a flat base with three bumps.
export function cloudPath(x: number, y: number, s: number) {
    return (
        `M${x} ${y}` +
        ` a${22 * s} ${22 * s} 0 0 1 ${30 * s} ${-22 * s}` +
        ` a${30 * s} ${30 * s} 0 0 1 ${52 * s} ${-14 * s}` +
        ` a${24 * s} ${24 * s} 0 0 1 ${38 * s} ${18 * s}` +
        ` a${18 * s} ${18 * s} 0 0 1 ${10 * s} ${18 * s} Z`
    )
}
