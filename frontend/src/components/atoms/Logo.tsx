import * as React from "react"
import { cn } from "@/lib/utils"

type LogoProps = React.HTMLAttributes<HTMLSpanElement>

export const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-bold text-xl text-primary-600", className)}
        {...props}
      >
        Archi
      </span>
    )
  }
)

Logo.displayName = "Logo"