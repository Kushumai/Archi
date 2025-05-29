// src/app/(protected)/profile/page.tsx
"use client"

import { useAuth } from "@/contexts/authContext"
import ProtectedRoute from "@/components/templates/ProtectedRoute"
import { Card } from "@/components/atoms/Card"
import { Button } from "@/components/atoms/Button"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
          Profil utilisateur
        </h1>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">Identifiant</p>
            <p className="text-base font-semibold text-neutral-900 dark:text-white">
              {user?.id || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-500">Email</p>
            <p className="text-base font-semibold text-neutral-900 dark:text-white">
              {user?.email || "—"}
            </p>
          </div>

          {user?.username && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Nom d'utilisateur</p>
              <p className="text-base font-semibold text-neutral-900 dark:text-white">
                {user.username}
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button variant="secondary" disabled>
              Modifier mon profil (à venir)
            </Button>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
