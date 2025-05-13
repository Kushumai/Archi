"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@email.com" && password === "demo123") {
      login({ id: "1", username: "demo", email: "demo@email.com" });
    } else {
      setError("Email ou mot de passe invalide");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-[var(--color-primary)] rounded focus:outline-none focus:ring focus:ring-[var(--color-primary)]"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border border-[var(--color-primary)] rounded focus:outline-none focus:ring focus:ring-[var(--color-primary)]"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90">
          Se connecter
        </button>
      </form>
    </div>
  );
}
