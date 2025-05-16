"use client"

import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/atoms/Button"

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const themes: ("light" | "dark")[] = ["light", "dark"]

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const iconMap = {
    light: "🌞",
    dark: "🌙",
  }

  const labelMap = {
    light: "Light",
    dark: "Dark",
  }

  return (
    <Button
      onClick={nextTheme}
      variant="ghost"
      size="sm"
      className="px-2 py-1 text-foreground hover:text-foreground focus:text-foreground dark:hover:text-black dark:focus:text-foreground"
    >
      <span className="inline-flex items-center gap-1 text-sm">
        <span className="w-5 h-5 text-center leading-none flex items-center justify-center">
          {iconMap[theme]}
        </span>
        <span className="hidden md:inline">{labelMap[theme]}</span>
      </span>
    </Button>
  )
}