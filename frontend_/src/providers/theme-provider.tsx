"use client"

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes"

import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider(props: ThemeProviderProps) {
  return <NextThemesProvider {...props} />
}

export const useTheme = useNextTheme