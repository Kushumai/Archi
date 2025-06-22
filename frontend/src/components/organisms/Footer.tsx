"use client";

export function Footer() {
  return (
    <footer className="w-full px-4 md:px-8 lg:px-16 py-6 bg-zinc-950 text-white text-sm">
      <div className="flex flex-wrap items-center justify-between gap-y-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#" className="hover:underline">
            À propos
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Mentions légales
          </a>
          <a href="#" className="hover:underline">
            Politique de confidentialité
          </a>
          <a href="#" className="hover:underline">
            Politique de cookies
          </a>
        </div>

        <span className="whitespace-nowrap">
          © {new Date().getFullYear()} Archi — Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}
