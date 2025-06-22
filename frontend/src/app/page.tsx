"use client"


export default function HomePage() {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-24 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight tracking-tight">
          Archi révolutionne <br />
          la gestion de l'immobilier
        </h1>
        <p className="mt-6 text-lg max-w-2xl">
          Une plateforme centralisée pour tous les acteurs du foncier : propriétaires, locataires, artisans, notaires, gestionnaires. Partagez, signez, archivez vos documents en toute sécurité.
        </p>
      </div>
    </section>
  )
}
