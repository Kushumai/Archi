export default function LegalPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
        Mentions légales
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          <strong>Archi</strong><br />
          Clément Coadou<br />
          Email : support@archi.com
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Plateforme hébergée chez <strong>Vercel</strong> (ou précisez votre hébergeur)<br />
          Adresse: 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          L’ensemble des éléments du site (textes, images, logo, code, etc.) est protégé par le droit d’auteur.
          Toute reproduction totale ou partielle sans autorisation est interdite.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Les informations présentes sur ce site sont données à titre indicatif et peuvent évoluer. L’éditeur ne saurait être tenu responsable de l’utilisation qui en est faite.
        </p>
      </section>

      <section className="mb-2">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Pour toute question ou réclamation, écrivez à <a href="mailto:support@archi.com" className="underline">support@archi.com</a>.
        </p>
      </section>
    </main>
  );
}