import type { Server, Socket } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents, Message } from '../types/chat'
import type { UserStore } from './user-store'

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>

// Wires up all chat events for a single connected socket.
export function registerChatHandlers(io: AppServer, socket: AppSocket, users: UserStore) {
  // Client tells us their chosen username
  socket.on('user:join', (username) => {
    const user = users.add(socket.id, username)

    // socket.emit → only to this socket: send the current list so they see who's online
    socket.emit('users:list', users.list())
    // socket.broadcast.emit → everyone except this socket: announce the new arrival
    socket.broadcast.emit('user:joined', user)

    console.log(`[join] ${username} (${socket.id})`)
  })

  // Client sends a chat message
  socket.on('message:send', (text) => {
    const user = users.get(socket.id)
    if (!user) return // Ignore if they somehow messaged before joining

    const message: Message = {
      id: crypto.randomUUID(),
      userId: socket.id,
      username: user.username,
      text,
      timestamp: Date.now(),
      type: 'message',
    }

    // io.emit → everyone, including the sender, so it flows through one code path
    io.emit('message:received', message)
  })

  // Fires when the browser tab closes or the connection drops
  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (!user) return

    // Use io.emit (not socket.broadcast) — this socket is already gone
    io.emit('user:left', user)
    console.log(`[leave] ${user.username} (${socket.id})`)
  })
}
