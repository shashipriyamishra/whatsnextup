"use client"

/**
 * Centralized API Client
 * Single source of truth for all API communication
 *
 * Usage:
 *   const tier = await apiClient.getUserTier()
 *   const stats = await apiClient.getUsageStats()
 */

import {
  RequestOptions,
  UsageStats,
  UserTierResponse,
  ChatResponse,
} from "./types"
import { ApiException, parseError, getUserFriendlyErrorMessage } from "./errors"
import { auth } from "@/lib/firebase"
import { logger } from "@/lib/logger"

class ApiClient {
  private baseUrl: string

  constructor() {
    // CRITICAL: NEXT_PUBLIC_API_URL must be set in production
    // If not set, this will cause API calls to fail with clear errors
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "production"
      ) {
        logger.error(
          "CRITICAL: NEXT_PUBLIC_API_URL not set in production",
          undefined,
          { context: "ApiClient constructor" },
        )
      }
      // Only fallback to localhost in development
      this.baseUrl =
        process.env.NODE_ENV === "development" ? "http://localhost:8000" : ""

      if (process.env.NODE_ENV === "development") {
        logger.info("Using development API URL", {
          url: "http://localhost:8000",
        })
      }
    } else {
      this.baseUrl = apiUrl
      if (process.env.NODE_ENV === "development") {
        logger.info("Using configured API URL", { url: apiUrl })
      }
    }
  }

  /**
   * Core request method - all API calls go through here
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      authRequired = true,
      timeout = 10000,
      headers = {},
      ...fetchOptions
    } = options

    const startTime = Date.now()

    try {
      // Add authorization header if required
      const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(typeof headers === "object" && headers !== null
          ? (headers as Record<string, string>)
          : {}),
      }

      if (authRequired) {
        const token = await this.getAuthToken()
        finalHeaders.Authorization = `Bearer ${token}`
      }

      const url = `${this.baseUrl}${endpoint}`
      const method = fetchOptions.method || "GET"

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        headers: finalHeaders,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const duration = Date.now() - startTime
      logger.api(method, endpoint, response.status, duration)

      if (!response.ok) {
        throw await parseError(response)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      const duration = Date.now() - startTime
      const method = fetchOptions.method || "GET"

      if (error instanceof ApiException) {
        logger.api(method, endpoint, error.status, duration)
        throw error
      }

      // Handle AbortError (timeout)
      if (error instanceof DOMException && error.name === "AbortError") {
        logger.api(method, endpoint, 408, duration)
        throw new ApiException(408, "Request timeout. Please try again.", {
          originalError: error.message,
        })
      }

      // Handle network errors
      if (error instanceof TypeError) {
        logger.api(method, endpoint, 0, duration)
        throw new ApiException(
          0,
          "Network error. Please check your connection.",
          { originalError: error.message },
        )
      }

      // Re-throw if already ApiException
      logger.error("API request failed", error)
      throw error
    }
  }

  /**
   * Retry logic for failed requests
   */
  async requestWithRetry<T>(
    endpoint: string,
    options: RequestOptions = {},
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.request<T>(endpoint, options)
      } catch (error) {
        lastError = error

        // Don't retry on auth errors
        if (error instanceof ApiException && error.status === 401) {
          throw error
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          )
        }
      }
    }

    throw lastError
  }

  /**
   * Get authentication token from Firebase
   */
  private async getAuthToken(): Promise<string> {
    const currentUser = auth.currentUser

    if (!currentUser) {
      throw new ApiException(401, "User not authenticated")
    }

    return await currentUser.getIdToken()
  }

  /**
   * USER TIER API CALLS
   */

  async getUserTier(): Promise<string> {
    try {
      const data = await this.request<UserTierResponse>("/api/user/tier", {
        timeout: 30000, // 30 second timeout for tier fetch
      })
      return data.tier || "free"
    } catch (error) {
      console.error("Failed to fetch user tier:", error)
      // Gracefully fallback to free tier instead of throwing
      return "free"
    }
  }

  /**
   * USAGE STATS API CALLS
   */

  async getUsageStats(): Promise<UsageStats> {
    try {
      return await this.request<UsageStats>("/api/usage/stats")
    } catch (error) {
      console.error("Failed to fetch usage stats:", error)
      throw error
    }
  }

  /**
   * CHAT API CALLS
   */

  async sendChatMessage(message: string): Promise<ChatResponse> {
    try {
      return await this.request<ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      })
    } catch (error) {
      console.error("Failed to send chat message:", error)
      throw error
    }
  }

  /**
   * HEALTH CHECK
   */

  async healthCheck(): Promise<{ status: string }> {
    try {
      return await this.request<{ status: string }>("/health", {
        authRequired: false,
      })
    } catch (error) {
      console.error("Health check failed:", error)
      throw error
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

/**
 * Get API URL from environment variable
 * CRITICAL: NEXT_PUBLIC_API_URL must be set in production
 */
function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL

  if (!url) {
    // In production, missing env var is a critical error
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL: NEXT_PUBLIC_API_URL not configured!\\n" +
          "API calls will fail. This must be set in your deployment platform.\\n" +
          "Set to your Cloud Run backend URL, e.g.: https://whatsnextup-api-xxx.run.app",
      )
      return ""
    }
    // Development: use localhost
    return "http://localhost:8000"
  }

  return url
}

/**
 * Export API URL configuration
 * NOTE: Must be set via NEXT_PUBLIC_API_URL environment variable
 */
export const API_URL = resolveApiUrl()

/**
 * Helper function to get API URL
 * Used by direct fetch calls (should migrate to apiClient instead)
 */
export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL: NEXT_PUBLIC_API_URL not configured for production API calls.\\n" +
          "Set this environment variable in your deployment platform.",
      )
      return ""
    }
    return "http://localhost:8000"
  }

  return url
}

/**
 * Export utility for error handling
 */
export { getUserFriendlyErrorMessage, ApiException }
