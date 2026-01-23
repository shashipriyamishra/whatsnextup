"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../lib/AuthContext"
import PlanCard from "../../components/PlanCard"

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
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [newGoal, setNewGoal] = useState("")
  const [creatingPlan, setCreatingPlan] = useState(false)
  const [followUp, setFollowUp] = useState("")
  const [suggestedActions, setSuggestedActions] = useState<any[]>([])

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
      setCreatingPlan(true)
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
        const data = await response.json()
        setFollowUp(data.followUp || "")
        setSuggestedActions(data.suggestedActions || [])
        setNewGoal("")
        setShowNewPlan(false)
        setTimeout(() => fetchPlans(), 500)
      }
    } catch (error) {
      console.error("Failed to create plan:", error)
    } finally {
      setCreatingPlan(false)
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">
            Please log in to view plans
          </div>
          <Link href="/" className="text-pink-500 hover:underline">
            Go back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-white hover:text-pink-400 transition"
          >
            <span className="text-2xl">🚀</span>
            <span className="font-bold">whatsnextup</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="text-white/70 hover:text-white transition"
              title="Chat"
            >
              💬
            </Link>
            <span className="text-white/70">📋</span>
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

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-8">
        {/* AI Follow-up notification */}
        {followUp && (
          <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 animate-in fade-in">
            <p className="text-white font-semibold mb-2">🤖 AI Follow-up:</p>
            <p className="text-white/90">{followUp}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedActions.map((action: any, idx: number) => (
                <button
                  key={idx}
                  className="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white transition"
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
                  disabled={creatingPlan}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {creatingPlan ? "Creating..." : "Create Plan"}
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
              <PlanCard
                key={plan.id}
                plan={plan}
                onUpdateStatus={handleUpdateStatus}
                onDeletePlan={handleDeletePlan}
                onCreateSubPlan={handleCreateSubPlan}
                onGetNextSteps={() => fetchPlans()}
                onRefresh={fetchPlans}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
