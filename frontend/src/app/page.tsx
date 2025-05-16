import { PublicLayout } from "@/components/templates/PublicLayout"
import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import Image from "next/image"


export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col-reverse md:flex-row items-center justify-center px-4 text-center md:text-left gap-8">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Archi — Simplifiez la gestion immobilière
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Une plateforme unique pour gérer vos biens, documents, démarches et interactions.
          </p>
          <Link href="/login">
            <Button size="lg">Commencer</Button>
          </Link>
        </div>

        <div className="w-full max-w-sm md:max-w-md">
          <Image
            src="/illustration-archi.png"
            alt="Illustration de l'application Archi"
            width={400}
            height={300}
            className="mx-auto"
            priority
          />
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 bg-muted/20 text-center">
        <div className="max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Centralisation</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Rassemblez tous vos documents, biens et contacts au même endroit.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Simplicité</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Une interface claire, conçue pour tous les utilisateurs, experts ou débutants.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Interopérabilité</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Connectez Archi à d’autres services : artisans, notaires, outils de gestion.
            </p>
          </div>
        </div>
      </section>

      {/* Engagement Section */}
      <section className="py-12 px-4 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-4">Nos engagements</h2>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>✅ Respect du RGPD : vos données restent privées et sécurisées</li>
          <li>✅ Accessibilité : clavier, contraste, simplicité des parcours</li>
          <li>✅ UX pensée pour tous les profils : particuliers, pros, collectivités</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()} Archi – Tous droits réservés.
      </footer>
    </PublicLayout>
  )
}