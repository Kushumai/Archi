export const themes = {
  light: {
    name: "light",
    colors: {
      primary: "#4F46E5",
      background: "#ffffff",
      text: "#111827",
    },
  },
  dark: {
    name: "dark",
    colors: {
      primary: "#6366F1",
      background: "#111827",
      text: "#ffffff",
    },
  },
}

export type ThemeName = keyof typeof themes