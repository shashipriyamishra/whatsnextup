"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { getApiUrl } from "@/lib/api"
import EditableField from "@/components/EditableField"
import SuggestionBox from "@/components/SuggestionBox"

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

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})
  const [error, setError] = useState("")
  const [planId, setPlanId] = useState<string | null>(null)

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => setPlanId(p.id))
  }, [params])

  useEffect(() => {
    if (user && !loading && planId) {
      fetchPlan()
    }
  }, [user, loading, planId])

  const fetchPlan = async () => {
    if (!planId) return
    
    try {
      setIsLoading(true)
      const token = await user?.getIdToken()

      if (!token) {
        setError("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/plans/${planId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPlan(data)
      } else {
        setError("Failed to load plan")
      }
    } catch (err) {
      setError("Error loading plan")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetSuggestions = async (field: string, value: string) => {
    if (!value || typeof value !== "string" || !value.trim()) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }))
      return
    }

    try {
      const token = await user?.getIdToken()
      if (!token || !plan) return

      const response = await fetch(`${getApiUrl()}/api/plans/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field,
          value,
          context: plan,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions((prev) => ({
          ...prev,
          [field]: data.suggestions || [],
        }))
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err)
    }
  }

  const handleFieldChange = (field: keyof Plan, value: any) => {
    if (plan) {
      setPlan((prev) => (prev ? { ...prev, [field]: value } : null))
      handleGetSuggestions(field, typeof value === "string" ? value : "")
    }
  }

  const handleSavePlan = async () => {
    if (!plan) return

    try {
      setIsSaving(true)
      setError("")
      const token = await user?.getIdToken()

      if (!token) {
        setError("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          goal: plan.goal,
          timeframe: plan.timeframe,
          priority: plan.priority,
          steps: plan.steps,
          status: plan.status,
          success_metric: plan.success_metric,
        }),
      })

      if (response.ok) {
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to save plan")
      }
    } catch (err) {
      setError("Error saving plan")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "text-red-400",
      medium: "text-yellow-400",
      low: "text-green-400",
    }
    return colors[priority] || "text-gray-400"
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link
              href="/plans"
              className="flex items-center gap-2 text-white hover:text-pink-400 transition"
            >
              ← Back to Plans
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <p className="text-white/50 mb-4">Plan not found</p>
            <Link href="/plans" className="text-pink-400 hover:text-pink-300">
              Back to Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/plans"
            className="flex items-center gap-2 text-white hover:text-pink-400 transition"
          >
            <span className="text-2xl">🚀</span>
            <span className="font-bold">whatsnextup</span>
          </Link>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="text-white/70 hover:text-white transition"
            >
              Close Editor
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-8">
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300">
            {error}
          </div>
        )}

        {!isEditing ? (
          // View mode
          <div>
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {plan.goal}
                  </h1>
                  <div className="flex gap-4 text-sm text-white/60">
                    <span>⏱️ {plan.timeframe}</span>
                    <span
                      className={`font-semibold ${getPriorityColor(plan.priority)}`}
                    >
                      {plan.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="capitalize px-3 py-1 rounded-full bg-white/10">
                      {plan.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  ✏️ Edit Plan
                </button>
              </div>
            </div>

            {/* Success metric */}
            {plan.success_metric && (
              <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-400/30">
                <p className="text-green-300 font-semibold mb-2">
                  Success Metric
                </p>
                <p className="text-white">{plan.success_metric}</p>
              </div>
            )}

            {/* Steps */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                📋 Action Steps
              </h2>
              <div className="space-y-3">
                {plan.steps.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {step.step}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-2">
                          {step.action}
                        </p>
                        <div className="flex gap-4 text-sm text-white/60">
                          <span>📅 {step.deadline}</span>
                          <span>⚡ {step.effort} effort</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential challenges */}
            {plan.potential_challenges &&
              plan.potential_challenges.length > 0 && (
                <div className="mb-8 p-4 rounded-lg bg-orange-500/10 border border-orange-400/30">
                  <p className="text-orange-300 font-semibold mb-3">
                    ⚠️ Potential Challenges
                  </p>
                  <ul className="space-y-2">
                    {plan.potential_challenges.map((challenge, idx) => (
                      <li key={idx} className="text-white/80">
                        • {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Resources needed */}
            {plan.resources_needed && plan.resources_needed.length > 0 && (
              <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                <p className="text-blue-300 font-semibold mb-3">
                  📦 Resources Needed
                </p>
                <ul className="space-y-2">
                  {plan.resources_needed.map((resource, idx) => (
                    <li key={idx} className="text-white/80">
                      • {resource}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // Edit mode
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
              Edit Your Plan
            </h1>

            <div className="p-8 rounded-lg bg-white/5 border border-white/10 space-y-6">
              {/* Goal */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Goal
                </label>
                <input
                  type="text"
                  value={plan.goal}
                  onChange={(e) => handleFieldChange("goal", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                />
                <SuggestionBox
                  suggestions={suggestions["goal"] || []}
                  loading={false}
                  onApply={(suggestion) =>
                    handleFieldChange("goal", suggestion)
                  }
                  field="goal"
                />
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Timeframe
                </label>
                <input
                  type="text"
                  value={plan.timeframe}
                  onChange={(e) =>
                    handleFieldChange("timeframe", e.target.value)
                  }
                  placeholder="e.g., 3 months, 6 weeks"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Priority
                </label>
                <select
                  value={plan.priority}
                  onChange={(e) =>
                    handleFieldChange(
                      "priority",
                      e.target.value as "high" | "medium" | "low",
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Status
                </label>
                <select
                  value={plan.status}
                  onChange={(e) =>
                    handleFieldChange(
                      "status",
                      e.target.value as "active" | "completed" | "paused",
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="active">✅ Active</option>
                  <option value="completed">🎉 Completed</option>
                  <option value="paused">⏸️ Paused</option>
                </select>
              </div>

              {/* Success metric */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Success Metric
                </label>
                <textarea
                  value={plan.success_metric || ""}
                  onChange={(e) =>
                    handleFieldChange("success_metric", e.target.value)
                  }
                  placeholder="How will you know this plan is successful?"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 resize-none"
                  rows={3}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
