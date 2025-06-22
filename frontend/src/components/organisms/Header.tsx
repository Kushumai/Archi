"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  // Nouvelle fonction pour la navigation sur le logo
  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 border-b border-border bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
      {/* Logo Texte cliquable sans style de lien */}
      <div
        onClick={handleGoHome}
        className="cursor-pointer text-2xl font-black tracking-tight"
      >
        Archi
      </div>

      {/* Bouton dynamique de connexion/déconnexion */}
      {user ? (
        <Button variant="default" size="sm" onClick={handleLogout}>
          Déconnexion
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/login")}
        >
          Se connecter
        </Button>
      )}
    </header>
  );
}
