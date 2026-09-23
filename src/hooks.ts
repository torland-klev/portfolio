import { useEffect, useState, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const mql = window.matchMedia(query)
            mql.addEventListener('change', onChange)
            return () => mql.removeEventListener('change', onChange)
        },
        () => window.matchMedia(query).matches,
        () => false
    )
}

export function usePageTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} · Henrik Klev` : 'Henrik Klev'
    }, [title])
}

export type Theme = 'light' | 'dark'

function currentTheme(): Theme {
    const explicit = document.documentElement.dataset.theme
    if (explicit === 'light' || explicit === 'dark') return explicit
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

export function useTheme(): [Theme, () => void] {
    const [theme, setTheme] = useState<Theme>(currentTheme)

    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => setTheme(currentTheme())
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [])

    function toggle() {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        document.documentElement.dataset.theme = next
        try {
            localStorage.setItem('theme', next)
        } catch {
            // Storage can be blocked. The theme still applies for this visit.
        }
        setTheme(next)
    }

    return [theme, toggle]
}
