"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // Décider du bouton à afficher
  let actionLabel: string;
  let actionOnClick: () => void;

  if (user) {
    actionLabel = "Déconnexion";
    actionOnClick = handleLogout;
  } else if (pathname === "/login") {
    actionLabel = "S’inscrire";
    actionOnClick = () => router.push("/register");
  } else if (pathname === "/register") {
    actionLabel = "Se connecter";
    actionOnClick = () => router.push("/login");
  } else {
    actionLabel = "Se connecter";
    actionOnClick = () => router.push("/login");
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 border-b border-border bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
      {/* Logo Texte cliquable */}
      <div
        onClick={handleGoHome}
        className="cursor-pointer text-2xl font-black tracking-tight"
      >
        Archi
      </div>

      {/* Bouton de droite */}
      <Button size="sm" onClick={actionOnClick}>
        {actionLabel}
      </Button>
    </header>
  );
}