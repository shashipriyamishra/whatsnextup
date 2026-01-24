/**
 * useFetch Hook
 * Generic hook for fetching data from any API endpoint
 * Handles loading, error, and retry logic
 */

import { useEffect, useState, useCallback } from "react"
import { apiClient, ApiException, getUserFriendlyErrorMessage } from "@/lib/api"

interface UseFetchOptions {
  skip?: boolean
  retries?: number
  timeout?: number
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T>(
  endpoint: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { skip = false, retries = 3, timeout = 10000 } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (skip) return

    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.requestWithRetry<T>(
        endpoint,
        { timeout },
        retries
      )
      setData(result)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      const error = new Error(errorMessage)
      setError(error)
      console.error(`Failed to fetch from ${endpoint}:`, err)
    } finally {
      setLoading(false)
    }
  }, [endpoint, skip, retries, timeout])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Variant for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, R = void>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (payload?: R): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.request<T>(endpoint, {
          method,
          body: payload ? JSON.stringify(payload) : undefined,
        })
        setData(result)
        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred"
        const error = new Error(errorMessage)
        setError(error)
        console.error(`Failed to ${method} ${endpoint}:`, err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [endpoint, method]
  )

  return {
    data,
    loading,
    error,
    mutate,
  }
}
