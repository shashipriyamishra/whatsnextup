"use client"

import { cn } from "@/lib/utils"

// Define gradient variants for different categories - darker, more vibrant
const gradients = [
  "from-purple-900/60 via-pink-800/40 to-purple-950/80", // Deep Purple-Pink
  "from-blue-900/60 via-cyan-800/40 to-blue-950/80", // Deep Blue-Cyan
  "from-green-900/60 via-emerald-800/40 to-green-950/80", // Deep Green-Emerald
  "from-orange-900/60 via-amber-800/40 to-orange-950/80", // Deep Orange-Amber
  "from-rose-900/60 via-pink-800/40 to-rose-950/80", // Deep Rose-Pink
  "from-indigo-900/60 via-purple-800/40 to-indigo-950/80", // Deep Indigo-Purple
  "from-cyan-900/60 via-teal-800/40 to-cyan-950/80", // Deep Cyan-Teal
  "from-lime-900/60 via-green-800/40 to-lime-950/80", // Deep Lime-Green
  "from-fuchsia-900/60 via-purple-800/40 to-fuchsia-950/80", // Deep Fuchsia-Purple
  "from-violet-900/60 via-purple-800/40 to-violet-950/80", // Deep Violet-Purple
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
        "group relative rounded-2xl backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:shadow-2xl hover:-translate-y-2",
        className,
      )}
    >
      {/* Dark base with transparency */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/90 rounded-2xl"></div>

      {/* Gradient Background with varied colors - darker base */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity duration-300 rounded-2xl",
          gradient,
        )}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  )
}
