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

// Earth's standard gravity. Each world can change it.
export const G = 9.81
// Air density at sea level, in kg/m³. Each world can change it.
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
// A held jump charges to full in this time. The take-off speed goes from the
// low to the high value with the charge. The high value lands below the
// crash speed on snow.
const CHARGE_TIME = 1
const JUMP_SPEED_MIN = 2
const JUMP_SPEED_MAX = 6
// A jumper on the ground looks this far ahead for a steep face. It hops over
// a face up to the maximum height, and clears the top by the margin.
const HOP_LOOK_TIME = 1
const HOP_LOOK_MAX = 8
const HOP_MAX_HEIGHT = 3
const HOP_MARGIN = 0.4
const HOP_MIN_SPEED = 0.5
// A face steeper than this angle from the horizontal counts as steep.
const STEEP_SLOPE = (55 * Math.PI) / 180
// No new jump or hop comes this soon after the last one.
const JUMP_COOLDOWN = 0.25

export type MaterialId =
    | 'snow'
    | 'ice'
    | 'perfectIce'
    | 'grass'
    | 'rock'
    | 'rubber'
    | 'wood'
    | 'wall'

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
    // No friction at all. Air drag still slows the jumper.
    perfectIce: {
        label: 'Perfect ice',
        friction: 0,
        restitution: 0,
        crashSpeed: 6.5,
    },
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
    // The charge of a held jump, from 0 to 1. The drawing crouches with it.
    charge: number
    // Seconds since the last jump or hop.
    sinceJump: number
    lastContact: { x: number; y: number; speed: number }
}

export type JumpResult = { distance: number; speed: number; crashed: boolean }

export class World {
    readonly width: number
    readonly height: number
    segments = new Map<number, Segment>()
    obstacles = new Map<number, Obstacle>()
    jumpers: Jumper[] = []
    // The acceleration of gravity, in m/s².
    gravity = G
    // The air density, in kg/m³. Drag and lift both scale with it.
    airDensity = AIR_DENSITY
    // True while the player holds the jump key.
    charging = false
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

    // Removes every segment that comes nearer than `radius` to the eraser
    // path from `from` to `to`. A fast drag moves far between two pointer
    // events, so the path, not only its ends, must count.
    erase(from: Point, radius: number, to: Point = from) {
        for (const segment of this.segments.values()) {
            if (segment.fixed) continue
            if (segmentDistance(from, to, segment.a, segment.b) > radius)
                continue
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
            charge: 0,
            sinceJump: JUMP_COOLDOWN,
            lastContact: { x: at.x, y: at.y, speed: 0 },
        }
        this.jumpers.push(jumper)
        if (this.jumpers.length > MAX_JUMPERS) this.jumpers.shift()
        return jumper
    }

    startCharge() {
        this.charging = true
    }

    // Every jumper on the ground jumps with its charge. The others lose it.
    releaseCharge() {
        this.charging = false
        for (const j of this.jumpers) {
            if (!j.crashed && j.airTime <= FLIGHT_AFTER && j.charge > 0)
                this.jump(
                    j,
                    JUMP_SPEED_MIN +
                        (JUMP_SPEED_MAX - JUMP_SPEED_MIN) * j.charge
                )
            j.charge = 0
        }
    }

    // The jumper pushes off at right angles to the skis.
    private jump(j: Jumper, speed: number) {
        const up = j.tangent.x >= 0 ? 1 : -1
        j.vx += -j.tangent.y * up * speed
        j.vy += j.tangent.x * up * speed
        this.leaveGround(j)
    }

    // A jumper that leaves the ground on purpose is not in contact through
    // the skin on the next step.
    private leaveGround(j: Jumper) {
        j.airTime = Math.max(j.airTime, 1e-6)
        j.sinceJump = 0
    }

    step(dt: number) {
        if (this.gridDirty) this.rebuildGrid()
        for (const jumper of this.jumpers) this.stepJumper(jumper, dt)
        this.collideJumpers()
        this.jumpers = this.jumpers.filter((j) => j.opacity > 0)
    }

    private stepJumper(j: Jumper, dt: number) {
        j.sinceJump += dt
        if (j.crashed) j.charge = 0
        else if (this.charging)
            j.charge = Math.min(1, j.charge + dt / CHARGE_TIME)
        if (!j.crashed && j.airTime === 0 && j.sinceJump >= JUMP_COOLDOWN)
            this.hopOverFace(j)

        const speed = Math.hypot(j.vx, j.vy)
        const flying = !j.crashed && j.airTime > FLIGHT_AFTER

        // Air drag: F = ½ ρ (C_D A) v², against the velocity.
        const dragArea = j.crashed
            ? DRAG_AREA_CRASHED
            : flying
              ? DRAG_AREA_FLIGHT
              : DRAG_AREA_INRUN
        const drag = (0.5 * this.airDensity * dragArea * speed) / MASS
        let ax = -drag * j.vx
        let ay = -this.gravity - drag * j.vy

        // Lift: F = ½ ρ (C_L A) v², at right angles to the velocity and to
        // the upper side. A jumper who falls steeply stalls, so the lift
        // scales with the cosine of the flight path angle.
        if (flying && speed > 0) {
            const lift =
                (0.5 * this.airDensity * LIFT_AREA_FLIGHT * speed) / MASS
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
        // A real contact ends a flight. The skin only keeps a jumper that is
        // already on the ground in contact, so that a flight does not end
        // one step before the impact.
        const grounded = j.airTime === 0
        let touched = false
        for (let m = 0; m < moves; m++) {
            j.x += (j.vx * dt) / moves
            j.y += (j.vy * dt) / moves
            const contact = this.pushOut(j)
            if (contact === 'hit' || (contact === 'skin' && grounded))
                touched = true
        }

        if (touched) {
            if (j.takeoff && j.airTime >= MIN_JUMP_TIME * this.timeScale()) {
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
                j.lastContact.speed >= MIN_TAKEOFF_SPEED / this.timeScale()
            )
                j.takeoff = { ...j.lastContact }
        }

        this.updatePose(j, dt)

        const resting =
            j.airTime === 0 && j.charge === 0 && Math.hypot(j.vx, j.vy) < 0.1
        j.restTime = resting ? j.restTime + dt : 0
        if (j.restTime > REST_BEFORE_FADE) j.opacity -= dt / FADE_TIME
    }

    // Looks ahead along the ground for a steep face. If the jumper can clear
    // the face with a hop, and the face is near enough that the hop peaks
    // at it, the jumper hops straight up and keeps its speed forward.
    private hopOverFace(j: Jumper) {
        const ahead = Math.abs(j.vx)
        if (ahead < HOP_MIN_SPEED) return
        const dir = j.vx > 0 ? 1 : -1
        const g = Math.max(this.gravity, 0.1)
        const reach = Math.min(
            HOP_LOOK_MAX,
            ahead * HOP_LOOK_TIME + CONTACT_RADIUS
        )
        const probe = CONTACT_RADIUS * 2
        const segments = this.inBox(
            j.x,
            j.y,
            j.x + dir * (reach + probe),
            j.y + HOP_MAX_HEIGHT + HOP_MARGIN
        )

        // The nearest steep face at knee height.
        const knee = { x: j.x, y: j.y + probe }
        const face = firstHit(
            knee,
            { x: j.x + dir * reach, y: knee.y },
            segments,
            (s) =>
                !s.fixed &&
                Math.abs(s.b.y - s.a.y) >
                    Math.abs(s.b.x - s.a.x) * Math.tan(STEEP_SLOPE)
        )
        if (face === null) return

        // The lowest height at which the way past the face is clear.
        const past = face + probe
        let height: number | null = null
        for (let h = probe * 2; h <= HOP_MAX_HEIGHT; h += 0.2) {
            const from = { x: j.x, y: j.y + h }
            const to = { x: j.x + dir * past, y: from.y }
            if (firstHit(from, to, segments, () => true) === null) {
                height = h
                break
            }
        }
        // A face that is too high gets a full hop when the jumper is at it.
        if (height === null && face > probe) return
        const lift = Math.sqrt(
            2 * g * ((height ?? HOP_MAX_HEIGHT) + HOP_MARGIN)
        )
        if (face > ahead * (lift / g) + CONTACT_RADIUS) return
        j.vy = Math.max(j.vy, 0) + lift
        this.leaveGround(j)
    }

    // The segments in the grid cells that cover the box.
    private inBox(x0: number, y0: number, x1: number, y1: number): Segment[] {
        const [cx0, cx1] = cellRange(x0, x1)
        const [cy0, cy1] = cellRange(y0, y1)
        const found = new Set<Segment>()
        for (let cx = cx0; cx <= cx1; cx++)
            for (let cy = cy0; cy <= cy1; cy++)
                for (const segment of this.grid.get(cellKey(cx, cy)) ?? [])
                    found.add(segment)
        return [...found]
    }

    // Pushes the jumper out of every segment nearer than the contact
    // radius, along the line from the nearest point on the segment. The
    // nearest point can be an end, so a joint between two segments pushes
    // the right way too.
    private pushOut(j: Jumper): 'hit' | 'skin' | null {
        let contact: 'hit' | 'skin' | null = null
        for (let pass = 0; pass < 2; pass++) {
            let moved = false
            for (const segment of this.near(j.x, j.y)) {
                const c = closestPoint(j, segment.a, segment.b)
                const dx = j.x - c.x
                const dy = j.y - c.y
                const distance = Math.hypot(dx, dy)
                if (distance >= CONTACT_RADIUS + CONTACT_SKIN) continue
                contact ??= 'skin'
                if (distance >= CONTACT_RADIUS || distance < 1e-9) continue
                contact = 'hit'
                const nx = dx / distance
                const ny = dy / distance
                j.x = c.x + nx * CONTACT_RADIUS
                j.y = c.y + ny * CONTACT_RADIUS
                this.resolveContact(j, nx, ny, segment)
                moved = true
            }
            if (!moved) break
        }
        return contact
    }

    // On the same hill, speeds scale with √g and times with 1/√g. The jump
    // limits above are for Earth, so they scale by this factor.
    private timeScale(): number {
        return Math.sqrt(G / Math.max(this.gravity, 0.1))
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
        const onGround = j.airTime <= FLIGHT_AFTER
        if (j.crashed) {
            j.pitch += j.spin * dt
            // On the ground, the fallen figure settles with its skis on the
            // slope, by the shortest turn.
            if (onGround) {
                const turn = slopePitch(j) - j.pitch
                j.pitch +=
                    Math.atan2(Math.sin(turn), Math.cos(turn)) *
                    Math.min(1, dt * 8)
            }
            return
        }
        let target: number
        let rate = 12
        if (!onGround) {
            // In flight the skis point a little above the flight path. The
            // air turns the figure, so a slow jumper keeps its pose, and a
            // jumper that falls straight down stays upright.
            const speed = Math.hypot(j.vx, j.vy)
            const sideways = speed > 0 ? Math.abs(j.vx) / speed : 0
            target = sideways * (Math.atan2(j.vy, Math.abs(j.vx)) + 0.3)
            rate *= Math.min(1, (speed / 15) ** 2)
        } else {
            target = slopePitch(j)
        }
        j.pitch += (target - j.pitch) * Math.min(1, dt * rate)
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

// The pitch that puts the skis flat on the last surface, in the facing frame.
function slopePitch(j: Jumper): number {
    const t =
        j.tangent.x * j.facing >= 0
            ? j.tangent
            : { x: -j.tangent.x, y: -j.tangent.y }
    return Math.atan2(t.y, Math.abs(t.x))
}

// The distance from `from` to the first crossing of the ray with a segment
// that passes the test, or null.
function firstHit(
    from: Point,
    to: Point,
    segments: Segment[],
    test: (s: Segment) => boolean
): number | null {
    const rx = to.x - from.x
    const ry = to.y - from.y
    let best: number | null = null
    for (const s of segments) {
        const sx = s.b.x - s.a.x
        const sy = s.b.y - s.a.y
        const denominator = rx * sy - ry * sx
        if (Math.abs(denominator) < 1e-12) continue
        const qx = s.a.x - from.x
        const qy = s.a.y - from.y
        const t = (qx * sy - qy * sx) / denominator
        const u = (qx * ry - qy * rx) / denominator
        if (t < 0 || t > 1 || u < 0 || u > 1 || !test(s)) continue
        const distance = t * Math.hypot(rx, ry)
        if (best === null || distance < best) best = distance
    }
    return best
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

function cross(o: Point, a: Point, b: Point): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}

// The shortest distance between segment pq and segment ab.
function segmentDistance(p: Point, q: Point, a: Point, b: Point): number {
    const d1 = cross(p, q, a)
    const d2 = cross(p, q, b)
    const d3 = cross(a, b, p)
    const d4 = cross(a, b, q)
    if (d1 * d2 < 0 && d3 * d4 < 0) return 0
    return Math.min(
        distanceToSegment(p, a, b),
        distanceToSegment(q, a, b),
        distanceToSegment(a, p, q),
        distanceToSegment(b, p, q)
    )
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
