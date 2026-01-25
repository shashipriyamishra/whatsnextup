"use client"

import { useState } from "react"
import SuggestionBox from "./SuggestionBox"

interface EditableFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onSuggestionsRequest?: (value: string) => Promise<any[]>
  placeholder?: string
  multiline?: boolean
  rows?: number
  type?: "text" | "select" | "textarea"
  options?: { label: string; value: string }[]
}

export default function EditableField({
  label,
  value,
  onChange,
  onBlur,
  onSuggestionsRequest,
  placeholder,
  multiline = false,
  rows = 3,
  type = "text",
  options = [],
}: EditableFieldProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleChange = (newValue: string) => {
    onChange(newValue)
  }

  const handleRequestSuggestions = async () => {
    if (!onSuggestionsRequest) return

    setShowSuggestions(true)
    setLoadingSuggestions(true)

    try {
      const sugg = await onSuggestionsRequest(value || "")
      setSuggestions(sugg || [])

      // Auto-apply first suggestion if input is empty
      if ((!value || !value.trim()) && sugg && sugg.length > 0) {
        const firstSuggestion = sugg[0]
        const text =
          typeof firstSuggestion === "string"
            ? firstSuggestion
            : firstSuggestion?.text ||
              firstSuggestion?.value ||
              firstSuggestion?.content ||
              String(firstSuggestion || "")
        onChange(text)
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error("Error getting suggestions:", error)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleSuggestionApply = (suggestion: any) => {
    const text =
      typeof suggestion === "string" ? suggestion : suggestion?.toString() || ""
    onChange(text)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-white">
          {label}
        </label>
        {onSuggestionsRequest && (
          <button
            onClick={handleRequestSuggestions}
            disabled={loadingSuggestions}
            className="text-xl hover:scale-150 transition-transform duration-200 disabled:opacity-50 cursor-pointer"
            title="Get AI suggestions"
          >
            {loadingSuggestions ? "⏳" : "✨"}
          </button>
        )}
      </div>

      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-2 rounded-lg bg-white border border-white/20 text-black placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
        />
      )}

      {showSuggestions && (
        <SuggestionBox
          suggestions={suggestions}
          loading={loadingSuggestions}
          onApply={handleSuggestionApply}
          field={label}
        />
      )}
    </div>
  )
}
