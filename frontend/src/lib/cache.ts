/**
 * Smart Caching System for API Calls
 * - User-controlled refresh (no time-based invalidation)
 * - Session-based persistence (clears on page reload)
 * - Differentiated by key and parameters
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()

  /**
   * Generate cache key from function name and parameters
   */
  private generateKey(endpoint: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : ""
    return `${endpoint}:${paramStr}`
  }

  /**
   * Get cached data if available
   */
  get<T>(endpoint: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(endpoint, params)
    const entry = this.cache.get(key)
    if (entry) {
      return entry.data as T
    }
    return null
  }

  /**
   * Set cache data
   */
  set<T>(endpoint: string, data: T, params?: Record<string, any>): void {
    const key = this.generateKey(endpoint, params)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Clear specific cache entry or all cache
   */
  clear(endpoint?: string, params?: Record<string, any>): void {
    if (!endpoint) {
      this.cache.clear()
      return
    }
    const key = this.generateKey(endpoint, params)
    this.cache.delete(key)
  }

  /**
   * Clear cache for a specific endpoint (all param variations)
   */
  clearEndpoint(endpoint: string): void {
    const keysToDelete: string[] = []
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key))
  }

  /**
   * Check if cache exists for given key
   */
  has(endpoint: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(endpoint, params)
    return this.cache.has(key)
  }

  /**
   * Get all cached entries (for debugging)
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [key, value] of this.cache.entries()) {
      result[key] = {
        data: value.data,
        age: Date.now() - value.timestamp,
      }
    }
    return result
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

/**
 * Hook for using cached data with refresh capability
 * Usage:
 * const { data, loading, error, refresh } = useCachedData(
 *   'agents',
 *   () => getAllAgents(),
 *   { initialState: [], onError: console.error }
 * )
 */
export function useCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  options?: {
    initialState?: T
    onError?: (error: Error) => void
    params?: Record<string, any>
  },
): {
  data: T | null
  loading: boolean
  error: Error | null
  refresh: (forceRefresh?: boolean) => Promise<void>
  clearCache: () => void
} {
  const [data, setData] = React.useState<T | null>(() => {
    const cached = cacheManager.get<T>(cacheKey, options?.params)
    return cached || options?.initialState || null
  })
  const [loading, setLoading] = React.useState(!data)
  const [error, setError] = React.useState<Error | null>(null)

  const refresh = React.useCallback(
    async (forceRefresh = false) => {
      // Return cached data if available and not forcing refresh
      if (!forceRefresh) {
        const cached = cacheManager.get<T>(cacheKey, options?.params)
        if (cached) {
          setData(cached)
          return
        }
      }

      setLoading(true)
      setError(null)

      try {
        const result = await fetchFn()
        cacheManager.set(cacheKey, result, options?.params)
        setData(result)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        options?.onError?.(error)
      } finally {
        setLoading(false)
      }
    },
    [cacheKey, fetchFn, options],
  )

  const clearCache = React.useCallback(() => {
    cacheManager.clear(cacheKey, options?.params)
    setData(null)
  }, [cacheKey, options?.params])

  React.useEffect(() => {
    refresh()
  }, [refresh]) // Only run once on mount

  return { data, loading, error, refresh, clearCache }
}

// Re-export React for the hook
import * as React from "react"
