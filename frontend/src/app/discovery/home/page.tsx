"use client"

import { useState, useEffect } from "react"
import { getHomeSuggestions } from "@/lib/discovery"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Suggestion {
  title: string
  description?: string
  difficulty?: string
  estimated_time?: string
}

export default function HomePage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setLoading(true)
      const data = await getHomeSuggestions()
      if (mounted) {
        setSuggestions(data.suggestions || [])
        setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white mb-3">
              🏡 Home Improvement
            </h2>
            <p className="text-white/70">Projects and ideas for your space</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
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
                      <CardTitle className="text-white">{item.title}</CardTitle>
                      {item.difficulty && (
                        <Badge variant="glass">{item.difficulty}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70 mb-2">
                      {item.description}
                    </p>
                    {item.estimated_time && (
                      <p className="text-xs text-white/50">
                        Time: {item.estimated_time}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-white/70">Loading suggestions...</p>
              </CardContent>
            </Card>
          )}

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
