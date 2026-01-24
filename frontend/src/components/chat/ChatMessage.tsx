/**
 * ChatMessage Component
 * Renders a single message from user or AI
 * Memoized to prevent re-renders unless message content changes
 */

import React from "react"

export interface MessageProps {
  role: "user" | "ai"
  text: string
  timestamp?: number
}

export const ChatMessage = React.memo(
  function ChatMessage({ role, text }: MessageProps) {
    return (
      <div
        className={`flex ${role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
      >
        <div
          className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-lg transition-all ${
            role === "user"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-pink-500/40"
              : "bg-white/15 text-white border border-white/20 rounded-bl-none backdrop-blur-sm"
          }`}
        >
          {text}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if role or text changes
    return (
      prevProps.role === nextProps.role && prevProps.text === nextProps.text
    )
  },
)

ChatMessage.displayName = "ChatMessage"
