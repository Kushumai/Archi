"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/authContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Utilisateur non authentifié. Redirection vers /login")
      }
      router.push(`/login?redirect=${pathname}`)
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated) return null

  return <>{children}</>
}