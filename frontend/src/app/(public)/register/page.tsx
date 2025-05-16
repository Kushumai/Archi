"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { PublicLayout } from "@/components/templates/PublicLayout"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      })

      router.push("/login") // ou redirection vers dashboard si auto-login
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erreur inconnue"
      setError(message)
    }
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 border border-border p-6 rounded-xl bg-background shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Inscription</h1>
            <p className="text-sm text-muted-foreground">Créez un compte gratuitement</p>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
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
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              S’inscrire
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary underline hover:opacity-80">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}