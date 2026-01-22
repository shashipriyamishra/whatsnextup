"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../lib/AuthContext"

interface Reflection {
  id: string
  title: string
  content: string
  insights: string[]
  created_at: string
  mood: string
}

export default function ReflectionPage() {
  const { user, loading } = useAuth()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewReflection, setShowNewReflection] = useState(false)
  const [newReflection, setNewReflection] = useState("")

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/reflections`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

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

  const handleCreateReflection = async () => {
    if (!newReflection.trim()) return

    try {
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/reflections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newReflection }),
        },
      )

      if (response.ok) {
        setNewReflection("")
        setShowNewReflection(false)
        fetchReflections()
      }
    } catch (error) {
      console.error("Failed to create reflection:", error)
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moods: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      thoughtful: "🤔",
      energetic: "⚡",
      calm: "😌",
      confused: "😕",
      motivated: "💪",
      grateful: "🙏",
    }
    return moods[mood] || "💭"
  }

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
          <p className="text-white mb-4">
            Please log in to view your reflections
          </p>
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
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">🪞 My Reflections</h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to chat
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 pt-32 pb-8">
        {/* New reflection button */}
        <div className="mb-8">
          {!showNewReflection ? (
            <button
              onClick={() => setShowNewReflection(true)}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
            >
              + Start Reflection
            </button>
          ) : (
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur border border-white/20">
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  What are you reflecting on?
                </label>
                <textarea
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  placeholder="Share your thoughts, learnings, or insights..."
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none"
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateReflection}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
                >
                  Save Reflection
                </button>
                <button
                  onClick={() => {
                    setShowNewReflection(false)
                    setNewReflection("")
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reflections list */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading reflections...</p>
          </div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              No reflections yet. Start your first reflection!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="p-6 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {getMoodEmoji(reflection.mood)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {reflection.title || "Reflection"}
                      </h3>
                      <span className="text-xs text-white/50">
                        {new Date(reflection.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/80 mb-3 leading-relaxed">
                      {reflection.content}
                    </p>

                    {/* Insights */}
                    {reflection.insights && reflection.insights.length > 0 && (
                      <div className="mt-4">
                        <p className="text-white/60 text-xs font-semibold mb-2">
                          Key Insights:
                        </p>
                        <div className="space-y-1">
                          {reflection.insights.map((insight, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-white/70 pl-3 border-l-2 border-pink-500/50"
                            >
                              • {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mood badge */}
                    {reflection.mood && (
                      <div className="mt-4">
                        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 capitalize">
                          Mood: {reflection.mood}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
