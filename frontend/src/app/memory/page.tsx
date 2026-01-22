"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../lib/AuthContext"

type MemoryCategory =
  | "habit"
  | "goal"
  | "fact"
  | "preference"
  | "decision"
  | "chat"

interface Memory {
  id: string
  text: string
  category: MemoryCategory
  created_at: string
}

export default function MemoryPage() {
  const { user, loading } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<
    MemoryCategory | "all"
  >("all")
  const [isLoading, setIsLoading] = useState(false)

  const categories: { name: MemoryCategory; emoji: string; color: string }[] = [
    { name: "habit", emoji: "🔄", color: "from-blue-500" },
    { name: "goal", emoji: "🎯", color: "from-purple-500" },
    { name: "fact", emoji: "💡", color: "from-yellow-500" },
    { name: "preference", emoji: "❤️", color: "from-pink-500" },
    { name: "decision", emoji: "⚖️", color: "from-green-500" },
    { name: "chat", emoji: "💬", color: "from-orange-500" },
  ]

  useEffect(() => {
    if (user && !loading) {
      fetchMemories()
    }
  }, [user, loading, selectedCategory])

  const fetchMemories = async () => {
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()
      
      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/memories`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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

  const filteredMemories =
    selectedCategory === "all"
      ? memories
      : memories.filter((m) => m.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Please log in to view your memories</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Back to chat
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">💭 My Memories</h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to chat
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-8">
        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm font-semibold mb-4">
            Filter by category:
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === "all"
                  ? "bg-white text-gray-900 font-semibold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              All ({memories.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === cat.name
                    ? `bg-gradient-to-r ${cat.color} to-pink-500 text-white font-semibold`
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {cat.emoji} {cat.name} (
                {memories.filter((m) => m.category === cat.name).length})
              </button>
            ))}
          </div>
        </div>

        {/* Memories grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading memories...</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              No memories yet. Chat with me to build your memory!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((memory) => {
              const category = categories.find(
                (c) => c.name === memory.category,
              )
              return (
                <div
                  key={memory.id}
                  className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{category?.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white/90 text-sm">{memory.text}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-white/50">
                          {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/70">
                          {memory.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
