"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

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
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">Se connecter</Button>
      </form>
    </div>
  );
}