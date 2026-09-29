import { useEffect, useRef, useState } from 'react'
import styles from './skiJumper.module.scss'
import {
    defaultHill,
    Jumper,
    JumpResult,
    MaterialId,
    ObstacleKind,
    Point,
    World,
} from './skiJumper/physics'

// The world is 100 m wide. The canvas keeps a 16:10 aspect ratio.
const WIDTH = 100
const HEIGHT = 62.5
const STEP = 1 / 240
const ERASE_RADIUS = 2
const START: Point = { x: 4, y: 56 }

type DrawMaterial = 'snow' | 'ice' | 'grass'
type Tool = 'jumper' | DrawMaterial | 'erase' | ObstacleKind

const TOOLS: { id: Tool; label: string }[] = [
    { id: 'jumper', label: 'Jumper' },
    { id: 'snow', label: 'Draw snow' },
    { id: 'ice', label: 'Draw ice' },
    { id: 'grass', label: 'Draw grass' },
    { id: 'erase', label: 'Erase' },
    { id: 'rock', label: 'Rock' },
    { id: 'bumper', label: 'Bumper' },
    { id: 'box', label: 'Box' },
]

function isDrawTool(tool: Tool): tool is DrawMaterial {
    return tool === 'snow' || tool === 'ice' || tool === 'grass'
}

// The colors of the plastic toy.
const TOY_COLORS = ['#d33a2c', '#1f5fbf', '#f0b90b']

const MATERIAL_COLORS: Record<MaterialId, string | null> = {
    // Snow uses the text color, so that it shows on both themes.
    snow: null,
    ice: '#4dabf7',
    grass: '#40a02b',
    rock: '#868e96',
    rubber: '#f76707',
    wood: '#b5835a',
    wall: null,
}

function addDefaultHill(world: World) {
    const hill = defaultHill()
    world.addStroke(hill.inrun, 'snow')
    world.addStroke(hill.landing, 'snow')
}

function newWorld(): World {
    const world = new World(WIDTH, HEIGHT)
    addDefaultHill(world)
    return world
}

function formatMetres(metres: number): string {
    return metres.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
}

function describe(jump: JumpResult): string {
    const distance = `${formatMetres(jump.distance)} m`
    const speed = `${Math.round(jump.speed * 3.6).toLocaleString()} km/h`
    return jump.crashed
        ? `crash after ${distance} (take-off ${speed})`
        : `${distance} (take-off ${speed})`
}

export default function SkiJumperApp() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    // A new world on each load. Nothing is saved.
    const [world] = useState(newWorld)
    const toolRef = useRef<Tool>('jumper')
    const strokeRef = useRef<Point[] | null>(null)
    const hoverRef = useRef<Point | null>(null)
    const pausedRef = useRef(false)
    const slowRef = useRef(false)

    const [tool, setTool] = useState<Tool>('jumper')
    const [paused, setPaused] = useState(false)
    const [slow, setSlow] = useState(false)
    const [count, setCount] = useState(0)
    const [last, setLast] = useState<JumpResult | null>(null)
    const [best, setBest] = useState<JumpResult | null>(null)

    useEffect(() => {
        world.onJump = (jump) => {
            setLast(jump)
            if (!jump.crashed)
                setBest((best) =>
                    !best || jump.distance > best.distance ? jump : best
                )
        }
    }, [world])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        let frame = 0
        let previous = performance.now()
        let backlog = 0
        let shownCount = -1

        function loop(now: number) {
            frame = requestAnimationFrame(loop)
            const elapsed = Math.min(0.1, (now - previous) / 1000)
            previous = now
            if (!pausedRef.current) {
                backlog += elapsed * (slowRef.current ? 0.25 : 1)
                while (backlog >= STEP) {
                    world.step(STEP)
                    backlog -= STEP
                }
            }
            if (world.jumpers.length !== shownCount) {
                shownCount = world.jumpers.length
                setCount(shownCount)
            }
            if (canvas && ctx) draw(ctx, canvas)
        }

        function draw(
            ctx: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement
        ) {
            const css = getComputedStyle(document.documentElement)
            const text = css.getPropertyValue('--text')
            const scale = canvas.width / WIDTH
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.fillStyle = css.getPropertyValue('--bg-alt')
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // From here on, draw in metres with the y axis up.
            ctx.setTransform(scale, 0, 0, -scale, 0, HEIGHT * scale)
            const pixel = 1 / scale
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            for (const obstacle of world.obstacles.values()) {
                if (obstacle.segments.length !== obstacle.points.length)
                    continue
                const color =
                    MATERIAL_COLORS[
                        world.segments.get(obstacle.segments[0])!.material
                    ]!
                ctx.beginPath()
                obstacle.points.forEach((p, i) =>
                    i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
                )
                ctx.closePath()
                ctx.globalAlpha = 0.35
                ctx.fillStyle = color
                ctx.fill()
                ctx.globalAlpha = 1
            }

            ctx.lineWidth = Math.max(0.35, 2 * pixel)
            for (const segment of world.segments.values()) {
                if (segment.material === 'wall') continue
                ctx.strokeStyle = MATERIAL_COLORS[segment.material] ?? text
                ctx.beginPath()
                ctx.moveTo(segment.a.x, segment.a.y)
                ctx.lineTo(segment.b.x, segment.b.y)
                ctx.stroke()
            }

            const stroke = strokeRef.current
            if (stroke && stroke.length > 1) {
                ctx.globalAlpha = 0.5
                ctx.strokeStyle =
                    MATERIAL_COLORS[toolRef.current as DrawMaterial] ?? text
                ctx.beginPath()
                stroke.forEach((p, i) =>
                    i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
                )
                ctx.stroke()
                ctx.globalAlpha = 1
            }

            for (const jumper of world.jumpers) drawJumper(ctx, jumper, pixel)

            const hover = hoverRef.current
            if (hover && toolRef.current === 'erase') {
                ctx.strokeStyle = text
                ctx.lineWidth = pixel
                ctx.setLineDash([4 * pixel, 4 * pixel])
                ctx.beginPath()
                ctx.arc(hover.x, hover.y, ERASE_RADIUS, 0, Math.PI * 2)
                ctx.stroke()
                ctx.setLineDash([])
            }

            // A 10 m scale bar in the top-right corner.
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            const bar = 10 * scale
            const right = canvas.width - 12 * devicePixelRatio
            const top = 14 * devicePixelRatio
            ctx.strokeStyle = css.getPropertyValue('--text-muted')
            ctx.fillStyle = ctx.strokeStyle
            ctx.lineWidth = devicePixelRatio
            ctx.beginPath()
            ctx.moveTo(right - bar, top)
            ctx.lineTo(right, top)
            ctx.moveTo(right - bar, top - 4 * devicePixelRatio)
            ctx.lineTo(right - bar, top + 4 * devicePixelRatio)
            ctx.moveTo(right, top - 4 * devicePixelRatio)
            ctx.lineTo(right, top + 4 * devicePixelRatio)
            ctx.stroke()
            ctx.font = `${12 * devicePixelRatio}px system-ui, sans-serif`
            ctx.textAlign = 'center'
            ctx.fillText('10 m', right - bar / 2, top + 16 * devicePixelRatio)
        }

        const resize = () => {
            const px = Math.round(canvas.clientWidth * (devicePixelRatio || 1))
            if (px && px !== canvas.width) {
                canvas.width = px
                canvas.height = Math.round((px * HEIGHT) / WIDTH)
            }
        }
        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(canvas)
        frame = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
        }
    }, [world])

    function toWorld(event: React.PointerEvent<HTMLCanvasElement>): Point {
        const rect = event.currentTarget.getBoundingClientRect()
        return {
            x: ((event.clientX - rect.left) / rect.width) * WIDTH,
            y: HEIGHT - ((event.clientY - rect.top) / rect.height) * HEIGHT,
        }
    }

    function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
        const at = toWorld(event)
        event.currentTarget.setPointerCapture(event.pointerId)
        hoverRef.current = at
        const tool = toolRef.current
        if (tool === 'jumper') world.addJumper(at)
        else if (isDrawTool(tool)) strokeRef.current = [at]
        else if (tool === 'erase') world.erase(at, ERASE_RADIUS)
        else world.addObstacle(tool, at)
    }

    function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
        const at = toWorld(event)
        hoverRef.current = at
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const stroke = strokeRef.current
        if (stroke) {
            const tail = stroke[stroke.length - 1]
            if (Math.hypot(at.x - tail.x, at.y - tail.y) >= 0.3) stroke.push(at)
        } else if (toolRef.current === 'erase') {
            world.erase(at, ERASE_RADIUS)
        }
    }

    function onPointerUp() {
        const stroke = strokeRef.current
        const tool = toolRef.current
        if (stroke && isDrawTool(tool)) world.addStroke(stroke, tool)
        strokeRef.current = null
    }

    function chooseTool(next: Tool) {
        toolRef.current = next
        setTool(next)
    }

    function togglePause() {
        pausedRef.current = !pausedRef.current
        setPaused(pausedRef.current)
    }

    function toggleSlow() {
        slowRef.current = !slowRef.current
        setSlow(slowRef.current)
    }

    function resetHill() {
        world.clearSlope()
        addDefaultHill(world)
    }

    return (
        <div className={styles.skiJumper}>
            <div className={styles.toolbar} role="toolbar" aria-label="Tools">
                {TOOLS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        aria-pressed={tool === t.id}
                        onClick={() => chooseTool(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <canvas
                ref={canvasRef}
                className={styles.canvas}
                data-tool={tool}
                aria-label="Ski jump. Choose a tool, then click or drag on the hill."
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={() => (hoverRef.current = null)}
            />
            <div className={styles.toolbar}>
                <button type="button" onClick={() => world.addJumper(START)}>
                    Drop at the top
                </button>
                <button type="button" onClick={togglePause}>
                    {paused ? 'Play' : 'Pause'}
                </button>
                <button type="button" aria-pressed={slow} onClick={toggleSlow}>
                    Slow motion
                </button>
                <button type="button" onClick={() => (world.jumpers = [])}>
                    Clear jumpers
                </button>
                <button type="button" onClick={() => world.clearSlope()}>
                    Clear hill
                </button>
                <button type="button" onClick={resetHill}>
                    Reset hill
                </button>
            </div>
            <dl className={styles.stats}>
                <div>
                    <dt>Jumpers</dt>
                    <dd>{count.toLocaleString()}</dd>
                </div>
                <div>
                    <dt>Last jump</dt>
                    <dd>{last ? describe(last) : '–'}</dd>
                </div>
                <div>
                    <dt>Best jump</dt>
                    <dd>{best ? describe(best) : '–'}</dd>
                </div>
            </dl>
        </div>
    )
}

// The toy: a stiff plastic figure that leans forward on long metal skis.
// The origin is at the feet, and x points the way the jumper faces.
function drawJumper(ctx: CanvasRenderingContext2D, j: Jumper, pixel: number) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, j.opacity)
    ctx.translate(j.x, j.y)
    ctx.scale(j.facing, 1)
    if (j.crashed) {
        // Tumble around the hips.
        ctx.translate(0.25, 0.8)
        ctx.rotate(j.pitch)
        ctx.translate(-0.25, -0.8)
    } else {
        ctx.rotate(j.pitch)
    }

    ctx.strokeStyle = '#8f99a6'
    ctx.lineWidth = Math.max(0.1, 1.5 * pixel)
    ctx.beginPath()
    ctx.moveTo(-1.0, 0.03)
    ctx.lineTo(1.35, 0.03)
    ctx.lineTo(1.55, 0.18)
    ctx.stroke()

    const color = TOY_COLORS[j.color]
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = Math.max(0.3, 2.5 * pixel)
    ctx.beginPath()
    ctx.moveTo(0, 0.1)
    ctx.lineTo(0.25, 0.8)
    ctx.lineTo(0.5, 1.4)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0.6, 1.62, Math.max(0.17, 2 * pixel), 0, Math.PI * 2)
    ctx.fill()

    // The white bib on the chest.
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(0.12, pixel)
    ctx.beginPath()
    ctx.moveTo(0.34, 1.02)
    ctx.lineTo(0.44, 1.26)
    ctx.stroke()
    ctx.restore()
}
