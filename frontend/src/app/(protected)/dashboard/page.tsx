"use client"

import { ProtectedRoute } from "@/components/templates/ProtectedRoute"
import { MainLayout } from "@/components/templates/MainLayout"
import { useAuth } from "@/contexts/authContext"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <MainLayout>
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Bonjour, {user?.username || user?.email} 👋
          </p>
        </section>
      </MainLayout>
    </ProtectedRoute>
  )
}