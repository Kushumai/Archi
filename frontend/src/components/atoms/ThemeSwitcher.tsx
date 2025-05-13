"use client";

import { useTheme } from "@/providers/theme-provider";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const themes: ("light" | "dark" | "accessible")[] = ["light", "dark", "accessible"];

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={nextTheme}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {theme === "light" && "🌞 Light"}
      {theme === "dark" && "🌙 Dark"}
      {theme === "accessible" && "🎨 Accessible"}
    </button>
  );
};