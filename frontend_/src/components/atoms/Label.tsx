import * as React from "react"
import { cn } from "@/lib/utils"

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium text-neutral-700 dark:text-neutral-200", className)}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"
