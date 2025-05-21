import { PublicLayout } from "@/components/templates/PublicLayout"
import { Button } from "@/components/atoms/Button"
import Link from "next/link"

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
          Archi, l’immobilier simplifié
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
          Plateforme de gestion pour particuliers, pros, et experts du bâtiment.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Créer un compte</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}