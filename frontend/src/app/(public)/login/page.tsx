"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { Checkbox } from "@/components/atoms/Checkbox"
import { PublicLayout } from "@/components/templates/PublicLayout"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await api.post("/auth/login", {
        email,
        password,
      })

      router.push("/dashboard") // ou une autre page après login
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
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground">Accédez à votre espace personnel</p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Erreur :</span> {error}
            </div>
          )}

          {/* ✅ FORMULAIRE BIEN ENCADRÉ */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-foreground">
                <Checkbox id="remember" checked={remember} onCheckedChange={() => setRemember(!remember)} />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="#" className="text-sm text-primary underline hover:opacity-80">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary underline hover:opacity-80">
              S’inscrire
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}