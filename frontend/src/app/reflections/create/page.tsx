"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/contexts"
import { getApiUrl } from "@/lib/api"
import SuggestionBox from "@/components/SuggestionBox"

interface ReflectionDraft {
  title: string
  content: string
  type: "daily" | "weekly" | "monthly" | "goal-review"
  insights: string[]
  next_actions: string[]
}

interface DraftResponse {
  draft: ReflectionDraft
  hints: string[]
  message: string
}

export default function CreateReflectionPage() {
  const { user, loading } = useAuth()
  const [stage, setStage] = useState<"input" | "draft">("input")
  const [reflectionTitle, setReflectionTitle] = useState("")
  const [reflectionContent, setReflectionContent] = useState("")
  const [draft, setDraft] = useState<ReflectionDraft | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})
  const [loadingSuggestions, setLoadingSuggestions] = useState<
    Record<string, boolean>
  >({})
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleCreateDraft = async () => {
    if (
      !reflectionTitle ||
      !reflectionContent ||
      !reflectionTitle.trim() ||
      !reflectionContent.trim()
    ) {
      setError("Please enter both title and content")
      return
    }

    try {
      setIsCreating(true)
      setError("")
      const token = await user?.getIdToken()

      if (!token) {
        setError("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/reflections/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: reflectionTitle,
          content: reflectionContent,
        }),
      })

      if (response.ok) {
        const data: DraftResponse = await response.json()
        setDraft(data.draft)
        setHints(data.hints || [])
        setStage("draft")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to create draft")
      }
    } catch (err) {
      setError("Error creating reflection draft")
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleGetSuggestions = async (field: string, value: string) => {
    if (!value || typeof value !== "string" || !value.trim()) {
      return []
    }

    try {
      setLoadingSuggestions((prev) => ({ ...prev, [field]: true }))
      const token = await user?.getIdToken()
      if (!token) return []

      const response = await fetch(
        `${getApiUrl()}/api/reflections/suggestions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            field,
            value,
            context: draft,
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const suggestions_data = data.suggestions || []
        setSuggestions((prev) => ({
          ...prev,
          [field]: Array.isArray(suggestions_data)
            ? suggestions_data
            : [suggestions_data],
        }))
        return Array.isArray(suggestions_data)
          ? suggestions_data
          : [suggestions_data]
      }
      return []
    } catch (err) {
      console.error("Error fetching suggestions:", err)
      return []
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleFieldChange = (field: keyof ReflectionDraft, value: any) => {
    if (draft) {
      setDraft((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  const handleSaveReflection = async () => {
    if (!draft) return

    try {
      setIsSaving(true)
      setError("")
      const token = await user?.getIdToken()

      if (!token) {
        setError("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/reflections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      })

      if (response.ok) {
        // Success - redirect to reflections page
        window.location.href = "/reflections"
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to save reflection")
      }
    } catch (err) {
      setError("Error saving reflection")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/reflections"
            className="flex items-center gap-2 text-white hover:text-pink-400 transition"
          >
            <span className="text-2xl">🚀</span>
            <span className="font-bold">whatsnextup</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-8">
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300">
            {error}
          </div>
        )}

        {stage === "input" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">
              Start Your Reflection
            </h1>
            <p className="text-white/60 text-center mb-8">
              Reflect on your day, week, or goals. AI will analyze and provide
              insights.
            </p>

            <div className="p-8 rounded-lg bg-white/5 border border-white/10">
              <label className="block text-white font-semibold mb-3">
                Reflection Title
              </label>
              <input
                type="text"
                value={reflectionTitle}
                onChange={(e) => setReflectionTitle(e.target.value)}
                placeholder="e.g., Daily Reflection, Weekly Review, Month-End Goals"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 mb-6"
              />

              <label className="block text-white font-semibold mb-3">
                Content
              </label>
              <textarea
                value={reflectionContent}
                onChange={(e) => setReflectionContent(e.target.value)}
                placeholder="What's on your mind? What did you accomplish? What challenges did you face? What did you learn?"
                className="w-full px-4 py-3 rounded-lg bg-white border border-white/20 text-black placeholder-gray-400 focus:outline-none focus:border-white/40 resize-none mb-6"
                rows={6}
              />

              <button
                onClick={handleCreateDraft}
                disabled={
                  isCreating ||
                  !reflectionTitle ||
                  !reflectionContent ||
                  !reflectionTitle.trim() ||
                  !reflectionContent.trim()
                }
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isCreating ? "Creating Draft..." : "Create Reflection Draft"}
              </button>
            </div>
          </div>
        )}

        {stage === "draft" && draft && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">
              Review Your Reflection
            </h1>
            <p className="text-white/60 text-center mb-8">
              AI has analyzed your reflection. You can refine the insights and
              actions.
            </p>

            <div className="p-8 rounded-lg bg-white/5 border border-white/10 space-y-6">
              {/* Type */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Reflection Type
                </label>
                <select
                  value={draft.type}
                  onChange={(e) =>
                    handleFieldChange(
                      "type",
                      e.target.value as ReflectionDraft["type"],
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="daily">📅 Daily Reflection</option>
                  <option value="weekly">📊 Weekly Review</option>
                  <option value="monthly">📈 Monthly Review</option>
                  <option value="goal-review">🎯 Goal Review</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-semibold">
                    Title
                  </label>
                  {draft?.content && (
                    <button
                      onClick={() => handleGetSuggestions("title", draft.title)}
                      disabled={loadingSuggestions["title"]}
                      className="text-lg hover:scale-110 transition disabled:opacity-50"
                      title="Get AI suggestions"
                    >
                      ✨
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                />
                <SuggestionBox
                  suggestions={suggestions["title"] || []}
                  loading={loadingSuggestions["title"] || false}
                  onApply={(suggestion) =>
                    handleFieldChange("title", suggestion)
                  }
                  field="title"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-semibold">
                    Content
                  </label>
                  {draft?.content && (
                    <button
                      onClick={() =>
                        handleGetSuggestions("content", draft.content)
                      }
                      disabled={loadingSuggestions["content"]}
                      className="text-lg hover:scale-110 transition disabled:opacity-50"
                      title="Get AI suggestions"
                    >
                      ✨
                    </button>
                  )}
                </div>
                <textarea
                  value={draft.content}
                  onChange={(e) => handleFieldChange("content", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-white/20 text-black focus:outline-none focus:border-white/40 resize-none"
                  rows={6}
                />
                <SuggestionBox
                  suggestions={suggestions["content"] || []}
                  loading={loadingSuggestions["content"] || false}
                  onApply={(suggestion) =>
                    handleFieldChange("content", suggestion)
                  }
                  field="content"
                />
              </div>

              {/* Key Insights */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Key Insights
                </label>
                <div className="space-y-2 mb-3">
                  {draft.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-purple-500/20 border border-purple-400/30 text-white flex items-start justify-between"
                    >
                      <span className="text-sm">{insight}</span>
                      <button
                        onClick={() => {
                          handleFieldChange(
                            "insights",
                            draft.insights.filter((_, i) => i !== idx),
                          )
                        }}
                        className="text-purple-300 hover:text-purple-100 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Actions */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Next Actions
                </label>
                <div className="space-y-2 mb-3">
                  {draft.next_actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30 text-white flex items-start justify-between"
                    >
                      <span className="text-sm">→ {action}</span>
                      <button
                        onClick={() => {
                          handleFieldChange(
                            "next_actions",
                            draft.next_actions.filter((_, i) => i !== idx),
                          )
                        }}
                        className="text-blue-300 hover:text-blue-100 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refinement hints */}
              {hints.length > 0 && (
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/30">
                  <p className="text-purple-300 font-semibold mb-2">
                    💡 AI Suggestions:
                  </p>
                  <ul className="space-y-1">
                    {hints.map((hint, idx) => (
                      <li key={idx} className="text-purple-200 text-sm">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStage("input")}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveReflection}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Reflection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
