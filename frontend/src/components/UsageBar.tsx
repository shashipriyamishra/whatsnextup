"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "./ui/button"
import Link from "next/link"
import { API_URL } from "@/lib/api"

interface UsageStats {
  messages_today: number
  messages_remaining: number
  tier: string
  limit: number
  reset_at: string
}

export default function UsageBar() {
  const { token, user } = useAuth()
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return

    async function fetchUsageStats() {
      try {
        const response = await fetch(`${API_URL}/api/usage/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsageStats()
  }, [token, user])

  if (loading || !stats || !user) return null

  const { messages_today, messages_remaining, tier, limit } = stats
  const percentage = limit > 0 ? (messages_today / limit) * 100 : 0
  const isNearLimit = percentage >= 80
  const isAtLimit = messages_remaining === 0

  if (tier !== "free") return null // Only show for free tier

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="text-white/90 text-sm">
            <span className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {messages_remaining}
            </span>
            <span className="text-white/70 ml-1">free messages left today</span>
          </p>
          <p className="text-white/50 text-xs mt-0.5">
            {messages_today} of {limit} used • Resets daily
          </p>
        </div>
      </div>
      {isNearLimit && (
        <Link href="/pricing">
          <Button
            size="sm"
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50"
          >
            Upgrade
          </Button>
        </Link>
      )}
    </div>
  )
}
