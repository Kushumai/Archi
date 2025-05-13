import { ProtectedRoute } from "@/components/templates/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Bienvenue dans votre espace utilisateur.</p>
      </div>
    </ProtectedRoute>
  );
}