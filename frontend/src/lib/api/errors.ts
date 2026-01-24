/**
 * API Error Handler
 * Centralized error handling for all API requests
 */

import { ApiError } from "./types"

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = "ApiException"
  }

  toJSON(): ApiError {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    }
  }
}

/**
 * Parse error responses consistently
 */
export async function parseError(response: Response): Promise<ApiException> {
  let message = `API Error: ${response.status} ${response.statusText}`
  let details: Record<string, any> | undefined

  try {
    const data = await response.json()
    message = data.message || message
    details = data
  } catch {
    // If response is not JSON, use status text
  }

  return new ApiException(response.status, message, details)
}

/**
 * Standardized error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Unauthorized. Please sign in again.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  TIMEOUT: "Request timeout. Please try again.",
  INVALID_RESPONSE: "Invalid response from server.",
} as const

/**
 * Handle API errors with user-friendly messages
 */
export function getUserFriendlyErrorMessage(
  error: unknown
): string {
  if (error instanceof ApiException) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED
      case 403:
        return ERROR_MESSAGES.FORBIDDEN
      case 404:
        return ERROR_MESSAGES.NOT_FOUND
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_MESSAGES.SERVER_ERROR
      default:
        return error.message
    }
  }

  if (error instanceof TypeError) {
    if (error.message.includes("fetch")) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
  }

  return ERROR_MESSAGES.SERVER_ERROR
}
