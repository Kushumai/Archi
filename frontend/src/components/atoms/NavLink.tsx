"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  exact?: boolean
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, exact = false, className, children, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname.startsWith(href)

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary-600",
          isActive
            ? "text-primary-600 dark:text-white"
            : "text-neutral-700 dark:text-neutral-300",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

NavLink.displayName = "NavLink"