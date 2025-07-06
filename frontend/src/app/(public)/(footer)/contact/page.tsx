"use client";

export default function ContactPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
        Contact
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
        Une question, une remarque ou un besoin de support ?  
        Utilisez le formulaire ci-dessous ou contactez-nous par email, nous vous répondrons rapidement.
      </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={e => {
          e.preventDefault();
          alert("Message envoyé ! (fonctionnalité non implémentée)");
        }}
      >
        <div>
          <label htmlFor="email" className="block font-medium text-neutral-900 dark:text-white mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-700"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-medium text-neutral-900 dark:text-white mb-1">
            Message *
          </label>
          <textarea
            id="message"
            required
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-700 min-h-[100px]"
          />
        </div>
        <button
          type="submit"
          className="self-end px-6 py-2 bg-zinc-950 text-white font-semibold rounded hover:bg-zinc-800 transition"
        >
          Envoyer
        </button>
      </form>
      <div className="mt-8 text-sm text-neutral-500">
        Vous pouvez aussi écrire à:{" "}
        <a href="mailto:support@archi.com" className="underline">
          support@archi.com
        </a>
      </div>
    </main>
  );
}