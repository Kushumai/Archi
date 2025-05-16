"use client"

import { useState } from "react"
import { Logo } from "@/components/atoms/Logo"
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher"
import { NavBar } from "@/components/molecules/NavBar"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <NavBar />

        {/* zone droite : ThemeSwitcher + menu mobile */}
        <div className="flex items-center gap-2 w-24 justify-end">
          <ThemeSwitcher />
          <button
            className="md:hidden p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu mobile"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          <Link href="/" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>Connexion</Link>
          <Link href="/register" onClick={() => setIsOpen(false)}>Inscription</Link>
        </div>
      )}
    </header>
  )
}