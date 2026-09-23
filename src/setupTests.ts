import '@testing-library/jest-dom/vitest'

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
