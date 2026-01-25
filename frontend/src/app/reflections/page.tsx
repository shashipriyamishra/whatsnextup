"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/contexts"
import { getApiUrl } from "@/lib/api"

interface Reflection {
  id: string
  title: string
  content: string
  type: "daily" | "weekly" | "monthly" | "goal-review"
  insights: string[]
  next_actions: string[]
  date: string
  created_at: string
}

export default function ReflectionsPage() {
  const { user, loading } = useAuth()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      fetchReflections()
    }
  }, [user, loading])

  const fetchReflections = async () => {
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/reflections`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReflections(data.reflections || [])
      }
    } catch (error) {
      console.error("Failed to fetch reflections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      daily: "bg-yellow-500/20 border-yellow-400/50 text-yellow-300",
      weekly: "bg-purple-500/20 border-purple-400/50 text-purple-300",
      monthly: "bg-indigo-500/20 border-indigo-400/50 text-indigo-300",
      "goal-review": "bg-pink-500/20 border-pink-400/50 text-pink-300",
    }
    return colors[type] || colors.daily
  }

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      daily: "📅",
      weekly: "📊",
      monthly: "📈",
      "goal-review": "🎯",
    }
    return emojis[type] || "💭"
  }

  const filteredReflections =
    selectedType === "all"
      ? reflections
      : reflections.filter((r) => r.type === selectedType)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-pink-400 transition"
            >
              <span className="text-xl">✨</span>
              <span className="font-bold">whatsnextup</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition"
                title="Chat"
              >
                💬
              </Link>
              <Link
                href="/plans"
                className="text-white/70 hover:text-white transition"
                title="Plans"
              >
                📋
              </Link>
              <span className="text-white font-bold">💭</span>
              <Link
                href="/memories"
                className="text-white/70 hover:text-white transition"
                title="Memories"
              >
                🧠
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/95 relative overflow-hidden">
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-8">
        {/* Create new reflection button */}
        <div className="mb-8">
          <Link href="/reflections/create" className="block">
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition">
              + Add New Reflection with AI
            </button>
          </Link>
        </div>

        {/* Type filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm font-semibold mb-4">
            Filter by type:
          </h2>
          <div className="flex flex-wrap gap-2">
            {["all", "daily", "weekly", "monthly", "goal-review"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedType === type
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  }`}
                >
                  {type === "all"
                    ? "All Reflections"
                    : `${getTypeEmoji(type)} ${
                        type.charAt(0).toUpperCase() +
                        type.slice(1).replace("-", " ")
                      }`}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Reflections grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReflections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white/50 mb-4">No reflections yet</p>
              <p className="text-white/30 text-sm">
                Start reflecting on your progress, learnings, and goals!
              </p>
            </div>
          ) : (
            filteredReflections.map((reflection) => (
              <div
                key={reflection.id}
                className={`p-4 rounded-lg border transition hover:shadow-lg ${getTypeColor(
                  reflection.type,
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {reflection.title}
                    </h3>
                    <p className="text-white/60 text-xs">
                      {new Date(reflection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-2xl ml-2">
                    {getTypeEmoji(reflection.type)}
                  </span>
                </div>

                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {reflection.content}
                </p>

                {reflection.insights && reflection.insights.length > 0 && (
                  <div className="mb-3 p-2 rounded bg-white/5">
                    <p className="text-white/70 text-xs font-semibold mb-1">
                      Key Insights:
                    </p>
                    <ul className="space-y-1">
                      {reflection.insights.slice(0, 2).map((insight, idx) => (
                        <li key={idx} className="text-white/60 text-xs">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="text-white/60 hover:text-white text-sm transition">
                  View Details →
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
