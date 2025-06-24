"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";

export function Header() {
  const { isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleAction = async () => {
    if (pathname === "/") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } else if (pathname === "/login") {
      router.push("/register");
    } else if (pathname === "/register") {
      router.push("/login");
    } else if (isAuthenticated) {
      await logout();
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  let actionLabel = "Entrer";
  if (pathname === "/") {
    actionLabel = "Entrer";
  } else if (pathname === "/login") {
    actionLabel = "Emménager";
  } else if (pathname === "/register") {
    actionLabel = "Entrer";
  } else if (isAuthenticated) {
    actionLabel = "Sortir";
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 border-b bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
      <div onClick={handleGoHome} className="cursor-pointer text-2xl font-black tracking-tight">
        Archi
      </div>
      <Button size="sm" onClick={handleAction} disabled={loading}>
        {actionLabel}
      </Button>
    </header>
  );
}
