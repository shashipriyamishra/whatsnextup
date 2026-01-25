"use client"

/**
 * ChatInput Component - Production optimized
 * Input area for sending messages
 * Handles Enter key and Shift+Enter for new lines
 *
 * Optimizations:
 * - React.memo to prevent rerenders
 * - useCallback for memoized event handlers
 * - Zustand for state (no prop drilling)
 * - Async message sending with loading states
 */

import React, { useCallback, useRef } from "react"
import {
  useChatInput,
  useChatLoading,
  useChatStore,
  useToken,
} from "@/lib/store"
import { apiClient } from "@/lib/api"

export const ChatInput = React.memo(function ChatInput() {
  const input = useChatInput()
  const loading = useChatLoading()
  const token = useToken()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Get Zustand setters
  const { setInput, setLoading, addMessage } = useChatStore((state) => ({
    setInput: state.setInput,
    setLoading: state.setLoading,
    addMessage: state.addMessage,
  }))

  // Memoized send handler
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading || !token) return

    try {
      setLoading(true)

      // Add user message
      addMessage({
        role: "user",
        text: input,
        timestamp: Date.now(),
      })

      // Send to API
      const response = await apiClient.sendChatMessage(input)

      // Add AI response
      addMessage({
        role: "ai",
        text: response.reply,
        timestamp: Date.now(),
      })

      // Clear input
      setInput("")

      // Refresh stats
      // await refetchStats()
    } catch (err) {
      console.error("Failed to send message:", err)
      addMessage({
        role: "ai",
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      })
    } finally {
      setLoading(false)
    }
  }, [input, loading, token, setLoading, addMessage, setInput])

  // Memoized key press handler
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-white/5 backdrop-blur-2xl px-4 md:px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What should I do next? Share your thoughts..."
            className="flex-1 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white text-black placeholder-gray-400 text-sm font-medium transition-all"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-pink-500/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm whitespace-nowrap transform hover:scale-105 active:scale-95"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-white/50 mt-2">
          💡 Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </footer>
  )
})
