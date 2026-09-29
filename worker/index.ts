import { DurableObject } from 'cloudflare:workers'
import { CELLS, parseSet } from '../src/components/apps/cellsProtocol'

interface Env {
    GRID: DurableObjectNamespace<Grid>
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const { pathname } = new URL(request.url)
        if (pathname === '/api/cells')
            return env.GRID.get(env.GRID.idFromName('main')).fetch(request)
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
