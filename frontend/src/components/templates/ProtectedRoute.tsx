"use client"

import { useAuth } from "@/contexts/authContext"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          Chargement...
        </p>
      </div>
    )
  }

  return <>{children}</>
}