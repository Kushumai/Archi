import * as React from "react"
import { cn } from "@/lib/utils"

export interface FooterProps extends React.HTMLAttributes<HTMLElement> { }

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "w-full border-t border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
          className
        )}
        {...props}
      >
        © {new Date().getFullYear()} Archi. Tous droits réservés.
      </footer>
    )
  }
)

Footer.displayName = "Footer"