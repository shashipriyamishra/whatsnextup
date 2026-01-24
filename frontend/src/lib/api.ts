// frontend/src/lib/api.ts
// DEPRECATED: Import from ./api/index.ts instead
// This file is kept for backwards compatibility with existing imports

import {
  API_URL as UNIFIED_API_URL,
  getApiUrl as unifiedGetApiUrl,
  apiClient,
  getUserFriendlyErrorMessage,
  ApiException,
} from "./api/index"
export type {
  ApiError,
  UsageStats,
  UserTierResponse,
  ChatMessage,
  ChatResponse,
  PersonalizedFeed,
  RequestOptions,
} from "./api/types"

export const API_URL = UNIFIED_API_URL
export const getApiUrl = unifiedGetApiUrl
export { apiClient, getUserFriendlyErrorMessage, ApiException }

export async function getMemories(authToken: string) {
  return apiClient.request("/api/memories", {
    method: "GET",
    authRequired: true,
  })
}

export async function getPlans(authToken: string) {
  return apiClient.request("/api/plans", { method: "GET", authRequired: true })
}

export async function createPlan(goal: string, authToken: string) {
  return apiClient.request("/api/plans", {
    method: "POST",
    body: JSON.stringify({ goal }),
    authRequired: true,
  })
}

export async function getReflections(authToken: string) {
  return apiClient.request("/api/reflections", {
    method: "GET",
    authRequired: true,
  })
}

export async function createReflection(
  content: string,
  mood: string,
  authToken: string,
) {
  return apiClient.request("/api/reflections", {
    method: "POST",
    body: JSON.stringify({ content, mood }),
    authRequired: true,
  })
}
