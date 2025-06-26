"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/contexts/authContext";
import { Alert } from "@/atoms/Alert"

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
    }
  };

  return (
    <main role="main">
    <h1 className="sr-only">Connexion</h1>
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Connexion
        </h2>

        {error && (
          <Alert
            variant="error"
            title="Erreur"
            description={error}
            dismissible
            onClose={() => setError("")}
          />
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.currentTarget.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
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
    </main>
);
}
