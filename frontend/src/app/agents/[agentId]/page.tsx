"use client"

import { useState, useEffect, use } from "react"
import { useAuth } from "@/components/contexts"
import { useRouter } from "next/navigation"
import { chatWithAgent, getAllAgents, Agent } from "@/lib/agents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Message {
  role: "user" | "agent"
  text: string
}

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const resolvedParams = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      let mounted = true

      async function loadData() {
        const agents = await getAllAgents()
        if (!mounted) return

        const foundAgent = agents.find((a) => a.id === resolvedParams.agentId)
        if (foundAgent) {
          setAgent(foundAgent)
        } else {
          router.push("/agents")
        }
      }

      loadData()

      return () => {
        mounted = false
      }
    }
  }, [user, authLoading, router, resolvedParams.agentId])

  const handleSend = async () => {
    if (!input.trim() || !user || !agent) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setLoading(true)

    try {
      const token = await user.getIdToken()
      const response = await chatWithAgent(agent.id, userMessage, token)
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: response.response },
      ])
    } catch (error) {
      console.error("Error chatting with agent:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/95">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 relative z-10 mt-0 mb-28">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="text-6xl mb-6">{agent.icon}</div>
              <h2 className="text-3xl font-black text-white mb-3">
                {agent.name}
              </h2>
              <p className="text-base text-white/70 max-w-lg">
                {agent.description}
              </p>
              <div className="mt-8 p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm max-w-md">
                <p className="text-sm text-white/80">
                  I'm here to help! Ask me anything related to my expertise.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
            >
              <div
                className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-lg transition-all ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-pink-500/40"
                    : "bg-white/15 text-white border border-white/20 rounded-bl-none backdrop-blur-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/15 text-white border border-white/20 px-4 py-3 rounded-2xl rounded-bl-none shadow-lg backdrop-blur-sm">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-white/5 backdrop-blur-2xl px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={`Chat with ${agent.name}...`}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="cursor-pointer"
            >
              Send
            </Button>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-message-in {
          animation: message-in 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}
