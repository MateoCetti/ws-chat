'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/types/chat'

interface Props {
  messages: Message[]
  currentUserId: string
}

export default function MessageList({ messages, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the newest message whenever the messages array changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6 md:py-4 space-y-3">
      {messages.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
          No messages yet — say hi!
        </p>
      )}

      {messages.map((message) => {
        // System notifications (join/leave) render as a centered pill
        if (message.type === 'notification') {
          return (
            <div key={message.id} className="flex justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {message.text}
              </span>
            </div>
          )
        }

        const isOwn = message.userId === currentUserId

        return (
          <div key={message.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            {/* Show the sender's name above messages from others */}
            {!isOwn && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1 break-words">
                {message.username}
              </span>
            )}
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm break-words ${
                isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm rounded-bl-sm'
              }`}
            >
              {message.text}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 mx-1">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )
      })}

      {/* Invisible anchor — scrollIntoView targets this to stay at the bottom */}
      <div ref={bottomRef} />
    </div>
  )
}
