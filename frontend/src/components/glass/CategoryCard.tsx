"use client"

import { cn } from "@/lib/utils"

// Define gradient variants for different categories
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

interface CategoryCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
  className?: string
  gradientIndex?: number // Index to select gradient variant
}

export function CategoryCard({
  icon,
  title,
  description,
  onClick,
  className,
  gradientIndex = 0,
}: CategoryCardProps) {
  const gradient = gradients[gradientIndex % gradients.length]

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl border border-white/20 backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:border-white/40 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1",
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
      <div className="relative">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  )
}
