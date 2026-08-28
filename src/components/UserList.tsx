'use client'

import { useEffect } from 'react'
import type { User } from '@/types/chat'

interface Props {
  users: User[]
  currentUserId: string
  isOpen: boolean
  onClose: () => void
}

// Inline sidebar at md+ (via the md: classes below); a slide-in drawer with
// a backdrop below md. Always mounted so the md: variants can take over
// without a conditional render.
export default function UserList({ users, currentUserId, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Online users"
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[80vw] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:z-auto md:w-56 md:max-w-none md:translate-x-0`}
      >
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Online — {users.length}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close user list"
            className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto py-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-2 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                {user.username}
                {user.id === currentUserId && (
                  <span className="text-gray-400 dark:text-gray-500 ml-1">(you)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
