"use client"

import { cn } from "@/lib/utils"

// Define gradient variants for different agents (lighter, more vibrant)
const gradients = [
  "from-purple-400/25 via-pink-400/15 to-purple-500/5", // Purple-Pink
  "from-blue-400/25 via-cyan-400/15 to-blue-500/5", // Blue-Cyan
  "from-green-400/25 via-emerald-400/15 to-green-500/5", // Green-Emerald
  "from-orange-400/25 via-amber-400/15 to-orange-500/5", // Orange-Amber
  "from-rose-400/25 via-pink-400/15 to-rose-500/5", // Rose-Pink
  "from-indigo-400/25 via-violet-400/15 to-indigo-500/5", // Indigo-Violet
  "from-cyan-400/25 via-sky-400/15 to-cyan-500/5", // Cyan-Sky
  "from-lime-400/25 via-green-400/15 to-lime-500/5", // Lime-Green
  "from-fuchsia-400/25 via-purple-400/15 to-fuchsia-500/5", // Fuchsia-Purple
  "from-violet-400/25 via-purple-400/15 to-violet-500/5", // Violet-Purple
  "from-teal-400/25 via-cyan-400/15 to-teal-500/5", // Teal-Cyan
  "from-amber-400/25 via-yellow-400/15 to-amber-500/5", // Amber-Yellow
  "from-red-400/25 via-rose-400/15 to-red-500/5", // Red-Rose
  "from-emerald-400/25 via-teal-400/15 to-emerald-500/5", // Emerald-Teal
  "from-sky-400/25 via-blue-400/15 to-sky-500/5", // Sky-Blue
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
      {/* Gradient Background with varied colors - lighter opacity */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-70 transition-opacity duration-300",
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
