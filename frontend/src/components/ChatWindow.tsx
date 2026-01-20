import ChatMessage from "./ChatMessage"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatWindow({
  messages,
  loading,
}: {
  messages: Message[]
  loading: boolean
}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4">
      {messages.map((m, i) => (
        <ChatMessage key={i} {...m} />
      ))}

      {loading && <ChatMessage role="assistant" content="🤖 Thinking..." />}
    </div>
  )
}
