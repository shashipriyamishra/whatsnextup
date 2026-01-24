/**
 * API Response Types
 * Central location for all API response type definitions
 */

export interface ApiError {
  message: string
  status: number
  details?: Record<string, any>
}

export interface UsageStats {
  tier: string
  messages_used: number
  messages_limit: number
  reset_date?: string
  features?: string[]
}

export interface UserTierResponse {
  tier: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface ChatMessage {
  role: "user" | "ai"
  content: string
  timestamp?: number
}

export interface ChatResponse {
  reply: string
  status: "success" | "error"
  message_count?: number
}

export interface PersonalizedFeed {
  reddit?: any[]
  tech?: any[]
  github?: any[]
  youtube?: any[]
  news?: any[]
  weather?: any
}

export interface RequestOptions extends RequestInit {
  authRequired?: boolean
  timeout?: number
}
