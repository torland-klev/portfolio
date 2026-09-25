import { act, render } from '@testing-library/react'
import TypedWords from './TypedWords'

// typewriter-effect (the library this replaced) ran its own timer loop and
// only stopped it in componentWillUnmount. Unmounting mid-animation - which
// is exactly what a route change does - could fire that stop() before the
// loop's own state was ready for it, throwing "... is not a function" from
// inside React's unmount pass. This test guards the property that made that
// possible: no timer must survive unmounting the component.
test('leaves no pending timer behind when unmounted mid-animation', () => {
    vi.useFakeTimers()
    try {
        const { unmount } = render(
            <TypedWords words={['curiosity.', 'rigor.']} />
        )

        // Run partway into the type/hold/delete cycle, same as a visitor
        // navigating away mid-animation rather than at a clean boundary.
        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(vi.getTimerCount()).toBeGreaterThan(0)

        unmount()

        expect(vi.getTimerCount()).toBe(0)
        // Advancing further must not run a stale callback against the
        // unmounted component.
        expect(() => {
            act(() => {
                vi.advanceTimersByTime(10_000)
            })
        }).not.toThrow()
    } finally {
        vi.useRealTimers()
    }
})
