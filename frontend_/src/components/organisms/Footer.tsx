import * as React from "react"
import { cn } from "@/lib/utils"

type FooterProps = React.HTMLAttributes<HTMLElement>

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "w-full border-t border-neutral-200 p-4 text-center text-sm text-neutral-500 dark:border-neutral-700",
          className
        )}
        {...props}
      >
        &copy; {new Date().getFullYear()} Archi. Tous droits réservés.
      </footer>
    )
  }
)

Footer.displayName = "Footer"