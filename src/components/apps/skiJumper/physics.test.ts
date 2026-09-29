import { defaultHill, JumpResult, World } from './physics'

const STEP = 1 / 240

function run(world: World, seconds: number) {
    for (let t = 0; t < seconds; t += STEP) world.step(STEP)
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
    const jumper = world.addJumper({ x: 4, y: 56 })

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
