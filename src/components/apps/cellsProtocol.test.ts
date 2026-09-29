import { parseSet } from './cellsProtocol'

test('accepts a valid cell change', () => {
    expect(parseSet('{"i":9999,"v":1}')).toEqual({ i: 9999, v: 1 })
    expect(parseSet('{"i":0,"v":0}')).toEqual({ i: 0, v: 0 })
})

test('rejects bad cell changes', () => {
    for (const message of [
        '{"i":10000,"v":1}',
        '{"i":-1,"v":1}',
        '{"i":1.5,"v":1}',
        '{"i":1,"v":2}',
        '{"i":"1","v":1}',
        '{"online":3}',
        'not json',
        'null',
        new ArrayBuffer(4),
    ])
        expect(parseSet(message)).toBeNull()
})
