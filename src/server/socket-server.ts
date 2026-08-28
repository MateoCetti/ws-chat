import type { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from '../types/chat'
import { createUserStore } from './user-store'
import { registerChatHandlers } from './chat-events'

// Attaches Socket.io to an existing HTTP server. When a browser opens a
// WebSocket, Socket.io intercepts it before the request reaches Next.js —
// both coexist on the same port.
export function attachSocketServer(httpServer: HTTPServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: '*' },
  })

  const users = createUserStore()

  // 'connection' fires every time a new browser tab opens a WebSocket
  io.on('connection', (socket) => {
    registerChatHandlers(io, socket, users)
  })

  return io
}
