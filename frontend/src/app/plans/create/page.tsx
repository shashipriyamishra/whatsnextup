"use client"

import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useState as useState2 } from "react"
import Link from "next/link"
import { getApiUrl } from "@/lib/api"
import EditableField from "@/components/EditableField"
import SuggestionBox from "@/components/SuggestionBox"

interface PlanStep {
  step: number
  action: string
  deadline: string
  effort: "low" | "medium" | "high"
}

interface DraftPlan {
  goal: string
  timeframe: string
  priority: "high" | "medium" | "low"
  steps: PlanStep[]
  potential_challenges: string[]
  resources_needed: string[]
  success_metric: string
  reasoning?: string
  draft_id?: string
}

export default function CreatePlanPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stage, setStage] = useState<"goal" | "draft" | "refine" | "review">(
    "goal",
  )
  const [goalInput, setGoalInput] = useState("")
  const [draft, setDraft] = useState<DraftPlan | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [creatingDraft, setCreatingDraft] = useState(false)
  const [refining, setRefining] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [activeField, setActiveField] = useState<string | null>(null)
  const [fieldSuggestions, setFieldSuggestions] = useState<
    Record<string, any[]>
  >({})

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
          <p className="text-white mb-4">Please log in</p>
          <Link href="/" className="text-purple-400 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const handleCreateDraft = async () => {
    if (!goalInput.trim()) {
      setError("Please enter a goal")
      return
    }

    try {
      setCreatingDraft(true)
      setError("")

      const token = await user?.getIdToken()
      if (!token) return

      const response = await fetch(`${getApiUrl()}/api/plans/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: goalInput }),
      })

      if (!response.ok) {
        throw new Error("Failed to create draft")
      }

      const data = await response.json()
      setDraft(data.draft)
      setHints(data.hints || [])
      setStage("draft")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating draft")
    } finally {
      setCreatingDraft(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    if (!draft) return
    const updatedDraft = { ...draft, [field]: value }
    setDraft(updatedDraft)
  }

  const getSuggestionsForField = async (field: string, value: string) => {
    if (!draft || !value || typeof value !== "string" || !value.trim())
      return []

    try {
      const token = await user?.getIdToken()
      if (!token) return []

      const response = await fetch(`${getApiUrl()}/api/plans/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field,
          currentValue: value,
          context: draft,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const suggestions = data.suggestions || []
        // Return suggestions array
        return Array.isArray(suggestions) ? suggestions : [suggestions]
      }
      return []
    } catch (err) {
      console.error("Error getting suggestions:", err)
      return []
    }
  }

  const handleRefineField = async (field: string, value: string) => {
    if (!draft) return

    try {
      setRefining(true)
      const token = await user?.getIdToken()
      if (!token) return

      const response = await fetch(`${getApiUrl()}/api/plans/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          draft_id: draft.draft_id,
          field,
          value,
          plan_data: draft,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDraft(data.plan)
        setHints(data.hints || [])
        setFieldSuggestions((prev) => ({
          ...prev,
          [field]: data.suggestions || [],
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error refining draft")
    } finally {
      setRefining(false)
    }
  }

  const handleSavePlan = async () => {
    if (!draft) return

    try {
      setSaving(true)
      const token = await user?.getIdToken()
      if (!token) return

      const response = await fetch(`${getApiUrl()}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: draft.goal }),
      })

      if (response.ok) {
        router.push("/plans")
      } else {
        throw new Error("Failed to save plan")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving plan")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/chat"
            className="text-white font-bold text-lg hover:text-pink-400"
          >
            whatsnextup
          </Link>
          <div className="text-white/60">Create Plan</div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            ❌ {error}
          </div>
        )}

        {/* Stage 1: Goal Input */}
        {stage === "goal" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                What do you want to achieve?
              </h1>
              <p className="text-white/60">
                Tell me your goal, and I'll help you create a detailed plan
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="E.g., 'Learn React and build a project', 'Get fit by summer', 'Launch my startup'..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
              />

              <button
                onClick={handleCreateDraft}
                disabled={creatingDraft || !goalInput.trim()}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {creatingDraft ? "Creating your plan..." : "Create Plan Draft"}
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Draft Review */}
        {stage === "draft" && draft && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Plan Draft
              </h2>
              <p className="text-white/60">
                Review the plan below. Click any field to refine it.
              </p>
            </div>

            {/* AI Reasoning */}
            {draft.reasoning && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/30">
                <p className="text-sm text-purple-300">
                  <span className="font-semibold">AI Reasoning:</span>{" "}
                  {draft.reasoning}
                </p>
              </div>
            )}

            {/* Refinement Hints */}
            {hints && hints.length > 0 && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                <p className="text-sm font-semibold text-blue-300 mb-2">
                  Suggestions:
                </p>
                <ul className="space-y-1 text-sm text-blue-200">
                  {hints.map((hint, idx) => (
                    <li key={idx}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editable Fields */}
            <div className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
              <EditableField
                label="Goal"
                value={draft.goal}
                onChange={(val) => handleFieldChange("goal", val)}
                onSuggestionsRequest={() =>
                  getSuggestionsForField("goal", draft.goal)
                }
                placeholder="Your main goal"
              />

              <EditableField
                label="Timeframe"
                value={draft.timeframe}
                onChange={(val) => handleFieldChange("timeframe", val)}
                onSuggestionsRequest={() =>
                  getSuggestionsForField("timeframe", draft.timeframe)
                }
                placeholder="E.g., 4 weeks, 3 months"
              />

              <EditableField
                label="Priority"
                value={draft.priority}
                onChange={(val) => handleFieldChange("priority", val)}
                type="select"
                options={[
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ]}
              />

              <EditableField
                label="Success Metric"
                value={draft.success_metric}
                onChange={(val) => handleFieldChange("success_metric", val)}
                onSuggestionsRequest={() =>
                  getSuggestionsForField("success_metric", draft.success_metric)
                }
                placeholder="How will you know you've succeeded?"
                multiline
                rows={2}
              />
            </div>

            {/* Steps Preview */}
            {draft.steps && draft.steps.length > 0 && (
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-3">Steps:</h3>
                <div className="space-y-2">
                  {draft.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded bg-white/5 border border-white/10"
                    >
                      <div className="font-medium text-white">
                        {step.step}. {step.action}
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {step.deadline} • Effort: {step.effort}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStage("goal")}
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                Back
              </button>
              <button
                onClick={handleSavePlan}
                disabled={saving || refining}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
