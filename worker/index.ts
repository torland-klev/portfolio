import { DurableObject } from 'cloudflare:workers'
import { CELLS, parseSet } from '../src/components/apps/cellsProtocol'
import { snapshotSvg } from './snapshot'

interface Env {
    GRID: DurableObjectNamespace<Grid>
}

// The blog card image. It can be this many seconds old.
const SNAPSHOT_MAX_AGE = 10

export default {
    async fetch(request: Request, env: Env, ctx): Promise<Response> {
        const { pathname } = new URL(request.url)
        const grid = env.GRID.get(env.GRID.idFromName('main'))
        if (pathname === '/api/cells') return grid.fetch(request)
        if (pathname === '/api/cells.svg' && request.method === 'GET') {
            // The edge cache stops a busy blog list from waking the grid on
            // every view. It works on the custom domain, not on workers.dev.
            const cache = caches.default
            const cached = await cache.match(request)
            if (cached) return cached
            const response = new Response(snapshotSvg(await grid.snapshot()), {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': `public, max-age=${SNAPSHOT_MAX_AGE}`,
                },
            })
            ctx.waitUntil(cache.put(request, response.clone()))
            return response
        }
        return new Response('Not found', { status: 404 })
    },
} satisfies ExportedHandler<Env>

// One instance holds the whole grid. It keeps one bit per cell in memory and
// in storage, and uses the WebSocket Hibernation API, so it sleeps when idle
// and keeps the sockets open.
export class Grid extends DurableObject<Env> {
    private cells = new Uint8Array(CELLS / 8)

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env)
        ctx.blockConcurrencyWhile(async () => {
            const saved =
                await ctx.storage.get<Uint8Array<ArrayBuffer>>('cells')
            if (saved) this.cells = saved
        })
    }

    async fetch(request: Request): Promise<Response> {
        if (request.headers.get('Upgrade') !== 'websocket')
            return new Response('Expected a WebSocket', { status: 426 })

        const [client, server] = Object.values(new WebSocketPair())
        this.ctx.acceptWebSocket(server)
        server.send(this.cells)
        this.broadcastOnline()
        return new Response(null, { status: 101, webSocket: client })
    }

    snapshot(): Uint8Array {
        return this.cells
    }

    async webSocketMessage(_ws: WebSocket, message: string | ArrayBuffer) {
        const set = parseSet(message)
        if (!set) return

        const byte = set.i >> 3
        const bit = 1 << (set.i & 7)
        if (Boolean(this.cells[byte] & bit) === Boolean(set.v)) return
        this.cells[byte] ^= bit

        // The output gate holds the broadcast until the write is durable.
        this.ctx.storage.put('cells', this.cells)
        this.broadcast(JSON.stringify(set))
    }

    async webSocketClose(ws: WebSocket) {
        this.broadcastOnline(ws)
    }

    async webSocketError(ws: WebSocket) {
        this.broadcastOnline(ws)
    }

    private broadcastOnline(leaving?: WebSocket) {
        const online = this.ctx.getWebSockets().filter((s) => s !== leaving)
        this.broadcast(JSON.stringify({ online: online.length }), leaving)
    }

    private broadcast(message: string, skip?: WebSocket) {
        for (const ws of this.ctx.getWebSockets()) {
            if (ws === skip) continue
            try {
                ws.send(message)
            } catch {
                // The socket closed while we looped. Its close handler runs next.
            }
        }
    }
}
