"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[var(--color-navbar)] shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--color-text)]">
          Archi
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[var(--color-text)] hover:underline">
                Dashboard
              </Link>
              <Link href="/profile" className="text-[var(--color-text)] hover:underline">
                Profil
              </Link>
              <Button onClick={logout}>Se déconnecter</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[var(--color-text)] hover:underline">
                Connexion
              </Link>
              <Link href="/register" className="text-[var(--color-text)] hover:underline">
                Inscription
              </Link>
            </>
          )}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};