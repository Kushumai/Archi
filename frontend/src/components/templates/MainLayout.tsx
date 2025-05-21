import * as React from "react"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

export interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 px-4 py-6">{children}</main>
      <Footer />
    </div>
  )
}