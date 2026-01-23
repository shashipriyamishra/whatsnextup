"use client"

interface SuggestionBoxProps {
  suggestions: any[]
  loading?: boolean
  onApply?: (suggestion: any) => void
  field?: string
}

export default function SuggestionBox({
  suggestions,
  loading,
  onApply,
  field,
}: SuggestionBoxProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-purple-300">
          💡 AI Suggestions
        </span>
        {loading && <span className="text-xs animate-pulse">Loading...</span>}
      </div>

      <div className="space-y-1">
        {Array.isArray(suggestions) ? (
          suggestions.map((suggestion, idx) => {
            // Extract text properly from different formats
            let text = ""
            if (typeof suggestion === "string") {
              text = suggestion
            } else if (suggestion && typeof suggestion === "object") {
              // Handle objects with text/value/content properties
              text =
                suggestion.text ||
                suggestion.value ||
                suggestion.content ||
                JSON.stringify(suggestion)
            } else {
              text = String(suggestion || "")
            }

            return (
              <button
                key={idx}
                onClick={() => onApply?.(text)}
                className="block w-full text-left text-sm p-2 rounded hover:bg-white/10 text-purple-200 hover:text-white transition cursor-pointer"
              >
                <span className="text-xs opacity-60">✓</span> {text}
              </button>
            )
          })
        ) : (
          <div className="text-sm text-purple-200 p-2">
            {typeof suggestions === "string"
              ? suggestions
              : JSON.stringify(suggestions)}
          </div>
        )}
      </div>
    </div>
  )
}
