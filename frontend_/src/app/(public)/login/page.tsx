"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { PublicLayout } from "@/components/templates/PublicLayout"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { useAuth } from "@/contexts/authContext"
import { Suspense } from "react"
import RedirectHandler from "@/components/utils/RedirectHandler"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const redirect = (e.currentTarget as HTMLFormElement).dataset.redirect || "/dashboard"

    try {
      await login(email, password)
      router.push(redirect)
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
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Connexion</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Accédez à votre espace personnel
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Erreur :</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form" className="space-y-4">
            <Suspense fallback={null}>
              <RedirectHandler />
            </Suspense>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
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
              <label htmlFor="password" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
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
          </form>

          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary-600 underline hover:opacity-80">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
