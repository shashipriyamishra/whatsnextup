import React, { useState } from "react"

interface Subtask {
  id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  deadline?: string
}

interface SubtasksProps {
  subtasks: Subtask[]
  onToggle: (id: string) => void
  onAdd?: (title: string) => void
  onDelete?: (id: string) => void
  editable?: boolean
}

export default function Subtasks({
  subtasks,
  onToggle,
  onAdd,
  onDelete,
  editable = false,
}: SubtasksProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [newSubtask, setNewSubtask] = useState("")

  const completedCount = subtasks.filter((st) => st.completed).length
  const totalCount = subtasks.length

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500/20 text-red-300",
      medium: "bg-yellow-500/20 text-yellow-300",
      low: "bg-green-500/20 text-green-300",
    }
    return colors[priority] || "bg-gray-500/20 text-gray-300"
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim() && onAdd) {
      onAdd(newSubtask)
      setNewSubtask("")
    }
  }

  return (
    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-white font-semibold mb-3"
      >
        <div className="flex items-center gap-2">
          <span>{isExpanded ? "▼" : "▶"}</span>
          <span>📝 Subtasks</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">
            {completedCount}/{totalCount}
          </span>
        </div>
      </button>

      {isExpanded && (
        <>
          {subtasks.length === 0 ? (
            <p className="text-white/50 text-sm mb-3">No subtasks yet</p>
          ) : (
            <div className="space-y-2 mb-4">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-start gap-3 p-2 rounded bg-white/5 hover:bg-white/10 transition"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => onToggle(subtask.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        subtask.completed
                          ? "text-white/50 line-through"
                          : "text-white"
                      }`}
                    >
                      {subtask.title}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(subtask.priority)}`}
                      >
                        {subtask.priority}
                      </span>
                      {subtask.deadline && (
                        <span className="text-xs text-white/50">
                          📅 {subtask.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  {editable && onDelete && (
                    <button
                      onClick={() => onDelete(subtask.id)}
                      className="text-white/40 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {editable && onAdd && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubtask()
                  }
                }}
                placeholder="Add new subtask..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 text-sm"
              />
              <button
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition text-sm"
              >
                +
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
