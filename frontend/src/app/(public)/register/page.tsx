"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { PublicLayout } from "@/components/templates/PublicLayout"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      await api.post("/auth/register", { email, password, username })
      router.push("/login")
    } catch (err: unknown) {
      const message =
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Erreur inconnue"
      setError(message)
    }
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 border border-neutral-200 p-6 rounded-xl bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Créer un compte</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Remplis le formulaire pour t&apos;inscrire
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Erreur :</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Nom d&apos;utilisateur
              </label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              S&apos;inscrire
            </Button>
          </form>

          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
            Tu as déjà un compte ?{" "}
            <Link href="/login" className="text-primary-600 underline hover:opacity-80">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}