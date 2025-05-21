import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-xl font-bold text-primary-600", className)}
        {...props}
      >
        <Link href="/">
          <span className="sr-only">Accueil</span>
          Archi
        </Link>
      </div>
    )
  }
)

Logo.displayName = "Logo"