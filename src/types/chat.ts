export interface User {
  id: string       // Assigned by Socket.io (the socket.id)
  username: string // Chosen by the user on the join screen
}

export interface Message {
  id: string
  userId: string
  username: string
  text: string
  timestamp: number          // Unix ms — used to display "HH:MM"
  type: 'message' | 'notification' // 'notification' = system events like joins/leaves
}

// Events the SERVER sends TO clients
// Read as: "when the server emits X, the client receives Y"
export interface ServerToClientEvents {
  'users:list': (users: User[]) => void           // Full user list, sent once on join
  'user:joined': (user: User) => void             // Sent to others when someone joins
  'user:left': (user: User) => void               // Sent to all when someone disconnects
  'message:received': (message: Message) => void // Sent to all on each new message
}

// Events CLIENTS send TO the server
export interface ClientToServerEvents {
  'user:join': (username: string) => void // Register with a username after connecting
  'message:send': (text: string) => void  // Send a chat message
}
