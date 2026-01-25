"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { useAuth } from "@/components/contexts"
import { useRouter } from "next/navigation"
import { getAllAgents, Agent } from "@/lib/agents"
import { AgentCard } from "@/components/glass/AgentCard"
import { Button } from "@/components/ui/button"
import { useCachedData } from "@/lib/cache"
import Link from "next/link"

export default function AgentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const {
    data: agents,
    loading,
    refresh: refreshAgents,
  } = useCachedData("getAllAgents", () => getAllAgents(), {
    initialState: [] as Agent[],
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
  }, [authLoading, user, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden pt-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-black text-white mb-3">
                🤖 Your AI Agents
              </h2>
              <p className="text-white/70">
                Specialized AI assistants ready to help you with specific areas
                of your life
              </p>
            </div>

            {/* Loading skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-black/95 relative overflow-hidden pt-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/50 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-white mb-3">
                🤖 Your AI Agents
              </h2>
              <p className="text-white/70">
                Specialized AI assistants ready to help you with specific areas
                of your life
              </p>
            </div>
            <Button
              onClick={() => refreshAgents(true)}
              disabled={loading}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Refreshing...
                </span>
              ) : (
                <span className="flex items-center gap-2">🔄 Refresh</span>
              )}
            </Button>
          </div>

          {agents && agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent, index) => (
                <AgentCard
                  key={agent.id}
                  icon={agent.icon}
                  name={agent.name}
                  description={agent.description}
                  gradientIndex={index}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-white/70">No agents available yet.</p>
            </div>
          )}

          <div className="mt-12 p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              More agents coming soon! 🚀
            </h3>
            <p className="text-white/70 mb-6">
              We're constantly adding new specialized AI agents to help you with
              every aspect of your life.
            </p>
            <Link href="/">
              <Button variant="default" className="cursor-pointer">
                Back to Chat
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
