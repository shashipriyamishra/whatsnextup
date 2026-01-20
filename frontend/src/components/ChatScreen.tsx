"use client"

import { useAuth } from "../lib/AuthContext"
import { sendMessage } from "../lib/chat"
import { logout } from "../lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Message {
  role: "user" | "ai"
  text: string
}

export default function ChatScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  async function handleSend() {
    if (!input.trim()) return

    setLoading(true)
    setMessages([...messages, { role: "user", text: input }])
    setInput("")

    const res = await sendMessage(input)

    setMessages((m) => [...m, { role: "ai", text: res.reply }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="px-4 py-3 border-b flex justify-between items-center">
        <span className="font-medium">What’s Next Up</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.displayName}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-xl ${
              m.role === "user"
                ? "ml-auto bg-black text-white"
                : "mr-auto bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && <div className="text-sm text-gray-400">Thinking…</div>}
      </main>

      {/* Input */}
      <footer className="p-3 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What should I do next?"
            className="flex-1 border rounded-xl px-4 py-2"
          />
          <button
            onClick={handleSend}
            className="px-4 rounded-xl bg-black text-white"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  )
}
