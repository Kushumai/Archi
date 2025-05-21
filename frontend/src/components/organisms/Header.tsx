"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/molecules/NavBar"

type HeaderProps = React.HTMLAttributes<HTMLElement>

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn("w-full bg-white dark:bg-neutral-900", className)}
        {...props}
      >
        <NavBar />
      </header>
    )
  }
)

Header.displayName = "Header"