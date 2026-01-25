"use client"

/**
 * ChatInput Component
 * Input area for sending messages
 * Handles Enter key and Shift+Enter for new lines
 * Optimized with useCallback to memoize event handlers
 */

import React, { useCallback } from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  loading: boolean
}

export const ChatInput = React.memo(function ChatInput({
  value,
  onChange,
  onSend,
  loading,
}: ChatInputProps) {
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSend()
      }
    },
    [onSend],
  )

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-white/5 backdrop-blur-2xl px-4 md:px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What should I do next? Share your thoughts..."
            className="flex-1 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white text-black placeholder-gray-400 text-sm font-medium transition-all"
            rows={2}
          />
          <button
            onClick={onSend}
            disabled={loading || !value.trim()}
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
  )
})

ChatInput.displayName = "ChatInput"
