/**
 * UI Constants
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CHAT: "/chat",
  TRENDING: "/trending",
  AGENTS: "/agents",
  HISTORY: "/history",
  MEMORIES: "/memories",
  PLANS: "/plans",
  REFLECTIONS: "/reflections",
  PROFILE: "/profile",
  PRICING: "/pricing",
} as const

export const UI_STRINGS = {
  GREETING: "What's Your Next Move?",
  PLACEHOLDER: "What should I do next? Share your thoughts...",
  SEND_BUTTON: "Send",
  SIGNING_OUT: "Signing out...",
  ERROR_GENERIC: "Something went wrong. Please try again.",
  ERROR_NETWORK: "Network error. Please check your connection.",
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const
