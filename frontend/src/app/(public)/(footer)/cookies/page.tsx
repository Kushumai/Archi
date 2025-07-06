export default function CookiesPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
        Politique de cookies
      </h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        Ce site utilise des cookies uniquement pour assurer le bon fonctionnement de la plateforme et améliorer votre expérience utilisateur.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Qu’est-ce qu’un cookie ?</h2>
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la navigation sur un site web. Il permet de mémoriser certaines informations entre les visites (préférences, connexion, etc.).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Quels cookies utilisons-nous ?</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Cookies de session</strong> : pour maintenir votre connexion sécurisée.</li>
          <li><strong>Cookies techniques</strong> : nécessaires au fonctionnement du site.</li>
        </ul>
        <p className="mt-2">
          Nous n’utilisons pas de cookies publicitaires ni de tracking tiers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Gestion des cookies</h2>
        <p>
          Vous pouvez gérer ou supprimer les cookies à tout moment dans les paramètres de votre navigateur.  
          La suppression des cookies essentiels peut toutefois perturber le fonctionnement du site.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Pour toute question sur l’utilisation des cookies, écrivez à&nbsp;
          <a href="mailto:support@archi.com" className="underline">support@archi.com</a>.
        </p>
      </section>
    </main>
  );
}