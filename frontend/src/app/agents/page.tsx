"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { getAllAgents, Agent } from "@/lib/agents"
import { AgentCard } from "@/components/glass/AgentCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      let mounted = true

      async function loadData() {
        setLoading(true)
        const agentList = await getAllAgents()
        if (mounted) {
          setAgents(agentList)
          setLoading(false)
        }
      }

      loadData()

      return () => {
        mounted = false
      }
    }
  }, [user, authLoading, router])

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

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">What's Next Up</h1>
              <p className="text-xs text-white/50">Your AI Agents</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/memories">
              <Button variant="glass" size="sm">
                🧠 Memories
              </Button>
            </Link>
            <Link href="/plans">
              <Button variant="glass" size="sm">
                📋 Plans
              </Button>
            </Link>
            <Link href="/reflections">
              <Button variant="glass" size="sm">
                💭 Reflect
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 md:px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white mb-3">
              🤖 Your AI Agents
            </h2>
            <p className="text-white/70">
              Specialized AI assistants ready to help you with specific areas of
              your life
            </p>
          </div>

          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  icon={agent.icon}
                  name={agent.name}
                  description={agent.description}
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
              <Button variant="default">Back to Chat</Button>
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
