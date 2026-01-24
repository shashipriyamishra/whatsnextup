"use client"

import { useState, useEffect } from "react"
import { getPersonalizedFeed, PersonalizedFeed } from "@/lib/trending"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

export default function TrendingPage() {
  const [feed, setFeed] = useState<PersonalizedFeed>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function loadFeed() {
      setLoading(true)
      // Try to get user location (simplified)
      const feedData = await getPersonalizedFeed()
      if (mounted) {
        setFeed(feedData)
        setLoading(false)
      }
    }

    loadFeed()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
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

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden">
      <Header />
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
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">What's Trending</h1>
              <p className="text-xs text-white/50">
                Stay informed & entertained
              </p>
            </div>
          </button>
          <Link href="/login">
            <Button variant="default" size="sm" className="cursor-pointer">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reddit">Reddit</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              {feed.youtube && (
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              )}
              {feed.news && <TabsTrigger value="news">News</TabsTrigger>}
            </TabsList>

            {/* All Feed */}
            <TabsContent value="all">
              <div className="space-y-8">
                {/* Weather */}
                {feed.weather && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      🌤️ Weather
                    </h2>
                    <Card>
                      <CardContent className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">
                            {getWeatherEmoji(feed.weather.description)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {Math.round(feed.weather.temperature)}°C
                            </h3>
                            <p className="text-white/70">
                              {feed.weather.city}, {feed.weather.country}
                            </p>
                            <p className="text-white/60 capitalize">
                              {feed.weather.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Reddit */}
                {feed.reddit && feed.reddit.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      🔴 Trending on Reddit
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feed.reddit.slice(0, 4).map((post, idx) => (
                        <Card
                          key={idx}
                          className={`hover:scale-105 transition-transform cursor-pointer ${
                            [
                              "bg-red-50 border-red-200 hover:bg-red-100",
                              "bg-blue-50 border-blue-200 hover:bg-blue-100",
                              "bg-orange-50 border-orange-200 hover:bg-orange-100",
                              "bg-pink-50 border-pink-200 hover:bg-pink-100",
                            ][idx % 4]
                          }`}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-gray-900 text-base">
                                {post.title}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="glass">r/{post.subreddit}</Badge>
                              <Badge variant="glass">↑ {post.upvotes}</Badge>
                              <Badge variant="glass">💬 {post.comments}</Badge>
                            </div>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 text-sm hover:underline"
                            >
                              View on Reddit →
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Hacker News */}
                {feed.tech && feed.tech.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      🔶 Top on Hacker News
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feed.tech.slice(0, 4).map((story, idx) => (
                        <Card
                          key={idx}
                          className="hover:scale-105 transition-transform cursor-pointer"
                        >
                          <CardHeader>
                            <CardTitle className="text-white text-base">
                              {story.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="glass">⭐ {story.score}</Badge>
                              <Badge variant="glass">💬 {story.comments}</Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-2">
                              by {story.author}
                            </p>
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 text-sm hover:underline"
                            >
                              Read More →
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* GitHub */}
                {feed.github && feed.github.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      ⭐ Trending on GitHub
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feed.github.slice(0, 4).map((repo, idx) => (
                        <Card
                          key={idx}
                          className="hover:scale-105 transition-transform cursor-pointer"
                        >
                          <CardHeader>
                            <CardTitle className="text-white text-base">
                              {repo.full_name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white/70 text-sm mb-2">
                              {repo.description}
                            </p>
                            <div className="flex gap-2 mb-2">
                              {repo.language && (
                                <Badge variant="glass">{repo.language}</Badge>
                              )}
                              <Badge variant="glass">⭐ {repo.stars}</Badge>
                              <Badge variant="glass">
                                🔥 {repo.stars_today} today
                              </Badge>
                            </div>
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 text-sm hover:underline"
                            >
                              View on GitHub →
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </TabsContent>

            {/* Individual Tabs */}
            <TabsContent value="reddit">
              {feed.reddit && feed.reddit.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feed.reddit.map((post, idx) => (
                    <Card
                      key={idx}
                      className={`hover:scale-105 transition-transform ${
                        [
                          "bg-red-50 border-red-200 hover:bg-red-100",
                          "bg-blue-50 border-blue-200 hover:bg-blue-100",
                          "bg-orange-50 border-orange-200 hover:bg-orange-100",
                        ][idx % 3]
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-base">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="glass">r/{post.subreddit}</Badge>
                          <Badge variant="glass">↑ {post.upvotes}</Badge>
                        </div>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:text-blue-800 font-semibold"
                        >
                          View →
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tech">
              {feed.tech && feed.tech.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feed.tech.map((story, idx) => (
                    <Card
                      key={idx}
                      className={`hover:scale-105 transition-transform ${
                        [
                          "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
                          "bg-purple-50 border-purple-200 hover:bg-purple-100",
                          "bg-green-50 border-green-200 hover:bg-green-100",
                        ][idx % 3]
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-base">
                          {story.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="glass">⭐ {story.score}</Badge>
                          <Badge variant="glass">💬 {story.comments}</Badge>
                        </div>
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:text-blue-800 font-semibold"
                        >
                          Read →
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="github">
              {feed.github && feed.github.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feed.github.map((repo, idx) => (
                    <Card
                      key={idx}
                      className={`hover:scale-105 transition-transform ${
                        [
                          "bg-gray-100 border-gray-300 hover:bg-gray-200",
                          "bg-slate-100 border-slate-300 hover:bg-slate-200",
                          "bg-zinc-100 border-zinc-300 hover:bg-zinc-200",
                        ][idx % 3]
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-base">
                          {repo.full_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                          {repo.description}
                        </p>
                        <div className="flex gap-2">
                          {repo.language && (
                            <Badge variant="glass">{repo.language}</Badge>
                          )}
                          <Badge variant="glass">⭐ {repo.stars}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="youtube">
              {feed.youtube && feed.youtube.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feed.youtube.map((video, idx) => (
                    <Card
                      key={idx}
                      className={`hover:scale-105 transition-transform overflow-hidden ${
                        [
                          "bg-red-50 border-red-200 hover:bg-red-100",
                          "bg-rose-50 border-rose-200 hover:bg-rose-100",
                          "bg-pink-50 border-pink-200 hover:bg-pink-100",
                        ][idx % 3]
                      }`}
                    >
                      {video.thumbnail && (
                        <div className="relative h-40 bg-white/10">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-base line-clamp-2">
                          {video.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm mb-2">
                          {video.channel}
                        </p>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="glass">👁️ {video.views.toLocaleString()}</Badge>
                          <Badge variant="glass">👍 {video.likes.toLocaleString()}</Badge>
                        </div>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 text-sm hover:text-red-800 font-semibold"
                        >
                          Watch on YouTube →
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="glass" className="cursor-pointer">
                ← Back to Discovery Hub
              </Button>
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

function getWeatherEmoji(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("clear")) return "☀️"
  if (desc.includes("cloud")) return "☁️"
  if (desc.includes("rain")) return "🌧️"
  if (desc.includes("storm")) return "⛈️"
  if (desc.includes("snow")) return "❄️"
  if (desc.includes("fog") || desc.includes("mist")) return "🌫️"
  return "🌤️"
}
