"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { getApiUrl } from "@/lib/api"
import { Header } from "@/components/Header"

interface PlanStep {
  step: number
  action: string
  deadline: string
  effort: string
}

interface Plan {
  id: string
  goal: string
  timeframe: string
  priority: "high" | "medium" | "low"
  steps: PlanStep[]
  status: "active" | "completed" | "paused"
  created_at: string
  potential_challenges?: string[]
  resources_needed?: string[]
  success_metric?: string
}

export default function PlansPage() {
  const { user, loading } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "completed" | "paused" | "all"
  >("active")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      fetchPlans()
    }
  }, [user, loading])

  const fetchPlans = async () => {
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/plans`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId))
  }

  const handleUpdateStatus = (planId: string, status: string) => {
    setPlans(
      plans.map((p) => (p.id === planId ? { ...p, status: status as any } : p)),
    )
  }

  const handleCreateSubPlan = () => {
    // Plan is created, UI will refresh
  }

  const filteredPlans =
    selectedStatus === "all"
      ? plans
      : plans.filter((p) => p.status === selectedStatus)

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
              <span className="text-white font-bold">📋</span>
              <Link
                href="/reflections"
                className="text-white/70 hover:text-white transition"
                title="Reflections"
              >
                💭
              </Link>
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

  if (!user) {
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
              <span className="text-white font-bold">📋</span>
              <Link
                href="/reflections"
                className="text-white/70 hover:text-white transition"
                title="Reflections"
              >
                💭
              </Link>
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
          <div className="text-center">
            <div className="text-white text-xl mb-4">
              Please log in to view plans
            </div>
            <Link href="/" className="text-pink-500 hover:underline">
              Go back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/95 relative overflow-hidden">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-8">
        {/* New plan button */}
        <div className="mb-8">
          <Link href="/plans/create" className="block">
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition">
              + Create New Plan with AI
            </button>
          </Link>
        </div>

        {/* Status filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm font-semibold mb-4">
            Filter by status:
          </h2>
          <div className="flex flex-wrap gap-2">
            {["active", "completed", "paused", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as any)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/10 text-white/70 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plans list */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              No plans yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="block p-6 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition hover:bg-white/15"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {plan.goal}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Timeframe: {plan.timeframe}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${
                        plan.priority === "high"
                          ? "from-red-500"
                          : plan.priority === "medium"
                            ? "from-yellow-500"
                            : "from-green-500"
                      } to-pink-500 text-white font-semibold capitalize`}
                    >
                      {plan.priority}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${
                        plan.status === "active"
                          ? "from-blue-500"
                          : plan.status === "completed"
                            ? "from-green-500"
                            : "from-gray-500"
                      } to-pink-500 text-white font-semibold capitalize`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </div>

                {plan.steps && plan.steps.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-white/80 text-sm font-semibold">
                      Steps: {plan.steps.length}
                    </p>
                    <div className="flex gap-2">
                      {plan.steps.slice(0, 3).map((step, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-white/10 text-white/70"
                        >
                          {step.action}
                        </span>
                      ))}
                      {plan.steps.length > 3 && (
                        <span className="text-xs px-2 py-1 text-white/50">
                          +{plan.steps.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-white/50 mt-4 pt-4 border-t border-white/10">
                  Created: {new Date(plan.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
