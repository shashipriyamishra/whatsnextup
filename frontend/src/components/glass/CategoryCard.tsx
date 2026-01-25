"use client"

import React from "react"
import { cn } from "@/lib/utils"

// Define solid dark color variants for different categories
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
]

interface CategoryCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
  className?: string
  gradientIndex?: number // Index to select gradient variant
}

function CategoryCardComponent({
  icon,
  title,
  description,
  onClick,
  className,
  gradientIndex = 0,
}: CategoryCardProps) {
  const darkColor = darkColors[gradientIndex % darkColors.length]

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:shadow-2xl hover:-translate-y-2",
        darkColor,
        "border border-white/10",
        className,
      )}
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl mb-4 group-hover:opacity-80 transition-opacity duration-300">
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

export const CategoryCard = React.memo(CategoryCardComponent)
