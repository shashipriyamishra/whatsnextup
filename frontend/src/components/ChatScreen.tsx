"use client"

/**
 * ChatScreen Component - Production-optimized chat interface
 *
 * Optimizations:
 * - React.memo to prevent rerenders when props don't change
 * - Zustand for chat state management (no prop drilling)
 * - Memoized sub-components
 * - Efficient useRef for scroll container
 *
 * Components:
 * - ChatMessages: Message display list
 * - ChatInput: Input form
 * - Sidebar: Navigation sidebar
 * - UsageBar: Usage statistics
 */

import React, { useRef } from "react"
import { useUser } from "@/lib/store"
import { ChatMessages, ChatInput } from "@/components/chat"
import Sidebar from "./Sidebar"
import UsageBar from "./UsageBar"

function ChatScreenComponent() {
  const user = useUser() // Zustand hook - granular subscription
  const containerRef = useRef<HTMLDivElement>(null)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/95">
        <div className="text-white">Loading...</div>
      </div>
    )
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

      {/* Messages Container */}
      <ChatMessages containerRef={containerRef} />

      {/* Input Area */}
      <ChatInput />

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

/**
 * Memoized component to prevent rerenders when parent rerenders
 * Only rerenders when the `user` prop actually changes (via Zustand)
 */
export default React.memo(ChatScreenComponent)
