import { io, type Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/chat'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

// Module-level variable — survives across React renders and re-mounts
let socket: AppSocket | null = null

export function getSocket(): AppSocket {
  if (!socket) {
    socket = io({
      // Don't connect automatically — we call socket.connect() manually
      // after the user enters a username. This avoids an anonymous connection.
      autoConnect: false,
    })
  }
  return socket
}
