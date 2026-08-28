import Chat from '@/components/Chat'

// This is a Server Component — it only renders on the server and sends HTML to the browser.
// It doesn't do any WebSocket work itself. It just mounts the Chat client component,
// which takes over in the browser and opens the WebSocket connection.
export default function Page() {
  return <Chat />
}
