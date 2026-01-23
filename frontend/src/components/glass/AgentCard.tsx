"use client"

import { cn } from "@/lib/utils"

interface AgentCardProps {
  icon: string
  name: string
  description: string
  status?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function AgentCard({
  icon,
  name,
  description,
  status,
  active,
  onClick,
  className,
}: AgentCardProps) {
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
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

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
