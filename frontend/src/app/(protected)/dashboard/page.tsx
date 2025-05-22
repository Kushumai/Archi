"use client"

import { useAuth } from "@/contexts/authContext"
import ProtectedRoute from "@/components/templates/ProtectedRoute"
import { Button } from "@/components/atoms/Button"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
          Bienvenue sur le Dashboard
        </h1>

        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
          Connecté avec : <strong>{user?.email}</strong>
        </p>

        <Button className="mt-6" onClick={logout}>
          Se déconnecter
        </Button>
      </div>
    </ProtectedRoute>
  )
}