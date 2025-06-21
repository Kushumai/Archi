import * as React from "react"
import { cn } from "@/lib/utils"

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn("form-checkbox h-4 w-4 text-primary-600", className)}
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"
