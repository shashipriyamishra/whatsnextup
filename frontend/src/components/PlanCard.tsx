"use client"

import { useState } from "react"
import { useAuth } from "../lib/AuthContext"

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

interface PlanCardProps {
  plan: Plan
  onUpdateStatus: (planId: string, status: string) => void
  onDeletePlan: (planId: string) => void
  onCreateSubPlan: (planId: string, step: PlanStep) => void
  onGetNextSteps: (planId: string) => void
  onRefresh: () => void
}

export default function PlanCard({
  plan,
  onUpdateStatus,
  onDeletePlan,
  onCreateSubPlan,
  onGetNextSteps,
  onRefresh,
}: PlanCardProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedStep, setSelectedStep] = useState<PlanStep | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showNextSteps, setShowNextSteps] = useState(false)
  const [nextSteps, setNextSteps] = useState<string[]>([])
  const [loadingNextSteps, setLoadingNextSteps] = useState(false)

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return

    try {
      setIsDeleting(true)
      const token = await user?.getIdToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans/${plan.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.ok) {
        onDeletePlan(plan.id)
      }
    } catch (error) {
      console.error("Failed to delete plan:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans/${plan.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      )
      if (response.ok) {
        onUpdateStatus(plan.id, newStatus)
        onRefresh()
      }
    } catch (error) {
      console.error("Failed to update plan status:", error)
    }
  }

  const handleToggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber)
    } else {
      newCompleted.add(stepNumber)
    }
    setCompletedSteps(newCompleted)
  }

  const handleCreateSubPlan = async (step: PlanStep) => {
    setSelectedStep(step)
    try {
      const token = await user?.getIdToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans/${plan.id}/subplans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ step: step.action }),
        },
      )
      if (response.ok) {
        const data = await response.json()
        alert(`✅ Sub-plan created! ${data.message}`)
        onCreateSubPlan(plan.id, step)
        onRefresh()
      }
    } catch (error) {
      console.error("Failed to create sub-plan:", error)
    }
  }

  const handleGetNextSteps = async () => {
    try {
      setLoadingNextSteps(true)
      const token = await user?.getIdToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/plans/${plan.id}/next-steps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setNextSteps(data.next_actions)
        setShowNextSteps(true)
      }
    } catch (error) {
      console.error("Failed to get next steps:", error)
    } finally {
      setLoadingNextSteps(false)
    }
  }

  return (
    <div className="p-6 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{plan.goal}</h3>
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

      {/* Steps with checkboxes */}
      {plan.steps && plan.steps.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-white/80 text-sm font-semibold">Steps:</p>
          {plan.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded bg-white/5"
            >
              <input
                type="checkbox"
                checked={completedSteps.has(step.step)}
                onChange={() => handleToggleStep(step.step)}
                className="mt-1 w-4 h-4 accent-pink-500"
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    completedSteps.has(step.step)
                      ? "line-through text-white/50"
                      : "text-white"
                  }`}
                >
                  {step.step}. {step.action}
                </div>
                <div className="text-white/50 text-xs mt-1">
                  Deadline: {step.deadline} • Effort: {step.effort}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expandable details */}
      {isExpanded && (
        <>
          {plan.potential_challenges &&
            plan.potential_challenges.length > 0 && (
              <div className="mb-4 p-3 rounded bg-white/5 border border-white/10">
                <p className="text-white/80 text-sm font-semibold mb-2">
                  Potential Challenges:
                </p>
                <ul className="space-y-1">
                  {plan.potential_challenges.map((challenge, idx) => (
                    <li key={idx} className="text-white/70 text-sm">
                      • {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {plan.resources_needed && plan.resources_needed.length > 0 && (
            <div className="mb-4 p-3 rounded bg-white/5 border border-white/10">
              <p className="text-white/80 text-sm font-semibold mb-2">
                Resources Needed:
              </p>
              <ul className="space-y-1">
                {plan.resources_needed.map((resource, idx) => (
                  <li key={idx} className="text-white/70 text-sm">
                    • {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.success_metric && (
            <div className="mb-4 p-3 rounded bg-white/5 border border-white/10">
              <p className="text-white/80 text-sm font-semibold mb-2">
                Success Metric:
              </p>
              <p className="text-white/70 text-sm">{plan.success_metric}</p>
            </div>
          )}
        </>
      )}

      {/* Next steps modal */}
      {showNextSteps && (
        <div className="mb-4 p-4 rounded bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold flex items-center gap-2">
              🤖 AI Suggested Next Steps
            </p>
            <button
              onClick={() => setShowNextSteps(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="text-white/80 text-sm">
                {idx + 1}. {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 px-3 py-2 rounded text-sm bg-white/10 hover:bg-white/20 text-white transition"
          title="View full details"
        >
          {isExpanded ? "✕ Hide Details" : "📖 Details"}
        </button>

        <button
          onClick={() =>
            handleStatusChange(
              plan.status === "active" ? "completed" : "active",
            )
          }
          className="flex-1 px-3 py-2 rounded text-sm bg-green-500/20 hover:bg-green-500/30 text-green-300 transition"
          title="Mark as complete or reactivate"
        >
          {plan.status === "active" ? "✅ Complete" : "↩️ Reactivate"}
        </button>

        <button
          onClick={handleGetNextSteps}
          className="flex-1 px-3 py-2 rounded text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition disabled:opacity-50"
          disabled={loadingNextSteps}
          title="Get AI suggestions for next actions"
        >
          {loadingNextSteps ? "⏳ Loading..." : "🤖 Next Steps"}
        </button>

        {plan.steps && plan.steps.length > 0 && (
          <button
            onClick={() => handleCreateSubPlan(plan.steps[0])}
            className="flex-1 px-3 py-2 rounded text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition"
            title="Break down a step into smaller tasks"
          >
            ➕ Sub-Plan
          </button>
        )}

        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 rounded text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 transition disabled:opacity-50"
          disabled={isDeleting}
          title="Delete this plan"
        >
          {isDeleting ? "🗑️ Deleting..." : "🗑️ Delete"}
        </button>
      </div>

      <div className="mt-3 text-xs text-white/50">
        Created: {new Date(plan.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}
