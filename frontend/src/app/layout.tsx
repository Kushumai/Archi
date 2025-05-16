import "@/styles/globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/contexts/authContext"
// import { MainLayout } from "@/components/templates/MainLayout"

import { Inter } from "next/font/google"
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
    <html lang="fr" className={cn(inter.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            {/* <MainLayout> */}
            {children}
            {/* </MainLayout> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}