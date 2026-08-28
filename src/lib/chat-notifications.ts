import type { Message } from '@/types/chat'

// Builds a client-side-only system message for join/leave events.
export function createNotification(text: string): Message {
  return {
    id: crypto.randomUUID(),
    userId: 'system',
    username: 'System',
    text,
    timestamp: Date.now(),
    type: 'notification',
  }
}
