import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Color palette: Solid colors with max 60% dark (70% opacity base colors for better contrast)
  const colors = [
    "bg-blue-950/70 border border-blue-700/50 hover:bg-blue-950/80 hover:border-blue-600/60",
    "bg-indigo-950/70 border border-indigo-700/50 hover:bg-indigo-950/80 hover:border-indigo-600/60",
    "bg-purple-950/70 border border-purple-700/50 hover:bg-purple-950/80 hover:border-purple-600/60",
    "bg-pink-950/70 border border-pink-700/50 hover:bg-pink-950/80 hover:border-pink-600/60",
    "bg-rose-950/70 border border-rose-700/50 hover:bg-rose-950/80 hover:border-rose-600/60",
    "bg-red-950/70 border border-red-700/50 hover:bg-red-950/80 hover:border-red-600/60",
    "bg-orange-950/70 border border-orange-700/50 hover:bg-orange-950/80 hover:border-orange-600/60",
    "bg-amber-950/70 border border-amber-700/50 hover:bg-amber-950/80 hover:border-amber-600/60",
    "bg-cyan-950/70 border border-cyan-700/50 hover:bg-cyan-950/80 hover:border-cyan-600/60",
    "bg-teal-950/70 border border-teal-700/50 hover:bg-teal-950/80 hover:border-teal-600/60",
  ]
  
  // Use random color for variety
  const colorClass = colors[Math.floor(Math.random() * colors.length)]
  
  return (
    <div
      ref={ref}
      className={cn(
        `rounded-2xl ${colorClass} backdrop-blur-md text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]`,
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
