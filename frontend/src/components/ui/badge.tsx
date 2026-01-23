import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white",
        glass: "border-white/20 bg-white/10 text-white backdrop-blur-sm",
        outline: "border-white/20 text-white",
        success:
          "border-transparent bg-green-500/20 text-green-400 border-green-400/20",
        warning:
          "border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-400/20",
        error:
          "border-transparent bg-red-500/20 text-red-400 border-red-400/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
