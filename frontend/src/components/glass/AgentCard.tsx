"use client"

import { cn } from "@/lib/utils"

// Define solid dark color variants for different agents
const darkColors = [
  "bg-purple-950", // Deep Purple
  "bg-blue-950", // Deep Blue
  "bg-green-950", // Deep Green
  "bg-orange-950", // Deep Orange
  "bg-rose-950", // Deep Rose
  "bg-indigo-950", // Deep Indigo
  "bg-cyan-950", // Deep Cyan
  "bg-lime-950", // Deep Lime
  "bg-fuchsia-950", // Deep Fuchsia
  "bg-violet-950", // Deep Violet
  "bg-teal-950", // Deep Teal
  "bg-amber-950", // Deep Amber
  "bg-red-950", // Deep Red
  "bg-emerald-950", // Deep Emerald
  "bg-sky-950", // Deep Sky
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
  const darkColor = darkColors[gradientIndex % darkColors.length]

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        active
          ? "shadow-2xl hover:-translate-y-2"
          : "hover:shadow-2xl hover:-translate-y-2",
        darkColor,
        "border border-white/10",
        className,
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        <div className="text-4xl group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 mb-2">
            {description}
          </p>
          {status && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/30 text-xs text-white/90 font-medium">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )\n}
