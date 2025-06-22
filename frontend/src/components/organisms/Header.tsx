"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher"

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b bg-white dark:bg-zinc-900 dark:border-zinc-700">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Archi
        </div>

        <nav className="flex gap-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-primary underline underline-offset-4"
                  : "text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  )
}
