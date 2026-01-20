"use client"

import { useState } from "react"
import ChatWindow from "../components/ChatWindow"
import ChatInput from "../components/ChatInput"
import { sendMessage } from "../lib/api"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi, I’m whatsnextup. How are you feeling today?",
    },
  ])

  const [loading, setLoading] = useState(false)

  async function handleSend(text: string) {
    setMessages((m) => [...m, { role: "user", content: text }])
    setLoading(true)

    try {
      const data = await sendMessage(text)
      setMessages((m) => [...m, { role: "assistant", content: data.response }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Error connecting to AI." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">whatsnextup</h1>
        <p className="text-sm text-gray-500">What’s next for you?</p>
      </header>

      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} loading={loading} />
    </main>
  )
}
