'use client'

import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'
import { createNotification } from '@/lib/chat-notifications'
import type { Message, User } from '@/types/chat'

// Owns the socket connection lifecycle and chat state for a joined user.
// `enabled` gates the connection so we never open a WebSocket before the
// user has picked a username.
export function useChatSocket(username: string, enabled: boolean) {
  const [currentUserId, setCurrentUserId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!enabled) return

    const socket = getSocket()

    // Named handlers so socket.off() can remove EXACTLY these listeners on cleanup.
    function onConnect() {
      setCurrentUserId(socket.id ?? '')
      socket.emit('user:join', username)
    }

    function onUsersList(list: User[]) {
      setUsers(list)
    }

    function onUserJoined(user: User) {
      setUsers((prev) => [...prev, user])
      setMessages((prev) => [...prev, createNotification(`${user.username} joined the chat`)])
    }

    function onUserLeft(user: User) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      setMessages((prev) => [...prev, createNotification(`${user.username} left the chat`)])
    }

    function onMessageReceived(message: Message) {
      setMessages((prev) => [...prev, message])
    }

    // Register listeners BEFORE connecting so we don't miss events that
    // fire immediately on connection.
    socket.on('connect', onConnect)
    socket.on('users:list', onUsersList)
    socket.on('user:joined', onUserJoined)
    socket.on('user:left', onUserLeft)
    socket.on('message:received', onMessageReceived)

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('users:list', onUsersList)
      socket.off('user:joined', onUserJoined)
      socket.off('user:left', onUserLeft)
      socket.off('message:received', onMessageReceived)
      socket.disconnect()
    }
  }, [enabled, username])

  function sendMessage(text: string) {
    getSocket().emit('message:send', text)
  }

  return { currentUserId, messages, users, sendMessage }
}
