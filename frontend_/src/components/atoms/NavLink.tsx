"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  label: string
  className?: string
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, label, className }, ref) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary-600",
          isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-700 dark:text-neutral-300",
          className
        )}
      >
        {label}
      </Link>
    )
  }
)

NavLink.displayName = "NavLink"