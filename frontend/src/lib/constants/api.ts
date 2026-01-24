/**
 * API Constants
 */

export const API_ENDPOINTS = {
  USER: {
    TIER: "/api/user/tier",
    PROFILE: "/api/user/profile",
  },
  USAGE: {
    STATS: "/api/usage/stats",
  },
  CHAT: {
    SEND: "/api/chat",
    HISTORY: "/api/chat/history",
  },
  HEALTH: "/health",
} as const

export const API_LIMITS = {
  FREE: 10,
  PRO: 100,
  ENTERPRISE: -1, // unlimited
} as const

export const API_DEFAULTS = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const
