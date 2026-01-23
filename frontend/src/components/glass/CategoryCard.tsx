"use client"

import { cn } from "@/lib/utils"

interface CategoryCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
  className?: string
}

export function CategoryCard({
  icon,
  title,
  description,
  onClick,
  className,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-6 cursor-pointer transition-all duration-300",
        "hover:bg-white/15 hover:border-white/40 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1",
        className,
      )}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  )
}
