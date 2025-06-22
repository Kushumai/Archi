"use client";

import React from "react";

export default function HomePage() {
  return (
    <main className="flex items-center justify-start min-h-screen bg-zinc-50 dark:bg-zinc-900 px-8 md:px-16 lg:px-32">
      <div className="max-w-screen-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight tracking-tight text-left">
          Architectes du changement,<br />
          prototypons l’avenir.
        </h1>
        <p className="mt-6 text-lg max-w-2xl text-left text-neutral-700 dark:text-neutral-300">
          Une plateforme centralisée pour tous les acteurs du foncier : propriétaires, locataires, artisans, notaires, gestionnaires. Partagez, signez, archivez vos documents en toute sécurité.
        </p>
      </div>
    </main>
  );
}