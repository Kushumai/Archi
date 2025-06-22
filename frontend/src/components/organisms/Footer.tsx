export function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-zinc-900 dark:border-zinc-700">
      <div className="max-w-screen-xl mx-auto px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} Archi — Tous droits réservés.
      </div>
    </footer>
  )
}