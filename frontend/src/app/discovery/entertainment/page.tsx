"use client"

import { useState, useEffect } from "react"
import { getEntertainmentSuggestions } from "@/lib/discovery"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Suggestion {
  title: string
  description?: string
  rating?: number
  year?: string
}

export default function EntertainmentPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<"movies" | "tv">("movies")
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      const data = await getEntertainmentSuggestions(category)
      if (mounted) {
        setSuggestions(data.suggestions || [])
        setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [category])

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

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">What's Next Up</h1>
              <p className="text-xs text-white/50">Entertainment</p>
            </div>
          </button>
          <Link href="/login">
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white mb-3">
              🎬 What to Watch Next
            </h2>
            <p className="text-white/70">
              Discover trending movies and TV shows picked by AI
            </p>
          </div>

          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as "movies" | "tv")}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>

            <TabsContent value={category}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-white/10 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.map((item, idx) => (
                    <Card
                      key={idx}
                      className="hover:scale-105 transition-transform cursor-pointer"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white">
                            {item.title}
                          </CardTitle>
                          {item.rating && (
                            <Badge variant="glass">⭐ {item.rating}</Badge>
                          )}
                        </div>
                        {item.year && (
                          <CardDescription>{item.year}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/70">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-white/70">
                      No suggestions available at the moment.
                    </p>
                    <p className="text-sm text-white/50 mt-2">
                      AI will generate recommendations shortly.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="glass">← Back to Discovery Hub</Button>
            </Link>
          </div>
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
