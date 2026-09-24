import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// Pages load lazily, so give findBy* queries more time on a busy machine.
configure({ asyncUtilTimeout: 5000 })

window.scrollTo = () => {}

// jsdom has no matchMedia or ResizeObserver.
window.matchMedia ??= (query: string) =>
    ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }) as unknown as MediaQueryList

globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
}
