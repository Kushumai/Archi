import { ProtectedRoute } from "@/components/templates/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <h1 className="text-3xl font-bold mb-4">Profil</h1>
        <p>Informations personnelles de l'utilisateur à venir...</p>
      </div>
    </ProtectedRoute>
  );
}