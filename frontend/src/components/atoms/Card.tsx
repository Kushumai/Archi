import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-700",
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"