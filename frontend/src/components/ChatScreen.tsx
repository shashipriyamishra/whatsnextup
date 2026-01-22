"use client"

import { useAuth } from "../lib/AuthContext"
import { sendMessage } from "../lib/chat"
import { logout } from "../lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

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
  const containerRef = useRef<HTMLDivElement>(null)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change or loading state changes
    const scrollToBottom = () => {
      if (containerRef.current) {
        const scrollElement = containerRef.current
        // Scroll to the very bottom
        scrollElement.scrollTop =
          scrollElement.scrollHeight - scrollElement.clientHeight
      }
    }

    // Use requestAnimationFrame for better performance and ensure layout is done
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom)
    })
  }, [messages, loading])

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30 hover:scale-110 transition-all">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">What's Next Up</h1>
              <p className="text-xs text-white/50">AI Planning Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/memory"
              className="text-xs px-2 md:px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold whitespace-nowrap"
              title="View Memories"
            >
              <span className="hidden sm:inline">💭 Memory</span>
              <span className="sm:hidden">💭</span>
            </Link>
            <Link
              href="/plans"
              className="text-xs px-2 md:px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold whitespace-nowrap"
              title="View Plans"
            >
              <span className="hidden sm:inline">📋 Plans</span>
              <span className="sm:hidden">📋</span>
            </Link>
            <Link
              href="/reflections"
              className="text-xs px-2 md:px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition font-semibold whitespace-nowrap"
              title="View Reflections"
            >
              <span className="hidden sm:inline">🪞 Reflect</span>
              <span className="sm:hidden">🪞</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-7 h-7 rounded-full border-2 border-pink-400"
                />
              )}
              <span className="text-xs font-semibold text-white">
                {user?.displayName?.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-200 font-bold cursor-pointer transform hover:scale-105"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Messages Container - Scrollable in middle only */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 relative z-10 mt-20 mb-28 scroll-smooth"
        data-messages
      >
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-xl bg-gradient-to-br from-purple-600/40 to-pink-600/30 border border-white/20 backdrop-blur-sm">
                  <span className="text-4xl">🚀</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-3">
                  What's Your Next Move?
                </h2>
                <p className="text-base text-white/70 max-w-lg leading-relaxed font-medium">
                  Tell me about your goals, challenges, or decisions. I'll help
                  you think through them with clarity and confidence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-2xl">
                {[
                  {
                    title: "Plan Tomorrow",
                    description: "Help me plan my day",
                    icon: "📅",
                  },
                  {
                    title: "Prioritize",
                    description: "Which tasks matter most?",
                    icon: "🎯",
                  },
                  {
                    title: "New Ideas",
                    description: "I want to try something new",
                    icon: "💭",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(item.description)
                      document.querySelector("textarea")?.focus()
                    }}
                    className="group p-5 rounded-2xl bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 text-left cursor-pointer backdrop-blur-sm"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 origin-center">
                      {item.icon}
                    </div>
                    <div className="font-bold text-white text-sm">
                      {item.title}
                    </div>
                    <p className="text-xs text-white/60 font-medium">
                      {item.description}
                    </p>
                  </button>
                ))}
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

      {/* Input Area - Fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-white/5 backdrop-blur-2xl px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What should I do next? Share your thoughts..."
              className="flex-1 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white/10 text-white placeholder-white/40 text-sm font-medium backdrop-blur-sm transition-all"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-pink-500/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm whitespace-nowrap transform hover:scale-105 active:scale-95"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-white/50 mt-2">
            💡 Press Enter to send • Shift+Enter for new line
          </p>
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

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Smooth scrollbar */
        [data-messages]::-webkit-scrollbar {
          width: 6px;
        }

        [data-messages]::-webkit-scrollbar-track {
          background: transparent;
        }

        [data-messages]::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 3px;
        }

        [data-messages]::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  )
}
