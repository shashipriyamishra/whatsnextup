"use client"

import { cn } from "@/lib/utils"

// Define gradient variants for different agents - darker, more vibrant
const gradients = [
  "from-purple-900/70 via-pink-800/50 to-purple-950/80", // Deep Purple-Pink
  "from-blue-900/70 via-cyan-800/50 to-blue-950/80", // Deep Blue-Cyan
  "from-green-900/70 via-emerald-800/50 to-green-950/80", // Deep Green-Emerald
  "from-orange-900/70 via-amber-800/50 to-orange-950/80", // Deep Orange-Amber
  "from-rose-900/70 via-pink-800/50 to-rose-950/80", // Deep Rose-Pink
  "from-indigo-900/70 via-purple-800/50 to-indigo-950/80", // Deep Indigo-Purple
  "from-cyan-900/70 via-teal-800/50 to-cyan-950/80", // Deep Cyan-Teal
  "from-lime-900/70 via-green-800/50 to-lime-950/80", // Deep Lime-Green
  "from-fuchsia-900/70 via-purple-800/50 to-fuchsia-950/80", // Deep Fuchsia-Purple
  "from-violet-900/70 via-purple-800/50 to-violet-950/80", // Deep Violet-Purple
  "from-teal-900/70 via-cyan-800/50 to-teal-950/80", // Deep Teal-Cyan
  "from-amber-900/70 via-yellow-800/50 to-amber-950/80", // Deep Amber-Yellow
  "from-red-900/70 via-rose-800/50 to-red-950/80", // Deep Red-Rose
  "from-emerald-900/70 via-teal-800/50 to-emerald-950/80", // Deep Emerald-Teal
  "from-sky-900/70 via-blue-800/50 to-sky-950/80", // Deep Sky-Blue
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
        "group relative rounded-2xl backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        active
          ? "shadow-2xl hover:-translate-y-2"
          : "hover:shadow-2xl hover:-translate-y-2",
        className,
      )}
    >
      {/* Dark base with transparency */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/95 rounded-2xl"></div>

      {/* Gradient Background with varied colors - darker base */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-80 transition-opacity duration-300 rounded-2xl",
          gradient,
        )}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        <div className="text-4xl group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">{name}</h3>
          <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 mb-2">{description}</p>
          {status && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/30 text-xs text-white/90 font-medium">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
