export default function PrivacyPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
        Politique de confidentialité
      </h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        Nous accordons la plus grande importance à la protection de vos données personnelles et au respect du RGPD.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Données collectées</h2>
        <p>
          Lors de la création de votre compte et de l’utilisation de la plateforme, nous collectons uniquement les informations nécessaires à votre identification (nom, prénom, email) et à la gestion de vos documents.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Utilisation de vos données</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Gestion de votre compte et de vos accès</li>
          <li>Stockage de vos documents</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Partage et confidentialité</h2>
        <p>
          Vos données ne sont jamais transmises à des tiers sans votre accord. Elles sont stockées dans des environnements sécurisés et ne sont accessibles qu’aux personnes autorisées.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Droit d’accès, modification et suppression</h2>
        <p>
          Conformément au RGPD, vous pouvez à tout moment accéder à vos données, les corriger ou demander leur suppression depuis votre profil ou en nous contactant à l’adresse&nbsp;
          <a href="mailto:support@archi.com" className="underline">support@archi.com</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Pour toute question sur la protection de vos données, écrivez à&nbsp;
          <a href="mailto:support@archi.com" className="underline">support@archi.com</a>.
        </p>
      </section>
    </main>
  );
}