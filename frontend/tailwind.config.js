/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/contexts/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/providers/**/*.{ts,tsx}",
  ],
  safelist: [
    "bg-primary-50", "bg-primary-100", "bg-primary-200", "bg-primary-300", "bg-primary-400",
    "bg-primary-500", "bg-primary-600", "bg-primary-700", "bg-primary-800", "bg-primary-900",
    "text-primary-50", "text-primary-100", "text-primary-200", "text-primary-300", "text-primary-400",
    "text-primary-500", "text-primary-600", "text-primary-700", "text-primary-800", "text-primary-900",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: []
};
