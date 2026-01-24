/**
 * useStats Hook
 * Fetches and manages usage statistics for the current user
 * Replaces duplicated stats-fetching logic across components
 */

import { useEffect, useState } from "react"
import { useAuth } from "@/components/contexts"
import { apiClient, UsageStats, ApiException } from "@/lib/api"

interface UseStatsResult {
  stats: UsageStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useStats(): UseStatsResult {
  const { user } = useAuth()
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getUsageStats()
      setStats(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stats"
      setError(new Error(errorMessage))
      console.error("Failed to fetch usage stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
