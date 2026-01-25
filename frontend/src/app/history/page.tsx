"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/contexts"
import {
  getConversationHistory,
  searchConversations,
  deleteConversation,
  getConversationStats,
  Conversation,
  ConversationStats,
} from "@/lib/conversations"
import { useCachedData } from "@/lib/cache"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HistoryPage() {
  const router = useRouter()
  const { user, loading: authLoading, token } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState<ConversationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const LIMIT = 20 // Load 20 conversations at a time

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  // Load initial data
  useEffect(() => {
    if (!user || !token) return

    let mounted = true

    async function loadData() {
      setLoading(true)
      try {
        const [historyData, statsData] = await Promise.all([
          getConversationHistory(token as string, selectedAgent, LIMIT),
          getConversationStats(token as string),
        ])

        if (mounted) {
          setConversations(historyData || [])
          setHasMore((historyData || []).length >= LIMIT)
          // Ensure statsData is an object before processing
          if (statsData && typeof statsData === "object") {
            setStats({
              total_conversations: statsData.total_conversations ?? 0,
              total_messages: statsData.total_messages ?? 0,
              agents_used: Array.isArray(statsData.agents_used)
                ? statsData.agents_used
                : [],
            })
          } else {
            setStats(null)
          }
        }
      } catch (error) {
        console.error("Failed to load history:", error)
        if (mounted) setStats(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [user, token, selectedAgent])

  // Load more conversations (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!token || loadingMore || !hasMore || loading) return

    setLoadingMore(true)
    try {
      // In a real implementation, you'd pass an offset/cursor
      // For now, we'll simulate by fetching with increased limit
      const moreData = await getConversationHistory(
        token as string,
        selectedAgent,
        conversations.length + LIMIT,
      )

      if (moreData && moreData.length > conversations.length) {
        setConversations(moreData)
        setHasMore(moreData.length >= conversations.length + LIMIT)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more:", error)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [
    token,
    selectedAgent,
    conversations.length,
    loadingMore,
    hasMore,
    loading,
  ])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [loadMore, loading, hasMore, loadingMore])

  async function handleSearch() {
    if (!token || !searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await searchConversations(token, searchQuery)
      setConversations(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(conversationId: string) {
    if (!token) return

    try {
      await deleteConversation(token, conversationId)
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

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

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="py-6">
                  <div className="text-3xl font-bold text-white">
                    {stats?.total_conversations ?? 0}
                  </div>
                  <div className="text-white/60 text-sm">
                    Total Conversations
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="text-3xl font-bold text-white">
                    {stats?.total_messages ?? 0}
                  </div>
                  <div className="text-white/60 text-sm">Total Messages</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="text-3xl font-bold text-white">
                    {stats?.agents_used?.length ?? 0}
                  </div>
                  <div className="text-white/60 text-sm">Agents Used</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Search your conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="cursor-pointer">
                  Search
                </Button>
                {searchQuery && (
                  <Button
                    variant="glass"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedAgent(undefined)
                      window.location.reload()
                    }}
                    className="cursor-pointer"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversation List */}
          <div className="space-y-4">
            {conversations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-white/60">
                    No conversations yet. Start chatting with an agent!
                  </p>
                  <Link href="/">
                    <Button variant="default" className="mt-4 cursor-pointer">
                      Go to Discovery Hub
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="hover:scale-102 transition-transform"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="glass">{conversation.agent_id}</Badge>
                          <span className="text-white/50 text-sm">
                            {formatDate(conversation.timestamp)}
                          </span>
                        </div>
                        <CardTitle className="text-white text-base mb-2">
                          You: {conversation.user_message.substring(0, 100)}
                          {conversation.user_message.length > 100 ? "..." : ""}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(conversation.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white/70 text-sm">
                        {conversation.agent_response.substring(0, 200)}
                        {conversation.agent_response.length > 200 ? "..." : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && conversations.length > 0 && (
            <div ref={loadMoreRef} className="py-8 text-center">
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white/60">Loading more...</span>
                </div>
              ) : (
                <Button
                  onClick={loadMore}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Load More
                </Button>
              )}
            </div>
          )}

          {conversations.length > 0 && !hasMore && (
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Showing all {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""} • End of history
              </p>
            </div>
          )}
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
