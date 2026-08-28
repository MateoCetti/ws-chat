import type { User } from '../types/chat'

// In-memory store: socket.id → User.
// Simple and fast. Cleared on server restart — no persistence needed for a chat demo.
export function createUserStore() {
  const users = new Map<string, User>()

  return {
    add(id: string, username: string): User {
      const user: User = { id, username }
      users.set(id, user)
      return user
    },
    remove(id: string): User | undefined {
      const user = users.get(id)
      if (user) users.delete(id)
      return user
    },
    get(id: string): User | undefined {
      return users.get(id)
    },
    list(): User[] {
      return Array.from(users.values())
    },
  }
}

export type UserStore = ReturnType<typeof createUserStore>
