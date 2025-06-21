"use client"

import { useAuth } from "@/contexts/authContext"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/atoms/Card"
import { Alert } from "@/components/atoms/Alert"

export default function HomePage() {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-zinc-50 text-gray-900 px-4 py-20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenue 🎉</CardTitle>
          <CardDescription>
            Cette carte utilise les composants <code>shadcn/ui</code> + design system maison
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert
            variant={isAuthenticated ? "success" : "error"}
            title={isAuthenticated ? "Connecté ✅" : "Déconnecté ❌"}
            description={
              isAuthenticated
                ? `Connecté avec ${user?.email}`
                : "Vous devez vous connecter pour accéder au dashboard"
            }
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="demo@site.com" defaultValue="demo@site.com" disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <Input placeholder="demo" type="password" defaultValue="demo" disabled />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => login("demo@site.com", "demo")}>Connexion</Button>
          <Button variant="secondary" onClick={logout}>
            Déconnexion
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}