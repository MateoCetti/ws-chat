# my-first-chat

A minimal real-time chat app built with **Next.js 16** (App Router) and **Socket.IO**, running on a custom Node.js server so a single port serves both the web app and the WebSocket connection.

## Features

- Real-time messaging with Socket.IO
- Live online-user list
- Join/leave system notifications
- Dark mode support (via Tailwind CSS v4)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick a username, and start chatting. Open a second browser tab (or window) to see messages sync in real time.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the custom server in development mode (with HMR) |
| `npm run build` | Build the app for production (`next build`) |
| `npm run start` | Run the custom server in production mode |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting output |

## Architecture

Next.js's built-in dev/production server doesn't support attaching a raw WebSocket server, so this project boots Next.js programmatically inside a custom [server.ts](server.ts) and attaches Socket.IO to the same underlying HTTP server. Both HTTP and WebSocket traffic share port `3000`.

```
src/
├── app/                  # Next.js App Router (pages, layout, global styles)
├── components/           # React components (Chat, JoinForm, MessageList, ...)
├── hooks/
│   └── useChatSocket.ts  # Client-side socket lifecycle + chat state
├── lib/
│   ├── socket.ts         # Singleton Socket.IO client instance
│   └── chat-notifications.ts
├── server/
│   ├── socket-server.ts  # Creates and attaches the Socket.IO server
│   ├── chat-events.ts    # Per-connection event handlers (join/message/disconnect)
│   └── user-store.ts     # In-memory map of connected users
└── types/
    └── chat.ts           # Shared types + typed client↔server event contracts
server.ts                 # Entry point: boots Next.js + HTTP server + Socket.IO
```

**Server side** (`src/server/`): `server.ts` only wires together the HTTP server, Next.js request handler, and Socket.IO — the actual event handling and user tracking live in their own modules so each piece stays small and independently testable.

**Client side** (`src/hooks/useChatSocket.ts`): all socket connection/listener logic lives in a single custom hook, keeping [Chat.tsx](src/components/Chat.tsx) focused on composing UI from state.

State is in-memory only — restarting the server clears connected users and message history. There is no database or persistence layer.

## Tech Stack

- [Next.js 16](https://nextjs.org/docs) (App Router)
- [React 19](https://react.dev)
- [Socket.IO](https://socket.io/docs/v4/) 4
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript

## Notes

- All source lives under `src/`; the `@/*` import alias maps to `src/*`.
- Components are Server Components by default — `'use client'` is added only where browser APIs or interactivity are needed (see [UserList.tsx](src/components/UserList.tsx) vs. [Chat.tsx](src/components/Chat.tsx)).
- This project targets Next.js 16, which has some breaking API changes from earlier versions — see `node_modules/next/dist/docs/` before introducing new Next.js APIs.
