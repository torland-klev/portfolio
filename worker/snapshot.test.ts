import { expect, test } from 'vitest'
import { CELLS, SIZE } from '../src/components/apps/cellsProtocol'
import { FIRST_ROW, snapshotSvg } from './snapshot'

function on(cells: Uint8Array, i: number) {
    cells[i >> 3] |= 1 << (i & 7)
}

test('draws each run of on cells in the band as one rectangle', () => {
    const cells = new Uint8Array(CELLS / 8)
    const base = FIRST_ROW * SIZE
    on(cells, base + 2)
    on(cells, base + 3)
    on(cells, base + 4)
    on(cells, base + SIZE + 99)
    // Row 0 is outside the band.
    on(cells, 0)

    const path = snapshotSvg(cells).match(/<path d="([^"]*)" fill="#393e46"/)
    expect(path?.[1]).toBe('M16 0h24v8h-24zM792 8h8v8h-8z')
})

test('draws no cells for an empty grid', () => {
    expect(snapshotSvg(new Uint8Array(CELLS / 8))).toContain(
        '<path d="" fill="#393e46"/>'
    )
})
