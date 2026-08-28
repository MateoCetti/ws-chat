import { createServer } from 'http'
import next from 'next'
import { attachSocketServer } from './src/server/socket-server'

const dev = process.env.NODE_ENV !== 'production'
const port = Number(process.env.PORT) || 3000

// Initialize Next.js — this compiles pages, sets up HMR in dev, etc.
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // A standard Node.js HTTP server. Every browser request (pages, API
  // routes, assets) is forwarded to Next.js via `handle`.
  const httpServer = createServer((req, res) => {
    handle(req, res)
  })

  attachSocketServer(httpServer)

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} [${dev ? 'dev' : 'prod'}]`)
  })
})
