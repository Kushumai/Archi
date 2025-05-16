"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
import { ThemeName, themes } from "@/theme"

interface ThemeContextProps {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeName | null
    if (saved && themes[saved]) setTheme(saved)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const baseClass = html.className
      .split(" ")
      .filter((cls) => cls !== "light" && cls !== "dark")
      .join(" ")
    html.className = `${baseClass} ${theme}`.trim()

    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error("useTheme must be used within ThemeProvider")
  return context
}
