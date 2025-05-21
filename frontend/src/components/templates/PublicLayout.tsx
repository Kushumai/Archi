import * as React from "react"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

export interface PublicLayoutProps {
  children: React.ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem-6rem)]">{children}</main>
      <Footer />
    </>
  )
}