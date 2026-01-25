import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Color palette: Solid colors with max 60% dark (40% opacity base colors)
  const colors = [
    "bg-blue-900/40 border-blue-600/30 hover:bg-blue-900/50 hover:border-blue-500/40",
    "bg-indigo-900/40 border-indigo-600/30 hover:bg-indigo-900/50 hover:border-indigo-500/40",
    "bg-purple-900/40 border-purple-600/30 hover:bg-purple-900/50 hover:border-purple-500/40",
    "bg-pink-900/40 border-pink-600/30 hover:bg-pink-900/50 hover:border-pink-500/40",
    "bg-rose-900/40 border-rose-600/30 hover:bg-rose-900/50 hover:border-rose-500/40",
    "bg-red-900/40 border-red-600/30 hover:bg-red-900/50 hover:border-red-500/40",
    "bg-orange-900/40 border-orange-600/30 hover:bg-orange-900/50 hover:border-orange-500/40",
    "bg-amber-900/40 border-amber-600/30 hover:bg-amber-900/50 hover:border-amber-500/40",
    "bg-cyan-900/40 border-cyan-600/30 hover:bg-cyan-900/50 hover:border-cyan-500/40",
    "bg-teal-900/40 border-teal-600/30 hover:bg-teal-900/50 hover:border-teal-500/40",
  ]

  // Use random color for variety
  const colorClass = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      ref={ref}
      className={cn(
        `rounded-2xl ${colorClass} border backdrop-blur-sm text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]`,
        className,
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold leading-none tracking-tight text-white",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-white/70", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
