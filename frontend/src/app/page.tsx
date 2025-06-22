"use client"

import { Button } from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-20 bg-background text-foreground">
      <section className="w-full max-w-4xl text-center space-y-6 mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Simplifiez la gestion de vos biens immobiliers.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Archi centralise tous vos documents, automatise vos démarches, et vous connecte avec les bons interlocuteurs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" onClick={() => window.location.href = "/register"}>
            Créer un compte
          </Button>
          <Button variant="secondary" size="lg" onClick={() => window.location.href = "/login"}>
            Se connecter
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Tout au même endroit</CardTitle>
          </CardHeader>
          <CardContent>
            Fini les papiers éparpillés : tout est organisé et consultable à tout moment.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partage maîtrisé</CardTitle>
          </CardHeader>
          <CardContent>
            Transmettez vos documents aux personnes de confiance, sans prise de tête.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes utiles</CardTitle>
          </CardHeader>
          <CardContent>
            Soyez averti des échéances importantes avant qu’il ne soit trop tard.
          </CardContent>
        </Card>
      </section>

      <section className="mt-20 w-full max-w-3xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Gérez vos biens, simplement.</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-6">
          Archi vous accompagne au quotidien pour sécuriser, valoriser et transmettre votre patrimoine immobilier.
        </p>
        <Button size="lg" onClick={() => window.location.href = "/register"}>
          Démarrer maintenant
        </Button>
      </section>
    </main>
  )
}