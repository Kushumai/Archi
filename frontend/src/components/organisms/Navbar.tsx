"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher";

export const Navbar = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
          Archi
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:underline">
            Connexion
          </Link>
          <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:underline">
            Inscription
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
