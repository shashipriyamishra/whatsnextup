"use client"

/**
 * UsageBar Component
 * Displays user's API usage statistics and tier information
 * Memoized to prevent unnecessary re-renders
 */

import React from "react"
import { useStats } from "@/lib/hooks"
import { Button } from "./ui/button"
import Link from "next/link"

const UsageBarContent = React.memo(function UsageBarContent() {
  const { stats, loading } = useStats()

  if (loading || !stats) return null

  const { messages_used = 0, messages_limit = 10, tier = "free" } = stats
  const percentage = messages_limit > 0 ? (messages_used / messages_limit) * 100 : 0
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white/70">
          {tier.toUpperCase()} - Usage {messages_used}/{messages_limit}
        </span>
        {isAtLimit && (
          <span className="text-xs font-bold text-red-400">LIMIT REACHED</span>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-yellow-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
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
    </div>
  )
})

UsageBarContent.displayName = "UsageBar"

export default UsageBarContent
