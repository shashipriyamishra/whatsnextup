"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-6 shadow-lg transition-all",
        hover && "hover:bg-white/15 hover:shadow-xl hover:border-white/30",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  )
}
