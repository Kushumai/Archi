"use client";

import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/atoms/Button";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const themes: ("light" | "dark" | "accessible")[] = ["light", "dark", "accessible"];

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button onClick={nextTheme}>
      {theme === "light" && "🌞 Light"}
      {theme === "dark" && "🌙 Dark"}
      {theme === "accessible" && "🎨 Accessible"}
    </Button>
  );
};