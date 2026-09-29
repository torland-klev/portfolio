import { SIZE } from '../src/components/apps/cellsProtocol'

// The blog card shows this band of rows: the middle third of the grid.
export const FIRST_ROW = 34
export const ROWS = 32

const CELL = 8

// Draws the band as an SVG with the cover's fixed colors. An <img> cannot
// read the site theme, and these colors work on both themes.
export function snapshotSvg(cells: Uint8Array): string {
    let path = ''
    for (let row = 0; row < ROWS; row++) {
        const base = (FIRST_ROW + row) * SIZE
        let col = 0
        while (col < SIZE) {
            const i = base + col
            if (!(cells[i >> 3] & (1 << (i & 7)))) {
                col++
                continue
            }
            // One rectangle for each run of "on" cells. The grid lines
            // on top split the run into cells again.
            const start = col
            while (col < SIZE) {
                const j = base + col
                if (!(cells[j >> 3] & (1 << (j & 7)))) break
                col++
            }
            const w = (col - start) * CELL
            path += `M${start * CELL} ${row * CELL}h${w}v${CELL}h-${w}z`
        }
    }

    const w = SIZE * CELL
    const h = ROWS * CELL
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
        `<defs><pattern id="g" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse">` +
        `<path d="M${CELL - 1} 0h1v${CELL}h-1zM0 ${CELL - 1}h${CELL}v1h-${CELL}z" fill="#e6e6e6"/>` +
        `</pattern></defs>` +
        `<rect width="${w}" height="${h}" fill="#f6f6f6"/>` +
        `<path d="${path}" fill="#393e46"/>` +
        `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
        `</svg>`
    )
}
