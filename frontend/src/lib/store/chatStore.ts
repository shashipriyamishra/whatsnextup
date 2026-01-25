import { create } from "zustand"

export interface Message {
  role: "user" | "ai"
  text: string
  timestamp?: number
}

interface ChatState {
  messages: Message[]
  input: string
  loading: boolean
  error: Error | null

  addMessage: (message: Message) => void
  setInput: (input: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  clearMessages: () => void
  setMessages: (messages: Message[]) => void
}

/**
 * Chat Store - Global chat state
 * Manages messages, input, and loading state
 * Prevents prop drilling and unnecessary re-renders
 */
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: "",
  loading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setInput: (input) => set({ input }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [], input: "", error: null }),
  setMessages: (messages) => set({ messages }),
}))

/**
 * Selector hooks for granular subscriptions
 */
export const useChatMessages = () => useChatStore((state) => state.messages)
export const useChatInput = () => useChatStore((state) => state.input)
export const useChatLoading = () => useChatStore((state) => state.loading)
export const useChatError = () => useChatStore((state) => state.error)
