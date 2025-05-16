"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-3 py-2 rounded-md transition-colors",
        isActive ? "text-primary underline" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}