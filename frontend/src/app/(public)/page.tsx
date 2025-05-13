"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 h-[80vh] flex flex-col justify-center items-center text-center bg-[var(--color-background)] text-[var(--color-text)]">
      <h1 className="text-5xl font-bold mb-6">Simplifiez la gestion immobilière 🏠</h1>
      <p className="text-lg max-w-2xl mb-8">
        Archi est la plateforme intuitive qui vous aide à gérer vos dossiers de location, documents et relations avec vos locataires en toute simplicité.
      </p>
      <Link href="/register">
        <Button>Commencer maintenant</Button>
      </Link>
    </div>
  );
}