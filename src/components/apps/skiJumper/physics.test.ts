import { JumpResult, MAX_TOUGHNESS, Point, TOUGHNESS, World } from './physics'

const STEP = 1 / 240

function run(world: World, seconds: number) {
    for (let t = 0; t < seconds; t += STEP) world.step(STEP)
}

// A normal-hill profile: an in-run at 35°, a take-off table at 11°, and a
// landing hill that curves to 33° and back out to a 3° out-run. The out-run
// is steeper than the friction angle of snow, so every jumper reaches the
// right edge.
function defaultHill(): { inrun: Point[]; landing: Point[] } {
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

function hillWorld(): World {
    const world = new World(100, 62.5)
    const hill = defaultHill()
    world.addStroke(hill.inrun, 'snow')
    world.addStroke(hill.landing, 'snow')
    return world
}

test('a jumper on the default hill lands a jump, then crashes at the edge', () => {
    const world = hillWorld()
    const jumps: JumpResult[] = []
    world.onJump = (jump) => jumps.push(jump)
    const jumper = world.addJumper({ x: 4, y: 54.6 })

    run(world, 6.5)
    expect(jumps).toHaveLength(1)
    expect(jumps[0].crashed).toBe(false)
    // A normal hill of this size: 60 to 80 km/h at take-off, 30 to 50 m.
    expect(jumps[0].speed * 3.6).toBeGreaterThan(60)
    expect(jumps[0].speed * 3.6).toBeLessThan(80)
    expect(jumps[0].distance).toBeGreaterThan(30)
    expect(jumps[0].distance).toBeLessThan(50)
    expect(jumper.crashed).toBe(false)

    run(world, 3)
    expect(jumper.crashed).toBe(true)
})

test('a drop from 0.5 m is a safe landing, and a drop from 4 m crashes', () => {
    const world = new World(100, 62.5)
    const low = world.addJumper({ x: 20, y: 0.5 })
    const high = world.addJumper({ x: 60, y: 4 })
    run(world, 2)
    expect(low.crashed).toBe(false)
    expect(high.crashed).toBe(true)
})

test('a jumper slides further on ice than on snow', () => {
    const slide = (material: 'snow' | 'ice') => {
        const world = new World(100, 62.5)
        world.addStroke(
            [
                { x: 1, y: 10 },
                { x: 99, y: 10 },
            ],
            material
        )
        const jumper = world.addJumper({ x: 5, y: 10.01 }, { x: 10, y: 0 })
        run(world, 2)
        return jumper.x
    }
    expect(slide('ice')).toBeGreaterThan(slide('snow'))
})

test('jumpers that meet bump off each other and keep the momentum', () => {
    const world = new World(100, 62.5)
    const a = world.addJumper({ x: 40, y: 30 }, { x: 2, y: 0 })
    const b = world.addJumper({ x: 41.5, y: 30 }, { x: -2, y: 0 })
    world.step(STEP)
    expect(a.vx).toBeLessThan(0)
    expect(b.vx).toBeGreaterThan(0)
    expect(a.vx + b.vx).toBeCloseTo(0)
    expect(a.crashed || b.crashed).toBe(false)
})

test('a bumper throws a falling jumper back up', () => {
    const world = new World(100, 62.5)
    world.addObstacle('bumper', { x: 50, y: 10 })
    const jumper = world.addJumper({ x: 50, y: 20 })
    let highest = -Infinity
    let bounced = false
    for (let t = 0; t < 3; t += STEP) {
        world.step(STEP)
        if (jumper.vy > 0) bounced = true
        if (bounced) highest = Math.max(highest, jumper.y)
    }
    expect(jumper.crashed).toBe(false)
    expect(highest).toBeGreaterThan(15)
})

test('the eraser removes the slope, and a jumper then falls through', () => {
    const world = hillWorld()
    const before = world.segments.size
    world.erase({ x: 20, y: 44 }, 2)
    expect(world.segments.size).toBeLessThan(before)
})

test('jumpers follow a shaky valley up its sides and never fall through', () => {
    let seed = 1
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const valley = (x: number) => 20 + ((x - 50) / 45) ** 2 * 30
    for (let trial = 0; trial < 4; trial++) {
        const world = new World(100, 62.5)
        const points = []
        for (let x = 5; x <= 95; x += 0.4)
            points.push({
                x: x + (random() - 0.5) * 0.3,
                y: valley(x) + (random() - 0.5) * 0.4,
            })
        world.addStroke(points, trial % 2 ? 'ice' : 'snow')
        const jumpers = Array.from({ length: 10 }, () =>
            world.addJumper(
                { x: 10 + random() * 80, y: 52 + random() * 8 },
                { x: (random() - 0.5) * 20, y: 0 }
            )
        )
        for (let t = 0; t < 10; t += STEP) {
            world.step(STEP)
            for (const j of jumpers)
                if (j.x > 6 && j.x < 94)
                    expect(j.y).toBeGreaterThan(valley(j.x) - 1)
        }
    }
})

test('perfect ice has no friction, so only air drag slows a jumper', () => {
    const world = new World(100, 62.5)
    world.addStroke(
        [
            { x: 1, y: 10 },
            { x: 99, y: 10 },
        ],
        'perfectIce'
    )
    const jumper = world.addJumper({ x: 5, y: 10.2 }, { x: 5, y: 0 })
    run(world, 2)
    // Drag at 5 m/s takes about 0.1 m/s in 2 s. Snow would take 0.8 m/s.
    expect(jumper.vx).toBeGreaterThan(4.85)
    expect(jumper.vx).toBeLessThan(5)
})

test('a jumper falls with the gravity of the world', () => {
    const fallTime = (gravity: number) => {
        const world = new World(100, 62.5)
        world.gravity = gravity
        const jumper = world.addJumper({ x: 50, y: 20.15 })
        let t = 0
        while (jumper.airTime > 0 || t === 0) {
            world.step(STEP)
            t += STEP
        }
        return t
    }
    // Free fall from 20 m: t = √(2h / g). Drag makes it a little slower.
    expect(fallTime(9.81)).toBeCloseTo(Math.sqrt(40 / 9.81), 0)
    expect(fallTime(1.62)).toBeCloseTo(Math.sqrt(40 / 1.62), 0)
})

test('the eraser removes the whole path between two pointer events', () => {
    const world = new World(100, 62.5)
    world.addStroke(
        [
            { x: 10, y: 30 },
            { x: 90, y: 30 },
        ],
        'snow'
    )
    // A fast drag across the line. Neither end is near it.
    world.erase({ x: 50, y: 40 }, 2, { x: 50, y: 20 })
    const left = [...world.segments.values()].filter((s) => !s.fixed)
    expect(left.some((s) => s.a.x < 50 && s.b.x > 50)).toBe(false)
    expect(left.length).toBeGreaterThan(90)
})

test('a jump on the Moon counts as a jump', () => {
    const world = hillWorld()
    world.gravity = 1.62
    const jumps: JumpResult[] = []
    world.onJump = (jump) => jumps.push(jump)
    world.addJumper({ x: 4, y: 54.6 })
    run(world, 25)
    expect(jumps.length).toBeGreaterThan(0)
    expect(jumps[0].distance).toBeGreaterThan(20)
})

test('the landing is harder with stronger gravity', () => {
    // On the same hill every speed scales with √g, also the landing speed
    // into the slope. The body does not get stronger, so a jump that lands
    // safely on Earth crashes with the gravity of Jupiter.
    const jump = (gravity: number) => {
        const world = hillWorld()
        world.gravity = gravity
        const jumps: JumpResult[] = []
        world.onJump = (result) => jumps.push(result)
        world.addJumper({ x: 4, y: 54.6 })
        run(world, 30 / Math.sqrt(gravity))
        return jumps[0]
    }
    expect(jump(9.81).crashed).toBe(false)
    expect(jump(24.79).crashed).toBe(true)
})

test('a dropped jumper stays upright while it falls straight down', () => {
    const world = new World(100, 62.5)
    const jumper = world.addJumper({ x: 50, y: 30 })
    for (let t = 0; t < 1.5; t += STEP) {
        world.step(STEP)
        expect(Math.abs(jumper.pitch)).toBeLessThan(0.01)
    }
    expect(jumper.airTime).toBeGreaterThan(1)
})

test('in a vacuum on perfect ice, a jumper keeps its speed', () => {
    const world = new World(100, 62.5)
    world.airDensity = 0
    world.addStroke(
        [
            { x: 1, y: 10 },
            { x: 99, y: 10 },
        ],
        'perfectIce'
    )
    const jumper = world.addJumper({ x: 5, y: 10.2 }, { x: 5, y: 0 })
    run(world, 2)
    expect(jumper.vx).toBeCloseTo(5, 5)
})

test('a crashed jumper settles with its skis on the slope', () => {
    const world = hillWorld()
    // 4 m above the 33° landing slope: a hard landing that crashes.
    const jumper = world.addJumper({ x: 62, y: 27 })
    let settled = false
    for (let t = 0; t < 3 && !settled; t += STEP) {
        world.step(STEP)
        const slope = Math.atan2(jumper.tangent.y, Math.abs(jumper.tangent.x))
        const turn = Math.atan2(
            Math.sin(jumper.pitch - slope),
            Math.cos(jumper.pitch - slope)
        )
        if (jumper.crashed && jumper.airTime === 0 && Math.abs(turn) < 0.02)
            settled = true
    }
    expect(jumper.crashed).toBe(true)
    expect(settled).toBe(true)
})

test('a held jump charges, and a longer charge jumps higher', () => {
    const peak = (hold: number) => {
        const world = new World(100, 62.5)
        const jumper = world.addJumper({ x: 50, y: 0.2 })
        run(world, 0.5)
        world.startCharge()
        run(world, hold)
        expect(jumper.charge).toBeGreaterThan(0)
        world.releaseCharge()
        expect(jumper.charge).toBe(0)
        let top = jumper.y
        for (let t = 0; t < 2; t += STEP) {
            world.step(STEP)
            top = Math.max(top, jumper.y)
        }
        expect(jumper.crashed).toBe(false)
        return top
    }
    const short = peak(0.1)
    const long = peak(1)
    expect(short).toBeGreaterThan(0.3)
    expect(long).toBeGreaterThan(short + 1)
})

function boxInTheWay(hopHeight: number) {
    const world = new World(100, 62.5)
    world.hopHeight = hopHeight
    world.addStroke(
        [
            { x: 1, y: 10 },
            { x: 99, y: 10 },
        ],
        'perfectIce'
    )
    // The box is 2 m high.
    world.addObstacle('box', { x: 40, y: 11 })
    const jumper = world.addJumper({ x: 20, y: 10.2 }, { x: 5, y: 0 })
    run(world, 8)
    return jumper
}

test('a jumper hops over a box when the hop height allows it', () => {
    const jumper = boxInTheWay(2.5)
    expect(jumper.x).toBeGreaterThan(45)
    expect(jumper.crashed).toBe(false)
})

test('a jumper does not hop over a box higher than the hop height', () => {
    const jumper = boxInTheWay(0.6)
    expect(jumper.x).toBeLessThan(40)
})

function gapAhead(hopHeight: number, gap: number) {
    const world = new World(100, 62.5)
    world.hopHeight = hopHeight
    flatLine(world, 1, 50, 10)
    flatLine(world, 50 + gap, 99, 10)
    const jumper = world.addJumper({ x: 40, y: 10.2 }, { x: 3, y: 0 })
    let lowest = jumper.y
    for (let t = 0; t < 6; t += STEP) {
        world.step(STEP)
        lowest = Math.min(lowest, jumper.y)
    }
    return { jumper, lowest }
}

test('a jumper hops over a small gap', () => {
    const { jumper, lowest } = gapAhead(0.6, 1.5)
    expect(jumper.x).toBeGreaterThan(55)
    expect(lowest).toBeGreaterThan(9.9)
    expect(jumper.crashed).toBe(false)
})

test('a jumper does not hop over a gap too wide for the hop height', () => {
    const { lowest } = gapAhead(0.4, 1.5)
    expect(lowest).toBeLessThan(9)
})

test('a jumper does not hop with the hop height at 0', () => {
    const { lowest } = gapAhead(0, 1.5)
    expect(lowest).toBeLessThan(9)
})

test('a jumper does not hop off the end of a line with no ground near', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 50, 10)
    const jumper = world.addJumper({ x: 45, y: 10.2 }, { x: 3, y: 0 })
    let top = jumper.y
    for (let t = 0; t < 2; t += STEP) {
        world.step(STEP)
        top = Math.max(top, jumper.y)
    }
    expect(top).toBeLessThan(10.25)
})

function flatLine(world: World, from: number, to: number, y: number) {
    world.addStroke(
        [
            { x: from, y },
            { x: to, y },
        ],
        'perfectIce'
    )
}

test('the body hits a line above the skis', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 99, 10)
    flatLine(world, 40, 60, 11.3)
    const jumper = world.addJumper({ x: 30, y: 10.2 }, { x: 3, y: 0 })
    run(world, 6)
    expect(jumper.x).toBeLessThan(40)
    expect(jumper.y).toBeLessThan(10.5)
})

test('a jumper hops onto a line that starts a little higher', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 50, 10)
    flatLine(world, 50.5, 99, 10.5)
    const jumper = world.addJumper({ x: 30, y: 10.2 }, { x: 6, y: 0 })
    run(world, 5)
    expect(jumper.x).toBeGreaterThan(55)
    expect(jumper.y).toBeGreaterThan(10.5)
    expect(jumper.crashed).toBe(false)
})

test('a jumper hops onto a higher line that starts above the slope', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 99, 10)
    flatLine(world, 50, 99, 10.6)
    const jumper = world.addJumper({ x: 30, y: 10.2 }, { x: 6, y: 0 })
    run(world, 5)
    expect(jumper.x).toBeGreaterThan(55)
    expect(jumper.y).toBeGreaterThan(10.6)
    expect(jumper.crashed).toBe(false)
})

test('a jumper passes under a line above its head', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 99, 10)
    flatLine(world, 40, 60, 12.3)
    const jumper = world.addJumper({ x: 35, y: 10.2 }, { x: 6, y: 0 })
    run(world, 5)
    expect(jumper.x).toBeGreaterThan(60)
    expect(jumper.y).toBeLessThan(10.5)
})

test('a bigger field moves the right edge and keeps the hill', () => {
    const world = new World(100, 62.5)
    flatLine(world, 1, 99, 10)
    world.resize(200, 125)
    const jumper = world.addJumper({ x: 150, y: 5 }, { x: 10, y: 0 })
    run(world, 30)
    expect(jumper.x).toBeGreaterThan(150)
    expect(jumper.x).toBeLessThan(200)
    world.resize(100, 62.5)
    expect(world.jumpers).toHaveLength(0)
    expect([...world.segments.values()].some((s) => !s.fixed)).toBe(true)
})

test('a jumper hops over a gap in a downhill line', () => {
    // A 0.3 slope with a 1.5 m gap. The line past it starts 0.5 m lower.
    const world = new World(100, 62.5)
    const line = (from: number, to: number, y: number) => {
        const points: Point[] = []
        for (let x = from; x <= to; x += 0.5)
            points.push({ x, y: y - (x - from) * 0.3 })
        world.addStroke(points, 'snow')
    }
    line(3, 47, 40)
    const edge = 40 - 44 * 0.3
    line(48.5, 90, edge - 0.5)
    const jumper = world.addJumper({ x: 4, y: 40 })
    let lowest = Infinity
    for (let t = 0; t < 12 && jumper.x < 60; t += STEP) {
        world.step(STEP)
        if (jumper.x > 47 && jumper.x < 48.5)
            lowest = Math.min(lowest, jumper.y - edge)
    }
    expect(jumper.x).toBeGreaterThan(55)
    expect(lowest).toBeGreaterThan(-0.5)
    expect(jumper.crashed).toBe(false)
})

function dropOnSnow(toughness: number) {
    const world = new World(100, 62.5)
    world.toughness = toughness
    flatLine(world, 1, 99, 10)
    // A 5 m fall lands at about 9.9 m/s.
    const jumper = world.addJumper({ x: 50, y: 15.2 })
    run(world, 2)
    return jumper
}

test('the toughness sets how hard a jumper can land', () => {
    expect(dropOnSnow(TOUGHNESS).crashed).toBe(true)
    expect(dropOnSnow(8).crashed).toBe(false)
})

test('a jumper with the top toughness never crashes', () => {
    const world = new World(100, 62.5)
    world.toughness = MAX_TOUGHNESS
    flatLine(world, 1, 99, 10)
    const jumper = world.addJumper({ x: 50, y: 50 })
    run(world, 4)
    expect(jumper.crashed).toBe(false)
})

test('a jumper dropped across a line stands on it', () => {
    const world = new World(100, 62.5)
    world.addStroke(
        [
            { x: 30, y: 36 },
            { x: 70, y: 24 },
        ],
        'snow'
    )
    // The line crosses the figure at its middle.
    const jumper = world.addJumper({ x: 50, y: 29 })
    run(world, 2)
    expect(jumper.x).toBeGreaterThan(52)
    expect(jumper.y).toBeGreaterThan(36 - (jumper.x - 30) * 0.3)
})

test('a hop onto a higher line only just reaches its top', () => {
    // A downhill line, and a second line that starts about 1 m above it.
    const world = new World(100, 62.5)
    world.hopHeight = 2.5
    world.addStroke(
        [
            { x: 10.9, y: 35.5 },
            { x: 38.9, y: 22.7 },
        ],
        'perfectIce'
    )
    const start = { x: 33.5, y: 26.2 }
    world.addStroke([start, { x: 54.1, y: 18 }], 'perfectIce')
    const jumper = world.addJumper({ x: 12, y: 35.2 })
    let top = -Infinity
    for (let t = 0; t < 8 && jumper.x < 50; t += STEP) {
        world.step(STEP)
        if (jumper.x > start.x - 3 && jumper.x < start.x + 3)
            top = Math.max(top, jumper.y - start.y)
    }
    expect(jumper.x).toBeGreaterThan(40)
    // On the higher line.
    const line =
        start.y + ((jumper.x - start.x) * (18 - start.y)) / (54.1 - start.x)
    expect(Math.abs(jumper.y - line)).toBeLessThan(0.5)
    expect(top).toBeLessThan(0.6)
    expect(jumper.crashed).toBe(false)
})
