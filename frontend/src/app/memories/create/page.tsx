"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { getApiUrl } from "@/lib/api"
import SuggestionBox from "@/components/SuggestionBox"
import EditableField from "@/components/EditableField"

interface MemoryDraft {
  title: string
  content: string
  category: "learning" | "achievement" | "challenge" | "insight"
  tags: string[]
}

interface DraftResponse {
  draft: MemoryDraft
  hints: string[]
  message: string
}

export default function CreateMemoryPage() {
  const { user, loading } = useAuth()
  const [stage, setStage] = useState<"input" | "draft" | "review">("input")
  const [memoryTitle, setMemoryTitle] = useState("")
  const [memoryContent, setMemoryContent] = useState("")
  const [draft, setDraft] = useState<MemoryDraft | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})
  const [loadingSuggestions, setLoadingSuggestions] = useState<
    Record<string, boolean>
  >({})
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleCreateDraft = async () => {
    if (!memoryTitle.trim() || !memoryContent.trim()) {
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

      const response = await fetch(`${getApiUrl()}/api/memories/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: memoryTitle,
          content: memoryContent,
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
      setError("Error creating memory draft")
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

      const response = await fetch(`${getApiUrl()}/api/memories/suggestions`, {
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
      })

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

  const handleFieldChange = (field: keyof MemoryDraft, value: any) => {
    if (draft) {
      setDraft((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  const handleSaveMemory = async () => {
    if (!draft) return

    try {
      setIsSaving(true)
      setError("")
      const token = await user?.getIdToken()

      if (!token) {
        setError("No auth token available")
        return
      }

      const response = await fetch(`${getApiUrl()}/api/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      })

      if (response.ok) {
        // Success - redirect to memories page
        window.location.href = "/memories"
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to save memory")
      }
    } catch (err) {
      setError("Error saving memory")
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
            href="/memories"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition"
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
              Capture Your Memory
            </h1>
            <p className="text-white/60 text-center mb-8">
              Share what you learned, achieved, or discovered today. AI will
              help you organize and categorize it.
            </p>

            <div className="p-8 rounded-lg bg-white/5 border border-white/10">
              <label className="block text-white font-semibold mb-3">
                Memory Title
              </label>
              <input
                type="text"
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                placeholder="e.g., Learned React Hooks, Completed Project X, Team Collaboration Insight"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 mb-6"
              />

              <label className="block text-white font-semibold mb-3">
                Content
              </label>
              <textarea
                value={memoryContent}
                onChange={(e) => setMemoryContent(e.target.value)}
                placeholder="Describe the memory, what happened, what you learned, how it made you feel..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none mb-6"
                rows={6}
              />

              <button
                onClick={handleCreateDraft}
                disabled={
                  isCreating || !memoryTitle.trim() || !memoryContent.trim()
                }
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isCreating ? "Creating Draft..." : "Create Memory Draft"}
              </button>
            </div>
          </div>
        )}

        {stage === "draft" && draft && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">
              Review & Refine Your Memory
            </h1>
            <p className="text-white/60 text-center mb-8">
              AI has categorized and organized your memory. You can edit any
              field to refine it.
            </p>

            <div className="p-8 rounded-lg bg-white/5 border border-white/10 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Category
                </label>
                <select
                  value={draft.category}
                  onChange={(e) =>
                    handleFieldChange(
                      "category",
                      e.target.value as MemoryDraft["category"],
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="learning">📚 Learning</option>
                  <option value="achievement">🎉 Achievement</option>
                  <option value="challenge">💪 Challenge</option>
                  <option value="insight">💡 Insight</option>
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
                      onClick={() =>
                        handleGetSuggestions("title", draft.title || "")
                      }
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
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 resize-none"
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

              {/* Tags */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {draft.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-200 flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => {
                          handleFieldChange(
                            "tags",
                            draft.tags.filter((_, i) => i !== idx),
                          )
                        }}
                        className="text-blue-300 hover:text-blue-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (comma-separated)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const newTag = (e.target as HTMLInputElement).value.trim()
                      if (newTag && !draft.tags.includes(newTag)) {
                        handleFieldChange("tags", [...draft.tags, newTag])
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Refinement hints */}
              {hints.length > 0 && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                  <p className="text-blue-300 font-semibold mb-2">
                    💡 AI Suggestions:
                  </p>
                  <ul className="space-y-1">
                    {hints.map((hint, idx) => (
                      <li key={idx} className="text-blue-200 text-sm">
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
                  onClick={handleSaveMemory}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Memory"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
