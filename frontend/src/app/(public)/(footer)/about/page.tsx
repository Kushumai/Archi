export default function AboutPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
        À propos
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
        <strong>Archi</strong> est une plateforme innovante de gestion de documents et d’acteurs du foncier. Elle centralise l’ensemble des démarches et des échanges pour les particuliers, professionnels et tous les acteurs de l’immobilier, dans un environnement sécurisé et respectueux de vos données.
      </p>
      <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 mb-8 space-y-2">
        <li>Stockage et partage sécurisé de vos documents</li>
        <li>Accès multi-acteurs: propriétaires, locataires, artisans, notaires, gestionnaires…</li>
        <li>Respect de la vie privée, RGPD et transparence</li>
        <li>Développé dans le cadre de la certification RNCP 37873</li>
      </ul>
      <p className="text-sm text-neutral-500">
        Cette application a été conçue par Clément Coadou et réalisée dans un cadre pédagogique.
      </p>
    </main>
  );
}
