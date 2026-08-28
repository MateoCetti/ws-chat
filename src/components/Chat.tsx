'use client'

// 'use client' marks this as a Client Component — it runs in the browser.
// All WebSocket code must live in Client Components; Server Components
// only render on the server and never open a WebSocket.

import { useState } from 'react'
import { useChatSocket } from '@/hooks/useChatSocket'
import JoinForm from './JoinForm'
import MessageList from './MessageList'
import UserList from './UserList'
import MessageInput from './MessageInput'

export default function Chat() {
  const [username, setUsername] = useState('')
  const [joined, setJoined] = useState(false)
  const [isUserListOpen, setIsUserListOpen] = useState(false)
  const { currentUserId, messages, users, sendMessage } = useChatSocket(username, joined)

  function handleJoin(name: string) {
    setUsername(name)
    setJoined(true)
  }

  if (!joined) {
    return <JoinForm onJoin={handleJoin} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <UserList
        users={users}
        currentUserId={currentUserId}
        isOpen={isUserListOpen}
        onClose={() => setIsUserListOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              Chat Room
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as <span className="font-medium text-gray-700 dark:text-gray-300">{username}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUserListOpen(true)}
            aria-label={`Show online users, ${users.length} online`}
            className="md:hidden flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium">{users.length}</span>
          </button>
        </header>
        <MessageList messages={messages} currentUserId={currentUserId} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}
