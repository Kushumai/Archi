"use client"

import * as React from "react"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

interface PublicLayoutProps {
  children: React.ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}