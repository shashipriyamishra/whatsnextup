"use client"

/**
 * ChatScreen Component (Refactored)
 * Main chat interface using extracted sub-components
 * Manages state and orchestrates chat flow
 * 
 * Components:
 * - ChatHeader: Navigation and user info
 * - ChatMessages: Message display list
 * - ChatInput: Input form
 * - Sidebar: Navigation sidebar
 * - UsageBar: Usage statistics
 */

import { useAuth } from "@/components/contexts"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { useEffect, useState } from "react"
import { useChat } from "@/lib/hooks"
import type { Message } from "@/lib/hooks/useChat"
import { ChatHeader, ChatMessages, ChatInput } from "@/components/chat"
import Sidebar from "./Sidebar"
import UsageBar from "./UsageBar"
import { apiClient } from "@/lib/api"

export default function ChatScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [userTier, setUserTier] = useState<string>("free")

  // Use custom hook for all chat logic
  const { messages, input, setInput, loading, error, handleSend, containerRef } = useChat()

  // Fetch user tier on mount
  useEffect(() => {
    if (!user) return

    async function fetchTier() {
      try {
        const tierValue = await apiClient.getUserTier()
        setUserTier(tierValue)
      } catch (err) {
        console.error("Failed to fetch tier:", err)
      }
    }

    fetchTier()
  }, [user])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.replace("/")
    } catch (err) {
      console.error("Sign out failed:", err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <ChatHeader user={user} userTier={userTier} onLogout={handleLogout} />

      {/* Messages Container */}
      <ChatMessages messages={messages} loading={loading} containerRef={containerRef} />

      {/* Input Area */}
      <ChatInput value={input} onChange={setInput} onSend={handleSend} loading={loading} />

      {/* Error Display */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-600/80 text-white px-4 py-2 rounded-lg text-sm">
          {error.message}
        </div>
      )}

      <style jsx>{`
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

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}

