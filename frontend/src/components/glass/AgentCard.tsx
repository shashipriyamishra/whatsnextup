"use client"

import { cn } from "@/lib/utils"

// Define gradient variants for different agents
const gradients = [
  "from-purple-500/30 via-pink-500/20 to-purple-600/10", // Purple-Pink
  "from-blue-500/30 via-cyan-500/20 to-blue-600/10", // Blue-Cyan
  "from-green-500/30 via-teal-500/20 to-green-600/10", // Green-Teal
  "from-orange-500/30 via-amber-500/20 to-orange-600/10", // Orange-Amber
  "from-rose-500/30 via-pink-500/20 to-rose-600/10", // Rose-Pink
  "from-indigo-500/30 via-purple-500/20 to-indigo-600/10", // Indigo-Purple
  "from-cyan-500/30 via-blue-500/20 to-cyan-600/10", // Cyan-Blue
  "from-lime-500/30 via-green-500/20 to-lime-600/10", // Lime-Green
  "from-fuchsia-500/30 via-purple-500/20 to-fuchsia-600/10", // Fuchsia-Purple
  "from-violet-500/30 via-purple-500/20 to-violet-600/10", // Violet-Purple
]

interface AgentCardProps {
  icon: string
  name: string
  description: string
  status?: string
  active?: boolean
  onClick?: () => void
  className?: string
  gradientIndex?: number // Index to select gradient variant
}

export function AgentCard({
  icon,
  name,
  description,
  status,
  active,
  onClick,
  className,
  gradientIndex = 0,
}: AgentCardProps) {
  const gradient = gradients[gradientIndex % gradients.length]

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        active
          ? "border-pink-400 shadow-lg shadow-pink-500/30"
          : "border border-white/20",
        "hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1",
        className,
      )}
    >
      {/* Gradient Background with varied colors */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity duration-300",
          gradient,
        )}
      ></div>

      {/* Content */}
      <div className="relative flex items-start gap-4">
        <div className="text-3xl animate-pulse">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          <p className="text-sm text-white/70 mb-2">{description}</p>
          {status && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/80">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
