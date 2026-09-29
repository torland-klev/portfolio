// Shared by the page and the Worker (worker/index.ts).
//
// Server to client: a binary message is the full grid, one bit per cell,
// row by row. A text message is either a cell change {"i","v"} or the number
// of open connections {"online"}.
// Client to server: a text message {"i","v"} sets cell i to v (0 or 1).

export const SIZE = 100
export const CELLS = SIZE * SIZE

export type CellSet = { i: number; v: 0 | 1 }

export function parseSet(message: unknown): CellSet | null {
    if (typeof message !== 'string' || message.length > 64) return null
    try {
        const { i, v } = JSON.parse(message)
        if (!Number.isInteger(i) || i < 0 || i >= CELLS) return null
        if (v !== 0 && v !== 1) return null
        return { i, v }
    } catch {
        return null
    }
}
