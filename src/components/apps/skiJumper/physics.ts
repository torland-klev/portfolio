// Ski jumper physics in SI units: metres, seconds, kilograms. The y axis
// points up.
//
// A jumper is a point mass at the feet. Each step adds gravity, air drag and
// (in flight) aerodynamic lift, then moves the jumper and resolves contacts
// with the slope as impulses. The normal impulse removes the velocity into
// the surface, and Coulomb friction takes mu times that impulse from the
// velocity along it. The slope is a set of short straight segments, so a
// jumper leaves the surface at a convex edge (the take-off) and lands on the
// next surface it touches.
//
// Sources for the constants:
// - W. Müller, "Physics of ski jumping", 2009: air density, and drag and
//   lift areas of about 0.25 m² in the in-run and 0.5 m² in flight.
// - Kuzmin and Fu, "The friction of ski on snow", 2012: mu 0.02 to 0.05.
// - FIS hill standards allow an equivalent landing height of about 0.7 m
//   (3.7 m/s normal speed). A normal speed above 6.5 m/s crashes here.

export const G = 9.81
export const AIR_DENSITY = 1.2
export const MASS = 65
// Drag and lift area (the force divided by dynamic pressure), in m².
const DRAG_AREA_INRUN = 0.25
const DRAG_AREA_FLIGHT = 0.55
const LIFT_AREA_FLIGHT = 0.45
const DRAG_AREA_CRASHED = 0.6
// A jumper counts as in flight after this long without contact. Short hops
// over small bumps get no lift.
const FLIGHT_AFTER = 0.15
// A jump shorter than this is a hop or a drop, not a jump.
const MIN_JUMP_TIME = 0.4
const MIN_TAKEOFF_SPEED = 8
// Jumpers bump into each other as circles of this radius.
export const JUMPER_RADIUS = 0.9
const JUMPER_RESTITUTION = 0.3
const JUMPER_CRASH_SPEED = 5
// A jumper that stays at rest this long fades out, then goes away.
const REST_BEFORE_FADE = 3
const FADE_TIME = 1
export const MAX_JUMPERS = 200
// The jumper touches a surface as a circle of this radius around the feet:
// about half the width of a drawn line, so the skis sit on top of it.
const CONTACT_RADIUS = 0.15
// A jumper this close to a surface still counts as touching it.
const CONTACT_SKIN = 0.02
const GRID_CELL = 4

export type MaterialId =
    'snow' | 'ice' | 'grass' | 'rock' | 'rubber' | 'wood' | 'wall'

export type Material = {
    label: string
    friction: number
    restitution: number
    // A jumper that hits this material faster than this (normal to the
    // surface, in m/s) crashes.
    crashSpeed: number
}

export const MATERIALS: Record<MaterialId, Material> = {
    snow: { label: 'Snow', friction: 0.04, restitution: 0, crashSpeed: 6.5 },
    ice: { label: 'Ice', friction: 0.01, restitution: 0, crashSpeed: 6.5 },
    grass: { label: 'Grass', friction: 0.35, restitution: 0, crashSpeed: 6.5 },
    rock: { label: 'Rock', friction: 0.6, restitution: 0.25, crashSpeed: 2 },
    rubber: {
        label: 'Bumper',
        friction: 0.5,
        restitution: 0.8,
        crashSpeed: Infinity,
    },
    wood: { label: 'Box', friction: 0.3, restitution: 0.3, crashSpeed: 4 },
    // The edges of the world. Every jumper that reaches one crashes.
    wall: { label: 'Wall', friction: 0.5, restitution: 0.2, crashSpeed: 0 },
}

// A crashed jumper slides on its body, not on its skis.
const BODY_FRICTION = 0.4

export type Point = { x: number; y: number }

export type Segment = {
    id: number
    a: Point
    b: Point
    material: MaterialId
    // The world edges cannot be erased.
    fixed: boolean
    // The obstacle that the segment belongs to, if any.
    obstacle?: number
}

export type ObstacleKind = 'rock' | 'bumper' | 'box'

export type Obstacle = {
    id: number
    kind: ObstacleKind
    points: Point[]
    segments: number[]
}

export type Jumper = {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    crashed: boolean
    // Seconds since the last contact with a surface.
    airTime: number
    // The tangent of the last surface, for drawing.
    tangent: Point
    // 1 faces right, -1 faces left.
    facing: 1 | -1
    // The angle of the skis in the facing frame, and the tumble spin after a
    // crash. Both only change the drawing.
    pitch: number
    spin: number
    restTime: number
    // 1 is visible, 0 is gone.
    opacity: number
    // An index into the toy colors: red, blue or yellow.
    color: number
    takeoff: { x: number; y: number; speed: number } | null
    lastContact: { x: number; y: number; speed: number }
}

export type JumpResult = { distance: number; speed: number; crashed: boolean }

export class World {
    readonly width: number
    readonly height: number
    segments = new Map<number, Segment>()
    obstacles = new Map<number, Obstacle>()
    jumpers: Jumper[] = []
    onJump: (result: JumpResult) => void = () => {}
    private nextId = 1
    private grid = new Map<number, Segment[]>()
    private gridDirty = true

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        const top = height * 4
        this.addSegment({ x: 0, y: 0 }, { x: width, y: 0 }, 'snow', true)
        this.addSegment({ x: 0, y: 0 }, { x: 0, y: top }, 'wall', true)
        this.addSegment({ x: width, y: 0 }, { x: width, y: top }, 'wall', true)
    }

    private addSegment(
        a: Point,
        b: Point,
        material: MaterialId,
        fixed = false,
        obstacle?: number
    ): number {
        const id = this.nextId++
        this.segments.set(id, { id, a, b, material, fixed, obstacle })
        this.gridDirty = true
        return id
    }

    // Adds a hand-drawn line. It resamples the points to an even spacing and
    // smooths them, so that a shaky hand does not make bumps.
    addStroke(points: Point[], material: MaterialId) {
        const smooth = smoothStroke(points)
        for (let i = 1; i < smooth.length; i++)
            this.addSegment(smooth[i - 1], smooth[i], material)
    }

    addObstacle(kind: ObstacleKind, at: Point) {
        const id = this.nextId++
        const points = obstacleShape(kind, at)
        const material: MaterialId =
            kind === 'rock' ? 'rock' : kind === 'bumper' ? 'rubber' : 'wood'
        const segments = points.map((p, i) =>
            this.addSegment(
                p,
                points[(i + 1) % points.length],
                material,
                false,
                id
            )
        )
        this.obstacles.set(id, { id, kind, points, segments })
    }

    // Removes every segment that comes nearer to `at` than `radius`.
    erase(at: Point, radius: number) {
        for (const segment of this.segments.values()) {
            if (segment.fixed) continue
            if (distanceToSegment(at, segment.a, segment.b) > radius) continue
            this.segments.delete(segment.id)
            this.gridDirty = true
            if (segment.obstacle !== undefined) {
                const obstacle = this.obstacles.get(segment.obstacle)
                if (obstacle)
                    obstacle.segments = obstacle.segments.filter(
                        (s) => s !== segment.id
                    )
                if (obstacle && obstacle.segments.length === 0)
                    this.obstacles.delete(obstacle.id)
            }
        }
    }

    clearSlope() {
        for (const segment of this.segments.values())
            if (!segment.fixed) this.segments.delete(segment.id)
        this.obstacles.clear()
        this.gridDirty = true
    }

    addJumper(at: Point, velocity: Point = { x: 0, y: 0 }): Jumper {
        const jumper: Jumper = {
            id: this.nextId++,
            x: at.x,
            y: at.y,
            vx: velocity.x,
            vy: velocity.y,
            crashed: false,
            airTime: 0,
            tangent: { x: 1, y: 0 },
            facing: velocity.x < 0 ? -1 : 1,
            pitch: 0,
            spin: 0,
            restTime: 0,
            opacity: 1,
            color: Math.floor(Math.random() * 3),
            takeoff: null,
            lastContact: { x: at.x, y: at.y, speed: 0 },
        }
        this.jumpers.push(jumper)
        if (this.jumpers.length > MAX_JUMPERS) this.jumpers.shift()
        return jumper
    }

    step(dt: number) {
        if (this.gridDirty) this.rebuildGrid()
        for (const jumper of this.jumpers) this.stepJumper(jumper, dt)
        this.collideJumpers()
        this.jumpers = this.jumpers.filter((j) => j.opacity > 0)
    }

    private stepJumper(j: Jumper, dt: number) {
        const speed = Math.hypot(j.vx, j.vy)
        const flying = !j.crashed && j.airTime > FLIGHT_AFTER

        // Air drag: F = ½ ρ (C_D A) v², against the velocity.
        const dragArea = j.crashed
            ? DRAG_AREA_CRASHED
            : flying
              ? DRAG_AREA_FLIGHT
              : DRAG_AREA_INRUN
        const drag = (0.5 * AIR_DENSITY * dragArea * speed) / MASS
        let ax = -drag * j.vx
        let ay = -G - drag * j.vy

        // Lift: F = ½ ρ (C_L A) v², at right angles to the velocity and to
        // the upper side. A jumper who falls steeply stalls, so the lift
        // scales with the cosine of the flight path angle.
        if (flying && speed > 0) {
            const lift = (0.5 * AIR_DENSITY * LIFT_AREA_FLIGHT * speed) / MASS
            const side = j.vx >= 0 ? 1 : -1
            const stall = Math.abs(j.vx) / speed
            ax += -j.vy * side * lift * stall
            ay += j.vx * side * lift * stall
        }

        j.vx += ax * dt
        j.vy += ay * dt

        // Each move is shorter than half the contact radius, so the jumper
        // cannot pass through a line between two checks.
        const moves = Math.max(
            1,
            Math.ceil((Math.hypot(j.vx, j.vy) * dt) / (CONTACT_RADIUS / 2))
        )
        let touched = false
        for (let m = 0; m < moves; m++) {
            j.x += (j.vx * dt) / moves
            j.y += (j.vy * dt) / moves
            if (this.pushOut(j)) touched = true
        }

        if (touched) {
            if (j.takeoff && j.airTime >= MIN_JUMP_TIME) {
                this.onJump({
                    distance: Math.hypot(j.x - j.takeoff.x, j.y - j.takeoff.y),
                    speed: j.takeoff.speed,
                    crashed: j.crashed,
                })
            }
            j.takeoff = null
            j.airTime = 0
            j.lastContact = { x: j.x, y: j.y, speed: Math.hypot(j.vx, j.vy) }
        } else {
            j.airTime += dt
            if (
                !j.takeoff &&
                !j.crashed &&
                j.airTime > FLIGHT_AFTER &&
                j.lastContact.speed >= MIN_TAKEOFF_SPEED
            )
                j.takeoff = { ...j.lastContact }
        }

        this.updatePose(j, dt)

        const resting = j.airTime === 0 && Math.hypot(j.vx, j.vy) < 0.1
        j.restTime = resting ? j.restTime + dt : 0
        if (j.restTime > REST_BEFORE_FADE) j.opacity -= dt / FADE_TIME
    }

    // Pushes the jumper out of every segment nearer than the contact
    // radius, along the line from the nearest point on the segment. The
    // nearest point can be an end, so a joint between two segments pushes
    // the right way too.
    private pushOut(j: Jumper): boolean {
        let touched = false
        for (let pass = 0; pass < 2; pass++) {
            let moved = false
            for (const segment of this.near(j.x, j.y)) {
                const c = closestPoint(j, segment.a, segment.b)
                const dx = j.x - c.x
                const dy = j.y - c.y
                const distance = Math.hypot(dx, dy)
                if (distance >= CONTACT_RADIUS + CONTACT_SKIN) continue
                touched = true
                if (distance >= CONTACT_RADIUS || distance < 1e-9) continue
                const nx = dx / distance
                const ny = dy / distance
                j.x = c.x + nx * CONTACT_RADIUS
                j.y = c.y + ny * CONTACT_RADIUS
                this.resolveContact(j, nx, ny, segment)
                moved = true
            }
            if (!moved) break
        }
        return touched
    }

    private resolveContact(
        j: Jumper,
        nx: number,
        ny: number,
        segment: Segment
    ) {
        const material = MATERIALS[segment.material]
        const vn = j.vx * nx + j.vy * ny
        if (vn >= 0) return
        const impact = -vn

        if (!j.crashed && impact > material.crashSpeed) this.crash(j)

        // Slow contacts do not bounce, so that a jumper at rest stays at rest.
        const restitution = impact > 1 ? material.restitution : 0
        const friction = j.crashed
            ? Math.max(material.friction, BODY_FRICTION)
            : material.friction

        const tx = j.vx - vn * nx
        const ty = j.vy - vn * ny
        const tangentSpeed = Math.hypot(tx, ty)
        const frictionLoss = friction * (1 + restitution) * impact
        const keep =
            tangentSpeed > frictionLoss ? 1 - frictionLoss / tangentSpeed : 0
        j.vx = tx * keep - restitution * vn * nx
        j.vy = ty * keep - restitution * vn * ny

        j.tangent = { x: ny, y: -nx }
        if (j.crashed) j.spin *= 0.9
    }

    private crash(j: Jumper) {
        j.crashed = true
        const speed = Math.hypot(j.vx, j.vy)
        j.spin = (Math.random() < 0.5 ? -1 : 1) * Math.min(12, 1 + speed * 0.4)
    }

    private updatePose(j: Jumper, dt: number) {
        if (Math.abs(j.vx) > 0.3) j.facing = j.vx > 0 ? 1 : -1
        if (j.crashed) {
            j.pitch += j.spin * dt
            return
        }
        let target: number
        if (j.airTime > FLIGHT_AFTER) {
            // In flight the skis point a little above the flight path.
            target = Math.atan2(j.vy, Math.abs(j.vx)) + 0.3
        } else {
            const t =
                j.tangent.x * j.facing >= 0
                    ? j.tangent
                    : { x: -j.tangent.x, y: -j.tangent.y }
            target = Math.atan2(t.y, Math.abs(t.x))
        }
        j.pitch += (target - j.pitch) * Math.min(1, dt * 12)
    }

    // Jumpers bump as circles centred a little above the feet. Only the
    // velocities change, so that no jumper is pushed through the slope.
    private collideJumpers() {
        const list = this.jumpers
        const reach = 2 * JUMPER_RADIUS
        for (let a = 0; a < list.length; a++) {
            const p = list[a]
            for (let b = a + 1; b < list.length; b++) {
                const q = list[b]
                const dx = q.x - p.x
                const dy = q.y - p.y
                if (Math.abs(dx) > reach || Math.abs(dy) > reach) continue
                const distance = Math.hypot(dx, dy)
                if (distance >= reach || distance === 0) continue
                const nx = dx / distance
                const ny = dy / distance
                const closing = (p.vx - q.vx) * nx + (p.vy - q.vy) * ny
                if (closing <= 0) continue
                // Equal masses: each takes half of the momentum change.
                const impulse = ((1 + JUMPER_RESTITUTION) * closing) / 2
                p.vx -= impulse * nx
                p.vy -= impulse * ny
                q.vx += impulse * nx
                q.vy += impulse * ny
                if (closing > JUMPER_CRASH_SPEED) {
                    if (!p.crashed) this.crash(p)
                    if (!q.crashed) this.crash(q)
                }
            }
        }
    }

    private rebuildGrid() {
        this.grid.clear()
        for (const segment of this.segments.values()) {
            const [x0, x1] = cellRange(segment.a.x, segment.b.x)
            const [y0, y1] = cellRange(segment.a.y, segment.b.y)
            for (let cx = x0; cx <= x1; cx++)
                for (let cy = y0; cy <= y1; cy++) {
                    const key = cellKey(cx, cy)
                    const cell = this.grid.get(key)
                    if (cell) cell.push(segment)
                    else this.grid.set(key, [segment])
                }
        }
        this.gridDirty = false
    }

    // The segments in the grid cells around (x, y).
    private near(x: number, y: number): Segment[] {
        const [x0, x1] = cellRange(x, x)
        const [y0, y1] = cellRange(y, y)
        if (x0 === x1 && y0 === y1) return this.grid.get(cellKey(x0, y0)) ?? []
        const found = new Set<Segment>()
        for (let cx = x0; cx <= x1; cx++)
            for (let cy = y0; cy <= y1; cy++)
                for (const segment of this.grid.get(cellKey(cx, cy)) ?? [])
                    found.add(segment)
        return [...found]
    }
}

function closestPoint(p: Point, a: Point, b: Point): Point {
    const sx = b.x - a.x
    const sy = b.y - a.y
    const lengthSq = sx * sx + sy * sy
    const t =
        lengthSq === 0
            ? 0
            : Math.max(
                  0,
                  Math.min(1, ((p.x - a.x) * sx + (p.y - a.y) * sy) / lengthSq)
              )
    return { x: a.x + t * sx, y: a.y + t * sy }
}

function cellRange(a: number, b: number): [number, number] {
    const pad = 0.5
    return [
        Math.floor((Math.min(a, b) - pad) / GRID_CELL),
        Math.floor((Math.max(a, b) + pad) / GRID_CELL),
    ]
}

function cellKey(cx: number, cy: number): number {
    return (cx + 1000) * 4096 + (cy + 1000)
}

export function distanceToSegment(p: Point, a: Point, b: Point): number {
    const c = closestPoint(p, a, b)
    return Math.hypot(p.x - c.x, p.y - c.y)
}

const STROKE_SPACING = 0.75

export function smoothStroke(points: Point[]): Point[] {
    if (points.length < 2) return []
    // Resample at an even spacing along the line.
    const even: Point[] = [points[0]]
    let carry = 0
    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const length = Math.hypot(b.x - a.x, b.y - a.y)
        let at = STROKE_SPACING - carry
        while (at <= length) {
            even.push({
                x: a.x + ((b.x - a.x) * at) / length,
                y: a.y + ((b.y - a.y) * at) / length,
            })
            at += STROKE_SPACING
        }
        carry = length - (at - STROKE_SPACING)
    }
    const last = points[points.length - 1]
    const tail = even[even.length - 1]
    if (Math.hypot(last.x - tail.x, last.y - tail.y) > STROKE_SPACING / 4)
        even.push(last)
    if (even.length < 2) return []

    // Two passes of a [¼ ½ ¼] filter. The ends stay where they are.
    let smooth = even
    for (let pass = 0; pass < 2; pass++) {
        smooth = smooth.map((p, i) =>
            i === 0 || i === smooth.length - 1
                ? p
                : {
                      x: (smooth[i - 1].x + 2 * p.x + smooth[i + 1].x) / 4,
                      y: (smooth[i - 1].y + 2 * p.y + smooth[i + 1].y) / 4,
                  }
        )
    }
    return smooth
}

function obstacleShape(kind: ObstacleKind, at: Point): Point[] {
    if (kind === 'box') {
        const h = 1
        return [
            { x: at.x - h, y: at.y - h },
            { x: at.x + h, y: at.y - h },
            { x: at.x + h, y: at.y + h },
            { x: at.x - h, y: at.y + h },
        ]
    }
    const corners = kind === 'rock' ? 8 : 20
    const points: Point[] = []
    for (let i = 0; i < corners; i++) {
        const angle = (i / corners) * Math.PI * 2
        const radius = kind === 'rock' ? 1.1 + Math.random() * 0.5 : 1.2
        points.push({
            x: at.x + Math.cos(angle) * radius,
            y: at.y + Math.sin(angle) * radius,
        })
    }
    return points
}

// A normal-hill profile: an in-run at 35°, a take-off table at 11°, and a
// landing hill that curves to 36° and back out to a 3° out-run. The out-run
// is steeper than the friction angle of snow, so every jumper reaches the
// right edge.
export function defaultHill(): { inrun: Point[]; landing: Point[] } {
    function trace(start: Point, parts: [number, number, number][]): Point[] {
        // Each part: length in m, start angle and end angle in degrees below
        // the horizontal. The angle changes linearly along the part.
        const points = [start]
        let { x, y } = start
        for (const [length, from, to] of parts) {
            const steps = Math.ceil(length / 0.5)
            for (let s = 1; s <= steps; s++) {
                const angle =
                    ((from + ((to - from) * (s - 0.5)) / steps) * Math.PI) / 180
                x += (Math.cos(angle) * length) / steps
                y -= (Math.sin(angle) * length) / steps
                points.push({ x, y })
            }
        }
        return points
    }
    const inrun = trace({ x: 3, y: 55 }, [
        [32, 35, 35],
        [10, 35, 11],
        [6, 11, 11],
    ])
    const lip = inrun[inrun.length - 1]
    const landing = trace({ x: lip.x + 0.5, y: lip.y - 2 }, [
        [10, 12, 33],
        [28, 33, 33],
        [18, 33, 3],
        [40, 3, 3],
    ]).filter((p) => p.x < 100)
    // End the out-run on the right edge, so that no jumper falls behind it.
    const end = landing[landing.length - 1]
    landing.push({
        x: 100,
        y: end.y - (100 - end.x) * Math.tan((3 * Math.PI) / 180),
    })
    return { inrun, landing }
}
