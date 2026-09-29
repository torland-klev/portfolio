import { act, fireEvent, render, screen } from '@testing-library/react'
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

test('renders a chart that a post embeds in its body', async () => {
    renderAt('/blog/knocking-down-the-house')
    const chart = await screen.findByAltText(/^Bar chart of where 2,324/)
    // Vite inlines this SVG, so the src is a data URL that react-markdown
    // would otherwise strip.
    expect(chart).toHaveAttribute('src', expect.stringMatching(/^data:image\//))
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

test('opens an app post and shows the shared grid', async () => {
    class FakeSocket {
        static OPEN = 1
        static last: FakeSocket
        readyState = FakeSocket.OPEN
        binaryType = ''
        sent: string[] = []
        onopen = () => {}
        onmessage: (event: { data: unknown }) => void = () => {}
        onclose = () => {}
        constructor() {
            FakeSocket.last = this
        }
        send(message: string) {
            this.sent.push(message)
        }
        close() {}
    }
    vi.stubGlobal('WebSocket', FakeSocket)
    // jsdom has no canvas drawing.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    renderAt('/blog/cells')
    expect(
        await screen.findByRole('heading', { level: 1, name: 'Cells' })
    ).toBeInTheDocument()
    expect(await screen.findByText('Connecting…')).toBeInTheDocument()

    // The server sends the full grid first: here, cells 0 and 9 on.
    const grid = new Uint8Array(10_000 / 8)
    grid[0] = 0b1
    grid[1] = 0b10
    act(() => FakeSocket.last.onmessage({ data: grid.buffer }))
    act(() => FakeSocket.last.onmessage({ data: '{"online":3}' }))
    expect(screen.getByText('Live · 3 people here')).toBeInTheDocument()
    expect(
        screen.getByText(`2/${(10_000).toLocaleString()}`)
    ).toBeInTheDocument()

    // Another visitor switches cell 5 on.
    act(() => FakeSocket.last.onmessage({ data: '{"i":5,"v":1}' }))
    expect(
        screen.getByText(`3/${(10_000).toLocaleString()}`)
    ).toBeInTheDocument()

    // Space on the focused grid switches the cell under the cursor (cell 0).
    const canvas = screen.getByLabelText(/^Shared grid of 100 by 100 cells/)
    fireEvent.keyDown(canvas, { key: ' ' })
    expect(FakeSocket.last.sent).toEqual(['{"i":0,"v":0}'])
    expect(
        screen.getByText(`2/${(10_000).toLocaleString()}`)
    ).toBeInTheDocument()

    vi.unstubAllGlobals()
})

test('labels app posts in the blog list', async () => {
    renderAt('/blog')
    expect(
        await screen.findByRole('link', { name: 'Cells' })
    ).toBeInTheDocument()
    expect(screen.getAllByText('Interactive')).toHaveLength(2)
})

test('opens the ski jumper app', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    renderAt('/blog/ski-jumper')
    expect(
        await screen.findByRole('heading', { level: 1, name: 'Ski jumper' })
    ).toBeInTheDocument()
    const ice = await screen.findByRole('button', { name: 'Draw ice' })
    fireEvent.click(ice)
    expect(ice).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Jumper' })).toHaveAttribute(
        'aria-pressed',
        'false'
    )

    const gravity = screen.getByLabelText('Gravity')
    fireEvent.click(screen.getByRole('button', { name: 'Gravity: Moon' }))
    expect(gravity).toHaveValue('1.62')
    const air = screen.getByLabelText('Air density')
    fireEvent.click(screen.getByRole('button', { name: 'Air density: Vacuum' }))
    expect(air).toHaveValue('0')
    fireEvent.change(gravity, { target: { value: '20' } })
    expect(
        screen.getByText(
            `${(20).toLocaleString(undefined, { minimumFractionDigits: 2 })} m/s²`
        )
    ).toBeInTheDocument()
})
