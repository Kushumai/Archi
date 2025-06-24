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
    actionLabel = "Sortir";
    actionOnClick = handleLogout;
  } else if (pathname === "/login") {
    actionLabel = "Emménager";
    actionOnClick = () => router.push("/register");
  } else if (pathname === "/register") {
    actionLabel = "Entrer";
    actionOnClick = () => router.push("/login");
  } else {
    actionLabel = "Entrer";
    actionOnClick = () => router.push("/login");
  }

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 md:px-8 lg:px-16 py-4
        border-b border-border
        bg-white dark:bg-zinc-900
        text-neutral-900 dark:text-white
      "
    >
      <div
        onClick={handleGoHome}
        className="cursor-pointer text-2xl font-black tracking-tight"
      >
        Archi
      </div>

      <Button size="sm" onClick={actionOnClick}>
        {actionLabel}
      </Button>
    </header>
  );
}
