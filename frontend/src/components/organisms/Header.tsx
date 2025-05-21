"use client"

import { Logo } from "@/components/atoms/Logo"
import { NavLink } from "@/components/atoms/NavLink"
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher"
import { cn } from "@/lib/utils"

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "w-full border-b border-neutral-200 bg-white px-4 py-3 shadow-sm dark:bg-neutral-900 dark:border-neutral-700",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />

        <nav className="flex items-center gap-6 text-sm">
          <NavLink href="/login">Connexion</NavLink>
          <NavLink href="/register">Inscription</NavLink>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  )
}