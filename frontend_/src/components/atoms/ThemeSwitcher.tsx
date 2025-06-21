"use client"

import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/atoms/Button"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"


export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const themes: ("light" | "dark")[] = ["light", "dark"]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null


  const nextTheme = () => {
    const current = (theme ?? "light") as "light" | "dark"
    const currentIndex = themes.indexOf(current)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <Button onClick={nextTheme} variant="ghost" size="sm" className="px-2 py-1">
      <span className="flex items-center gap-1">
        {theme === "light" && <><Sun className="w-4 h-4" /><span>Light</span></>}
        {theme === "dark" && <><Moon className="w-4 h-4" /><span>Dark</span></>}
      </span>
    </Button>
  )
}
