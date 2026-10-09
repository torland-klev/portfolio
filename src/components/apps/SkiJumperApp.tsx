import { useEffect, useRef, useState } from 'react'
import styles from './skiJumper.module.scss'
import {
    Jumper,
    JumpResult,
    MaterialId,
    ObstacleKind,
    Point,
    World,
    G,
    AIR_DENSITY,
    HOP_HEIGHT,
    TOUGHNESS,
    MAX_TOUGHNESS,
    ICE_BOOST,
    MAX_ICE_BOOST,
} from './skiJumper/physics'

// At zoom 1 the view and the field are 100 m wide. A view wider than the
// field, or one dragged past its right or top edge, makes the field bigger.
// The field never shrinks again, so that nothing drawn is lost. The left
// edge and the ground stay where they are. The canvas keeps a 16:10 aspect
// ratio.
const WIDTH = 100
const HEIGHT = 62.5
const ZOOMS = [0.25, 0.5, 1, 1.5, 2, 3, 4]
const STEP = 1 / 240
// The eraser is this wide on screen, so it grows in metres as the view
// zooms out.
const ERASE_RADIUS = 2

// Marks on the toughness slider, in points.
const TOUGHNESS_MARKS = [
    { label: 'Fragile', value: 1 },
    { label: 'Normal', value: TOUGHNESS },
    { label: 'Invincible', value: MAX_TOUGHNESS },
]

// Marks on the auto hop slider, in m.
const HOP_MARKS = [
    { label: 'Off', value: 0 },
    { label: 'Small', value: HOP_HEIGHT },
    { label: 'Box', value: 2.5 },
]

// Marks on the air density slider, in kg/m³.
const AIR_MARKS = [
    { label: 'Vacuum', value: 0 },
    { label: 'Mars', value: 0.02 },
    { label: 'Earth', value: AIR_DENSITY },
]

// Marks on the gravity slider, in m/s².
const GRAVITY_MARKS = [
    { label: 'Moon', value: 1.62 },
    { label: 'Mars', value: 3.71 },
    { label: 'Earth', value: G },
    { label: 'Jupiter', value: 24.79 },
]

// Marks on the accelerated ice slider, as a boost.
const ICE_BOOST_MARKS = [
    { label: 'Perfect ice', value: 1 },
    { label: 'Fast', value: ICE_BOOST },
    { label: 'Rocket', value: MAX_ICE_BOOST },
]

type DrawMaterial = 'snow' | 'ice' | 'perfectIce' | 'acceleratedIce' | 'grass'
type Tool = 'move' | 'jumper' | DrawMaterial | 'erase' | ObstacleKind

const TOOLS: { id: Tool; label: string }[] = [
    { id: 'move', label: 'Move' },
    { id: 'jumper', label: 'Jumper' },
    { id: 'snow', label: 'Draw snow' },
    { id: 'ice', label: 'Draw ice' },
    { id: 'perfectIce', label: 'Draw perfect ice' },
    { id: 'acceleratedIce', label: 'Draw accelerated ice' },
    { id: 'grass', label: 'Draw grass' },
    { id: 'erase', label: 'Erase' },
    { id: 'rock', label: 'Rock' },
    { id: 'bumper', label: 'Bumper' },
    { id: 'trampoline', label: 'Trampoline' },
    { id: 'box', label: 'Box' },
]

function isDrawTool(tool: Tool): tool is DrawMaterial {
    return (
        tool === 'snow' ||
        tool === 'ice' ||
        tool === 'perfectIce' ||
        tool === 'acceleratedIce' ||
        tool === 'grass'
    )
}

// The colors of the plastic toy.
const TOY_COLORS = ['#d33a2c', '#1f5fbf', '#f0b90b']

const MATERIAL_COLORS: Record<MaterialId, string | null> = {
    // Snow uses the text color, so that it shows on both themes.
    snow: null,
    ice: '#4dabf7',
    perfectIce: '#a5f3fc',
    acceleratedIce: '#7950f2',
    grass: '#40a02b',
    rock: '#868e96',
    rubber: '#f76707',
    trampoline: '#be4bdb',
    wood: '#b5835a',
    wall: null,
}

function newWorld(): World {
    return new World(WIDTH, HEIGHT)
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
    const rootRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    // A new world on each load. Nothing is saved.
    const [world] = useState(newWorld)
    const toolRef = useRef<Tool>('snow')
    const strokeRef = useRef<Point[] | null>(null)
    const hoverRef = useRef<Point | null>(null)
    // The view: its bottom-left corner in the world, in m, and its width as
    // a share of 100 m.
    const viewRef = useRef({ x: 0, y: 0, zoom: 1 })
    // The pointer that drags the view, and where it was last.
    const panRef = useRef<{ id: number; x: number; y: number } | null>(null)
    const pausedRef = useRef(false)
    const slowRef = useRef(false)

    const [tool, setTool] = useState<Tool>('snow')
    const [paused, setPaused] = useState(false)
    const [slow, setSlow] = useState(false)
    const [gravity, setGravity] = useState(G)
    const [airDensity, setAirDensity] = useState(AIR_DENSITY)
    const [hopHeight, setHopHeight] = useState(HOP_HEIGHT)
    const [toughness, setToughness] = useState(TOUGHNESS)
    const [iceBoost, setIceBoost] = useState(ICE_BOOST)
    const [zoom, setZoom] = useState(1)
    const [field, setField] = useState({ width: WIDTH, height: HEIGHT })
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

    // Space charges a jump while the canvas is on screen. It does not when
    // the focus is in a text field or in a control outside the app.
    useEffect(() => {
        function onScreen(): boolean {
            const rect = canvasRef.current?.getBoundingClientRect()
            return !!rect && rect.bottom > 0 && rect.top < window.innerHeight
        }

        function isJumpKey(event: KeyboardEvent): boolean {
            if (event.code !== 'Space' || !onScreen()) return false
            const focus = document.activeElement
            if (focus?.closest('input:not([type=range]), textarea, select'))
                return false
            return (
                !focus ||
                focus === document.body ||
                !!rootRef.current?.contains(focus)
            )
        }
        function onKeyDown(event: KeyboardEvent) {
            if (!isJumpKey(event)) return
            event.preventDefault()
            if (!event.repeat) world.startCharge()
        }
        function onKeyUp(event: KeyboardEvent) {
            if (event.code !== 'Space' || !world.charging) return
            event.preventDefault()
            world.releaseCharge()
        }
        function onBlur() {
            if (world.charging) world.releaseCharge()
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        window.addEventListener('blur', onBlur)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
            window.removeEventListener('blur', onBlur)
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
            const view = viewRef.current
            const scale = canvas.width / (WIDTH * view.zoom)
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.fillStyle = css.getPropertyValue('--bg-alt')
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // From here on, draw in metres with the y axis up.
            ctx.setTransform(
                scale,
                0,
                0,
                -scale,
                -view.x * scale,
                (view.y + HEIGHT * view.zoom) * scale
            )
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
                ctx.arc(hover.x, hover.y, eraseRadius(), 0, Math.PI * 2)
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

    function eraseRadius(): number {
        return ERASE_RADIUS * viewRef.current.zoom
    }

    // Moves the view, and grows the field to the right and up to cover it.
    function moveView(x: number, y: number) {
        const view = viewRef.current
        view.x = Math.max(x, 0)
        view.y = Math.max(y, 0)
        const right = Math.ceil(view.x + WIDTH * view.zoom)
        const top = Math.ceil(view.y + HEIGHT * view.zoom)
        if (right > world.width || top > world.height) {
            world.resize(
                Math.max(world.width, right),
                Math.max(world.height, top)
            )
            setField({ width: world.width, height: world.height })
        }
    }

    // Zooms about the middle of the view.
    function zoomTo(next: number) {
        const view = viewRef.current
        const middle = {
            x: view.x + (WIDTH * view.zoom) / 2,
            y: view.y + (HEIGHT * view.zoom) / 2,
        }
        view.zoom = next
        moveView(middle.x - (WIDTH * next) / 2, middle.y - (HEIGHT * next) / 2)
        setZoom(next)
    }

    function toWorld(event: React.PointerEvent<HTMLCanvasElement>): Point {
        const rect = event.currentTarget.getBoundingClientRect()
        const view = viewRef.current
        const width = WIDTH * view.zoom
        const height = HEIGHT * view.zoom
        return {
            x: view.x + ((event.clientX - rect.left) / rect.width) * width,
            y:
                view.y +
                height -
                ((event.clientY - rect.top) / rect.height) * height,
        }
    }

    function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
        const at = toWorld(event)
        event.currentTarget.setPointerCapture(event.pointerId)
        hoverRef.current = at
        const tool = toolRef.current
        // The move tool, or the middle or right button with any tool, drags
        // the view.
        if (tool === 'move' || event.button === 1 || event.button === 2) {
            event.preventDefault()
            panRef.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
            }
        } else if (tool === 'jumper') world.addJumper(at)
        else if (isDrawTool(tool)) strokeRef.current = [at]
        else if (tool === 'erase') world.erase(at, eraseRadius())
        else world.addObstacle(tool, at)
    }

    function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
        const at = toWorld(event)
        const previous = hoverRef.current ?? at
        hoverRef.current = at
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const pan = panRef.current
        if (pan?.id === event.pointerId) {
            const rect = event.currentTarget.getBoundingClientRect()
            const view = viewRef.current
            const metres = (WIDTH * view.zoom) / rect.width
            moveView(
                view.x - (event.clientX - pan.x) * metres,
                view.y + (event.clientY - pan.y) * metres
            )
            pan.x = event.clientX
            pan.y = event.clientY
            return
        }
        const stroke = strokeRef.current
        if (stroke) {
            const tail = stroke[stroke.length - 1]
            if (Math.hypot(at.x - tail.x, at.y - tail.y) >= 0.3) stroke.push(at)
        } else if (toolRef.current === 'erase') {
            world.erase(previous, eraseRadius(), at)
        }
    }

    function onPointerUp() {
        panRef.current = null
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

    return (
        <div ref={rootRef} className={styles.skiJumper}>
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
                aria-label="Ski jump. Choose a tool, then click or drag to draw a hill and drop jumpers. Drag with the move tool, or with the right mouse button, to move the view. Dragging past the right or top edge makes the field bigger. Hold space to charge a jump, and release it to jump."
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={() => (hoverRef.current = null)}
                onContextMenu={(event) => event.preventDefault()}
            />
            <div className={styles.toolbar}>
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
                <button
                    type="button"
                    disabled={zoom === ZOOMS[ZOOMS.length - 1]}
                    onClick={() => zoomTo(ZOOMS[ZOOMS.indexOf(zoom) + 1])}
                >
                    Zoom out
                </button>
                <button
                    type="button"
                    disabled={zoom === ZOOMS[0]}
                    onClick={() => zoomTo(ZOOMS[ZOOMS.indexOf(zoom) - 1])}
                >
                    Zoom in
                </button>
            </div>
            <div className={styles.sliders}>
                <Slider
                    id="ski-jumper-gravity"
                    label="Gravity"
                    unit="m/s²"
                    max={30}
                    value={gravity}
                    marks={GRAVITY_MARKS}
                    onChange={(value) => {
                        world.gravity = value
                        setGravity(value)
                    }}
                />
                <Slider
                    id="ski-jumper-air"
                    label="Air density"
                    unit="kg/m³"
                    max={3}
                    value={airDensity}
                    marks={AIR_MARKS}
                    onChange={(value) => {
                        world.airDensity = value
                        setAirDensity(value)
                    }}
                />
                <Slider
                    id="ski-jumper-toughness"
                    label="Skier toughness"
                    unit="points"
                    min={1}
                    max={MAX_TOUGHNESS}
                    step={1}
                    value={toughness}
                    marks={TOUGHNESS_MARKS}
                    format={(value) =>
                        value >= MAX_TOUGHNESS ? '∞' : value.toLocaleString()
                    }
                    onChange={(value) => {
                        world.toughness = value
                        setToughness(value)
                    }}
                />
                <Slider
                    id="ski-jumper-ice-boost"
                    label="Accelerated ice"
                    unit="×"
                    min={1}
                    max={MAX_ICE_BOOST}
                    step={0.1}
                    value={iceBoost}
                    marks={ICE_BOOST_MARKS}
                    format={(value) =>
                        `${value.toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        })}×`
                    }
                    onChange={(value) => {
                        world.iceBoost = value
                        setIceBoost(value)
                    }}
                />
                <Slider
                    id="ski-jumper-hop"
                    label="Auto hop"
                    unit="m"
                    max={3}
                    value={hopHeight}
                    marks={HOP_MARKS}
                    onChange={(value) => {
                        world.hopHeight = value
                        setHopHeight(value)
                    }}
                />
            </div>
            <dl className={styles.stats}>
                <div>
                    <dt>Field</dt>
                    <dd>
                        {formatMetres(field.width)} ×{' '}
                        {formatMetres(field.height)} m
                    </dd>
                </div>
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

type Mark = { label: string; value: number }

function Slider(props: {
    id: string
    label: string
    unit: string
    min?: number
    max: number
    step?: number
    value: number
    marks: Mark[]
    // Shows the value in place of the number and the unit.
    format?: (value: number) => string
    onChange: (value: number) => void
}) {
    const { id, label, unit, max, value, marks, format, onChange } = props
    const { min = 0, step = 0.01 } = props
    return (
        <div className={styles.slider}>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                list={`${id}-marks`}
                onChange={(event) => onChange(Number(event.target.value))}
            />
            <datalist id={`${id}-marks`}>
                {marks.map((mark) => (
                    <option
                        key={mark.label}
                        value={mark.value}
                        label={mark.label}
                    />
                ))}
            </datalist>
            <output htmlFor={id}>
                {format
                    ? format(value)
                    : `${value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      })} ${unit}`}
            </output>
            <span className={styles.marks}>
                {marks.map((mark) => (
                    <button
                        key={mark.label}
                        type="button"
                        aria-label={`${label}: ${mark.label}`}
                        aria-pressed={value === mark.value}
                        onClick={() => onChange(mark.value)}
                    >
                        {mark.label}
                    </button>
                ))}
            </span>
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
    ctx.rotate(j.pitch)

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
    // After a crash, the figure lies forward over its skis.
    if (j.crashed) ctx.rotate(-1.1)
    // A charging jumper crouches: the knee goes forward and the body goes
    // down and leans over the skis.
    const c = j.charge
    const knee = { x: 0.25 + 0.35 * c, y: 0.8 - 0.35 * c }
    const lean = { x: 0.3 * c, y: -0.45 * c }
    ctx.beginPath()
    ctx.moveTo(0, 0.1)
    ctx.lineTo(knee.x, knee.y)
    ctx.lineTo(0.5 + lean.x, 1.4 + lean.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(
        0.6 + lean.x,
        1.62 + lean.y,
        Math.max(0.17, 2 * pixel),
        0,
        Math.PI * 2
    )
    ctx.fill()

    // The white bib on the chest.
    const bib = (t: number) => ({
        x: knee.x + (0.5 + lean.x - knee.x) * t,
        y: knee.y + (1.4 + lean.y - knee.y) * t,
    })
    const bibFrom = bib(0.37)
    const bibTo = bib(0.77)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(0.12, pixel)
    ctx.beginPath()
    ctx.moveTo(bibFrom.x, bibFrom.y)
    ctx.lineTo(bibTo.x, bibTo.y)
    ctx.stroke()
    ctx.restore()

    // A level bar above the head fills with the charge.
    if (c > 0) {
        ctx.save()
        ctx.globalAlpha = Math.max(0, j.opacity)
        const width = 1.6
        const x = j.x - width / 2
        const y = j.y + 2.3
        const height = Math.max(0.2, 3 * pixel)
        ctx.strokeStyle = color
        ctx.lineWidth = Math.max(0.06, pixel)
        ctx.strokeRect(x, y, width, height)
        ctx.fillStyle = color
        ctx.fillRect(x, y, width * c, height)
        ctx.restore()
    }
}
