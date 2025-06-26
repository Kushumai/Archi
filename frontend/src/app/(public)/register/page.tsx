"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/authContext";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !firstName || !lastName || !password) {
      setError("Veuillez remplir tous les champs obligatoires *");
      return;
    }

    setIsLoading(true);
    try {
      await api.post(
        "/auth/register",
        { email, password, firstName, lastName },
        { withCredentials: true }
      );

      await login(email, password);

      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Une erreur est survenue lors de l’inscription";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main role="main">
    <h1 className="sr-only">Inscription</h1>
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white">
          Créer un compte
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
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Prénom <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Nom <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "S’inscrire"}
        </Button>

        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          <span className="text-red-500">*</span> : champ obligatoire
        </p>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          Tu as déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-bold underline hover:opacity-80 text-black dark:text-white"
          >
            Se connecter
          </Link>
        </p>
      </form>
    </div>
    </main>
  );
}