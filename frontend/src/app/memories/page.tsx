"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/contexts"
import { getApiUrl } from "@/lib/api"
import { Header } from "@/components/Header"

interface Memory {
  id: string
  title?: string
  text?: string
  content?: string
  category:
    | "learning"
    | "achievement"
    | "challenge"
    | "insight"
    | "preference"
    | "decision"
    | "chat"
  tags?: string[]
  date?: string
  status?: "active" | "archived"
  created_at: string
}

export default function MemoriesPage() {
  const { user, loading } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      fetchMemories()
    }
  }, [user, loading])

  const fetchMemories = async () => {
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/memories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      learning: "bg-blue-500/20 border-blue-400/50 text-blue-300",
      achievement: "bg-green-500/20 border-green-400/50 text-green-300",
      challenge: "bg-orange-500/20 border-orange-400/50 text-orange-300",
      insight: "bg-purple-500/20 border-purple-400/50 text-purple-300",
      preference: "bg-pink-500/20 border-pink-400/50 text-pink-300",
      decision: "bg-cyan-500/20 border-cyan-400/50 text-cyan-300",
      chat: "bg-gray-500/20 border-gray-400/50 text-gray-300",
    }
    return colors[category] || colors.learning
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      learning: "📚",
      achievement: "🎉",
      challenge: "💪",
      insight: "💡",
      preference: "❤️",
      decision: "🎯",
      chat: "💬",
    }
    return emojis[category] || "📝"
  }

  const filteredMemories =
    selectedCategory === "all"
      ? memories
      : memories.filter((m) => m.category === selectedCategory)

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
              <Link
                href="/reflections"
                className="text-white/70 hover:text-white transition"
                title="Reflections"
              >
                💭
              </Link>
              <span className="text-white font-bold">🧠</span>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-8">
        {/* Create new memory button */}
        <div className="mb-8">
          <Link href="/memories/create" className="block">
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition">
              + Add New Memory with AI
            </button>
          </Link>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm font-semibold mb-4">
            Filter by category:
          </h2>
          <div className="flex flex-wrap gap-2">
            {["all", "learning", "achievement", "challenge", "insight"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  }`}
                >
                  {category === "all"
                    ? "All Memories"
                    : `${getCategoryEmoji(category)} ${
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }`}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Memories grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMemories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white/50 mb-4">No memories yet</p>
              <p className="text-white/30 text-sm">
                Start capturing your learning moments, achievements, and
                insights!
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className={`p-4 rounded-lg border transition hover:shadow-lg ${getCategoryColor(
                  memory.category,
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {memory.title && (
                      <h3 className="text-white font-semibold mb-1">
                        {memory.title}
                      </h3>
                    )}
                    <p className="text-white/60 text-xs">
                      {new Date(memory.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-2xl ml-2">
                    {getCategoryEmoji(memory.category)}
                  </span>
                </div>

                <p className="text-white/80 text-sm mb-3 line-clamp-3">
                  {memory.text || memory.content || "No content"}
                </p>

                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {memory.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded bg-white/10 text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
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
