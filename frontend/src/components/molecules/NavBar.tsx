"use client"

import * as React from "react"
import { Logo } from "@/components/atoms/Logo"
import { NavLink } from "@/components/atoms/NavLink"
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher"
import { cn } from "@/lib/utils"

type NavBarProps = React.HTMLAttributes<HTMLElement>

export const NavBar = React.forwardRef<HTMLElement, NavBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center justify-between w-full px-6 py-4 border-b border-neutral-200 dark:border-neutral-700",
          className
        )}
        {...props}
      >
        <Logo />
        <div className="flex items-center gap-4">
          <NavLink href="/" label="Accueil" />
          <NavLink href="/login" label="Connexion" />
          <NavLink href="/register" label="Inscription" />
          <ThemeSwitcher />
        </div>
      </nav>
    )
  }
)

NavBar.displayName = "NavBar"