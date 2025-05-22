import ProtectedRoute from "@/components/templates/ProtectedRoute"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
          Bienvenue sur le Dashboard
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
          Vous êtes connecté avec succès.
        </p>
      </div>
    </ProtectedRoute>
  )
}