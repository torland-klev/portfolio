import { useEffect, useRef, useState } from 'react'
import styles from './cells.module.scss'
import { CELLS, SIZE, parseSet } from './cellsProtocol'

type Status = 'connecting' | 'live' | 'offline'

function isOn(cells: Uint8Array, i: number): boolean {
    return (cells[i >> 3] & (1 << (i & 7))) !== 0
}

function setCell(cells: Uint8Array, i: number, v: 0 | 1) {
    if (v) cells[i >> 3] |= 1 << (i & 7)
    else cells[i >> 3] &= ~(1 << (i & 7))
}

function countOn(cells: Uint8Array): number {
    let n = 0
    for (let i = 0; i < CELLS; i++) if (isOn(cells, i)) n++
    return n
}

function socketUrl(): string {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${location.host}/api/cells`
}

export default function CellsApp() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cellsRef = useRef(new Uint8Array(CELLS / 8))
    const socketRef = useRef<WebSocket | null>(null)
    // The cell that the keyboard cursor is on. -1 hides the cursor.
    const cursorRef = useRef(-1)
    const drawRef = useRef(() => {})
    const [status, setStatus] = useState<Status>('connecting')
    const [online, setOnline] = useState(0)
    const [on, setOn] = useState(0)

    // Drawing. It redraws the full grid at most once per frame.
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        let frame = 0
        function paint() {
            frame = 0
            if (!canvas || !ctx) return
            const css = getComputedStyle(document.documentElement)
            const onColor = css.getPropertyValue('--text')
            const offColor = css.getPropertyValue('--bg-alt')
            const lineColor = css.getPropertyValue('--border')
            const size = canvas.width
            const gap = size / SIZE >= 4 ? 1 : 0
            const edge = (n: number) => Math.round((n * size) / SIZE)

            ctx.fillStyle = lineColor
            ctx.fillRect(0, 0, size, size)
            const cells = cellsRef.current
            for (let row = 0; row < SIZE; row++) {
                const y0 = edge(row)
                const y1 = edge(row + 1)
                for (let col = 0; col < SIZE; col++) {
                    const x0 = edge(col)
                    const x1 = edge(col + 1)
                    ctx.fillStyle = isOn(cells, row * SIZE + col)
                        ? onColor
                        : offColor
                    ctx.fillRect(x0, y0, x1 - x0 - gap, y1 - y0 - gap)
                }
            }

            const cursor = cursorRef.current
            if (cursor >= 0) {
                const row = Math.floor(cursor / SIZE)
                const col = cursor % SIZE
                const width = Math.max(2, Math.round(size / 400))
                ctx.strokeStyle = css.getPropertyValue('--accent')
                ctx.lineWidth = width
                ctx.strokeRect(
                    edge(col) - width / 2,
                    edge(row) - width / 2,
                    edge(col + 1) - edge(col) + width,
                    edge(row + 1) - edge(row) + width
                )
            }
        }
        drawRef.current = () => {
            if (!frame) frame = requestAnimationFrame(paint)
        }

        const resize = () => {
            const px = Math.round(
                canvas.clientWidth * (window.devicePixelRatio || 1)
            )
            if (px && px !== canvas.width) {
                canvas.width = px
                canvas.height = px
            }
            paint()
        }
        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(canvas)

        // The header toggle sets data-theme. The OS setting applies otherwise.
        const themeObserver = new MutationObserver(drawRef.current)
        themeObserver.observe(document.documentElement, {
            attributeFilter: ['data-theme'],
        })
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        mql.addEventListener('change', drawRef.current)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            themeObserver.disconnect()
            mql.removeEventListener('change', drawRef.current)
            drawRef.current = () => {}
        }
    }, [])

    // Connection. It reconnects with backoff, and the server sends the full
    // grid on each connect.
    useEffect(() => {
        let retry = 0
        let timer = 0
        let stopped = false

        function connect() {
            setStatus('connecting')
            const socket = new WebSocket(socketUrl())
            socket.binaryType = 'arraybuffer'
            socketRef.current = socket

            socket.onopen = () => {
                retry = 0
            }
            socket.onmessage = (event) => {
                if (event.data instanceof ArrayBuffer) {
                    cellsRef.current = new Uint8Array(event.data)
                    setStatus('live')
                } else {
                    const set = parseSet(event.data)
                    if (set) {
                        setCell(cellsRef.current, set.i, set.v)
                    } else {
                        const { online } = JSON.parse(event.data)
                        if (typeof online === 'number') setOnline(online)
                        return
                    }
                }
                setOn(countOn(cellsRef.current))
                drawRef.current()
            }
            socket.onclose = () => {
                if (socketRef.current === socket) socketRef.current = null
                if (stopped) return
                setStatus('offline')
                const delay = Math.min(10_000, 1000 * 2 ** retry++)
                timer = window.setTimeout(connect, delay)
            }
        }
        connect()

        return () => {
            stopped = true
            clearTimeout(timer)
            socketRef.current?.close()
        }
    }, [])

    function send(i: number, v: 0 | 1) {
        const socket = socketRef.current
        if (socket?.readyState !== WebSocket.OPEN) return
        if (isOn(cellsRef.current, i) === Boolean(v)) return
        // Show the change at once. The server echoes it to every client.
        setCell(cellsRef.current, i, v)
        setOn(countOn(cellsRef.current))
        drawRef.current()
        socket.send(JSON.stringify({ i, v }))
    }

    function toggle(i: number) {
        send(i, isOn(cellsRef.current, i) ? 0 : 1)
    }

    // A mouse drag paints every cell it crosses with the value of the first
    // cell. Touch must scroll the page, so a tap toggles one cell instead.
    const paintRef = useRef<0 | 1 | null>(null)
    const mouseRef = useRef(false)
    const lastCellRef = useRef(-1)

    function cellAt(event: React.MouseEvent<HTMLCanvasElement>): number {
        const rect = event.currentTarget.getBoundingClientRect()
        const col = Math.floor(
            ((event.clientX - rect.left) / rect.width) * SIZE
        )
        const row = Math.floor(
            ((event.clientY - rect.top) / rect.height) * SIZE
        )
        if (col < 0 || col >= SIZE || row < 0 || row >= SIZE) return -1
        return row * SIZE + col
    }

    function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
        mouseRef.current = event.pointerType === 'mouse'
        if (!mouseRef.current) return
        const i = cellAt(event)
        if (i < 0 || status !== 'live') return
        event.currentTarget.setPointerCapture(event.pointerId)
        paintRef.current = isOn(cellsRef.current, i) ? 0 : 1
        lastCellRef.current = i
        send(i, paintRef.current)
    }

    // Pointer events skip cells when the mouse moves fast, so paint the
    // straight line from the last cell (Bresenham).
    function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
        const v = paintRef.current
        const to = cellAt(event)
        if (v === null || to < 0 || to === lastCellRef.current) return
        let row = Math.floor(lastCellRef.current / SIZE)
        let col = lastCellRef.current % SIZE
        const toRow = Math.floor(to / SIZE)
        const toCol = to % SIZE
        const dRow = Math.abs(toRow - row)
        const dCol = Math.abs(toCol - col)
        const stepRow = row < toRow ? 1 : -1
        const stepCol = col < toCol ? 1 : -1
        let error = dCol - dRow
        while (row !== toRow || col !== toCol) {
            if (2 * error > -dRow) {
                error -= dRow
                col += stepCol
            }
            if (2 * error < dCol) {
                error += dCol
                row += stepRow
            }
            send(row * SIZE + col, v)
        }
        lastCellRef.current = to
    }

    function onPointerUp() {
        paintRef.current = null
    }

    function onClick(event: React.MouseEvent<HTMLCanvasElement>) {
        if (mouseRef.current) return
        const i = cellAt(event)
        if (i >= 0) toggle(i)
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
        const cursor = Math.max(0, cursorRef.current)
        const row = Math.floor(cursor / SIZE)
        const col = cursor % SIZE
        const moves: Record<string, [number, number]> = {
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
        }
        const move = moves[event.key]
        if (move) {
            const r = Math.min(SIZE - 1, Math.max(0, row + move[0]))
            const c = Math.min(SIZE - 1, Math.max(0, col + move[1]))
            cursorRef.current = r * SIZE + c
        } else if (event.key === ' ' || event.key === 'Enter') {
            cursorRef.current = cursor
            toggle(cursor)
        } else {
            return
        }
        event.preventDefault()
        drawRef.current()
    }

    const statusText = {
        connecting: 'Connecting…',
        live: `Live · ${online} ${online === 1 ? 'person' : 'people'} here`,
        offline: 'Offline · reconnecting…',
    }[status]

    return (
        <div className={styles.cells}>
            <div className={styles.bar}>
                <span className={styles.status} data-status={status}>
                    {statusText}
                </span>
                <span>
                    {on.toLocaleString('en')} of {CELLS.toLocaleString('en')} on
                </span>
            </div>
            <canvas
                ref={canvasRef}
                className={styles.canvas}
                tabIndex={0}
                aria-label={`Shared grid of ${SIZE} by ${SIZE} cells. Use the arrow keys to move and Space to switch a cell on or off.`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onFocus={(event) => {
                    // A click also focuses the canvas. Show the cursor only
                    // for keyboard focus.
                    if (!event.currentTarget.matches(':focus-visible')) return
                    if (cursorRef.current < 0) cursorRef.current = 0
                    drawRef.current()
                }}
                onBlur={() => {
                    cursorRef.current = -1
                    drawRef.current()
                }}
            />
        </div>
    )
}
