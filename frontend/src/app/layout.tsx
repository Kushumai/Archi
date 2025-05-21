import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/contexts/authContext"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Archi",
  description: "Application de gestion immobilière",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.variable, "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
