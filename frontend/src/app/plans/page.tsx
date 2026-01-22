"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../lib/AuthContext"

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
}

export default function PlansPage() {
  const { user, loading } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "completed" | "paused" | "all"
  >("active")
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [newGoal, setNewGoal] = useState("")

  useEffect(() => {
    if (user && !loading) {
      fetchPlans()
    }
  }, [user, loading, selectedStatus])

  const fetchPlans = async () => {
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

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

  const handleCreatePlan = async () => {
    if (!newGoal.trim()) return

    try {
      const token = await user?.getIdToken()

      if (!token) {
        console.error("No auth token available")
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ goal: newGoal }),
        },
      )

      if (response.ok) {
        setNewGoal("")
        setShowNewPlan(false)
        fetchPlans()
      }
    } catch (error) {
      console.error("Failed to create plan:", error)
    }
  }

  const filteredPlans =
    selectedStatus === "all"
      ? plans
      : plans.filter((p) => p.status === selectedStatus)

  const priorityColor = {
    high: "from-red-500",
    medium: "from-yellow-500",
    low: "from-green-500",
  }

  const statusColor = {
    active: "from-blue-500",
    completed: "from-green-500",
    paused: "from-gray-500",
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
          <p className="text-white mb-4">Please log in to view your plans</p>
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
          <h1 className="text-white text-xl font-bold">📋 My Plans</h1>
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
        {/* New plan button */}
        <div className="mb-8">
          {!showNewPlan ? (
            <button
              onClick={() => setShowNewPlan(true)}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
            >
              + Create New Plan
            </button>
          ) : (
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20">
              <textarea
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What's your goal? (e.g., 'Learn React', 'Get fit', 'Build a project')"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
                >
                  Create Plan
                </button>
                <button
                  onClick={() => {
                    setShowNewPlan(false)
                    setNewGoal("")
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm font-semibold mb-4">
            Filter by status:
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg transition ${
                selectedStatus === "all"
                  ? "bg-white text-gray-900 font-semibold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              All ({plans.length})
            </button>
            {["active", "completed", "paused"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setSelectedStatus(status as "active" | "completed" | "paused")
                }
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  selectedStatus === status
                    ? `bg-gradient-to-r ${statusColor[status as keyof typeof statusColor]} to-pink-500 text-white font-semibold`
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {status} ({plans.filter((p) => p.status === status).length})
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
              <div
                key={plan.id}
                className="p-6 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition"
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
                      className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${priorityColor[plan.priority]} to-pink-500 text-white font-semibold capitalize`}
                    >
                      {plan.priority}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${statusColor[plan.status]} to-pink-500 text-white font-semibold capitalize`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </div>

                {/* Steps */}
                {plan.steps && plan.steps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm font-semibold">
                      Steps:
                    </p>
                    {plan.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="pl-4 py-2 border-l-2 border-white/20 text-white/80 text-sm"
                      >
                        <div className="font-medium">
                          {step.step}. {step.action}
                        </div>
                        <div className="text-white/50 text-xs mt-1">
                          Deadline: {step.deadline} • Effort: {step.effort}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs text-white/50">
                  Created: {new Date(plan.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
