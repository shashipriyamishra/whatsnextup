"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/contexts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { API_URL } from "@/lib/api"

interface UsageStats {
  messages_today: number
  messages_remaining: number
  tier: string
  limit: number
  reset_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, token } = useAuth()
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user || !token) return

    async function loadStats() {
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
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user, token])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/95">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const tierInfo = {
    free: {
      name: "Free Plan",
      color: "from-gray-600 to-gray-700",
      icon: "🎁",
      features: ["10 messages/day", "Basic trending feed", "All AI agents"],
    },
    plus: {
      name: "Plus Plan",
      color: "from-purple-600 to-pink-600",
      icon: "⚡",
      features: [
        "Unlimited messages",
        "Full trending feed",
        "Conversation history",
        "Priority support",
      ],
    },
    pro: {
      name: "Pro Plan",
      color: "from-orange-600 to-red-600",
      icon: "🚀",
      features: [
        "Everything in Plus",
        "API access",
        "Custom agents",
        "Team features",
        "24/7 support",
      ],
    },
  }

  const currentTier = stats?.tier || "free"
  const tier = tierInfo[currentTier as keyof typeof tierInfo]

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Info Card */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20">
            <CardContent className="py-8">
              <div className="flex items-center gap-6">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl border-4 border-pink-400 shadow-lg shadow-pink-500/30"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {user.displayName || "User"}
                  </h2>
                  <p className="text-white/70 mb-3">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`bg-gradient-to-r ${tier.color} text-white border-0`}
                    >
                      {tier.icon} {tier.name}
                    </Badge>
                    {user.emailVerified && (
                      <Badge
                        variant="glass"
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">{tier.icon}</span>
                Current Plan: {tier.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-white/80"
                  >
                    <span className="text-green-400">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {currentTier === "free" ? (
                <Link href="/pricing">
                  <Button className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 mt-4">
                    🚀 Upgrade to Plus - ₹199/month
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full cursor-pointer text-white/60"
                  disabled
                >
                  ✓ Active Subscription
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Messages Today</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.messages_today}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Remaining</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.limit > 0 ? stats.messages_remaining : "∞"}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-sm mb-1">Daily Limit</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.limit > 0 ? stats.limit : "Unlimited"}
                    </p>
                  </div>
                </div>
                {currentTier === "free" && (
                  <p className="text-white/50 text-sm mt-4">
                    Resets daily at midnight UTC • Upgrade for unlimited
                    messages
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/history">
                <Button
                  variant="glass"
                  className="w-full cursor-pointer justify-start"
                >
                  💬 View Chat History
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="glass"
                  className="w-full cursor-pointer justify-start"
                >
                  {currentTier === "free"
                    ? "💎 Upgrade Plan"
                    : "📊 Manage Subscription"}
                </Button>
              </Link>
              <Button
                variant="glass"
                className="w-full cursor-pointer justify-start text-white/60"
                disabled
              >
                🔐 Privacy Settings (Coming Soon)
              </Button>
              <Button
                variant="glass"
                className="w-full cursor-pointer justify-start text-white/60"
                disabled
              >
                📧 Email Preferences (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/60">User ID</span>
                <span className="text-white/90 font-mono text-xs">
                  {user.uid?.substring(0, 20)}...
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Email</span>
                <span className="text-white/90">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Account Created</span>
                <span className="text-white/90">
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/60">Last Sign In</span>
                <span className="text-white/90">
                  {user.metadata?.lastSignInTime
                    ? new Date(
                        user.metadata.lastSignInTime,
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}
