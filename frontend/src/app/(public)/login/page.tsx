"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/contexts/authContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      // la redirection vers /dashboard est déjà faite dans login()
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Connexion
        </h2>

        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Se connecter
        </Button>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-bold underline hover:opacity-80 text-black dark:text-white"
          >
            S’inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
