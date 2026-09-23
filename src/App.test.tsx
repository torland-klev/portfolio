import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { projects } from './components/pages/items'

function renderAt(path: string) {
    render(
        <MemoryRouter initialEntries={[path]}>
            <App />
        </MemoryRouter>
    )
}

test('renders the navigation', () => {
    renderAt('/')
    for (const page of ['about', 'blog', 'portfolio', 'contact'])
        expect(screen.getByRole('link', { name: page })).toBeInTheDocument()
})

test('renders a card for every project', async () => {
    renderAt('/portfolio')
    expect(
        await screen.findByRole('heading', { name: 'Portfolio' })
    ).toBeInTheDocument()
    for (const project of projects)
        expect(screen.getByText(project.project)).toBeInTheDocument()
})

test('shows every validation error when the contact form is empty', async () => {
    renderAt('/contact')
    ;(await screen.findByRole('button', { name: 'Send' })).click()
    expect(
        await screen.findByText('Missing name, missing email, missing message')
    ).toBeInTheDocument()
})

test('opens a blog post on its own page', async () => {
    renderAt('/blog/lucky-stabs')
    expect(
        await screen.findByRole('heading', {
            level: 1,
            name: 'Lucky stabs and the average person',
        })
    ).toBeInTheDocument()
    expect(document.title).toBe(
        'Lucky stabs and the average person · Henrik Klev'
    )
})

test('sends unknown blog posts back to the list', async () => {
    renderAt('/blog/does-not-exist')
    expect(
        await screen.findByRole('link', { name: 'Reading between the dots' })
    ).toBeInTheDocument()
})

test('toggles and remembers the theme', () => {
    renderAt('/')
    const toggle = screen.getByRole('button', {
        name: /Switch to (dark|light) mode/,
    })
    const before = document.documentElement.dataset.theme ?? 'light'
    toggle.click()
    const after = document.documentElement.dataset.theme
    expect(after).not.toBe(before)
    expect(localStorage.getItem('theme')).toBe(after)
})
