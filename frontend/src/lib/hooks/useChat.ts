"use client"

/**
 * useChat Hook
 * Encapsulates all chat-related logic and state management
 * Makes ChatScreen component simpler and more testable
 */

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/components/contexts"
import { apiClient, ChatResponse } from "@/lib/api"
import { useStats } from "./useStats"

export interface Message {
  role: "user" | "ai"
  text: string
  timestamp?: number
}

interface UseChatResult {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  loading: boolean
  error: Error | null
  handleSend: () => Promise<void>
  clearMessages: () => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function useChat(): UseChatResult {
  const { user } = useAuth()
  const { refetch: refetchStats } = useStats()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
    // Use setTimeout to ensure DOM is updated
    setTimeout(scrollToBottom, 0)
  }, [messages])

  const handleSend = useCallback(async () => {
    if (!input.trim() || !user) return

    const userMessage: Message = {
      role: "user",
      text: input,
      timestamp: Date.now(),
    }

    try {
      setLoading(true)
      setError(null)

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage])
      setInput("")

      // Send message to API
      const response = await apiClient.sendChatMessage(input)

      // Add AI response
      const aiMessage: Message = {
        role: "ai",
        text: response.reply,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // Refresh stats after message
      await refetchStats()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message"
      setError(new Error(errorMessage))
      console.error("Failed to send chat message:", err)

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, user, refetchStats])

  const clearMessages = useCallback(() => {
    setMessages([])
    setInput("")
    setError(null)
  }, [])

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    handleSend,
    clearMessages,
    containerRef,
  }
}
