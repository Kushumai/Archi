export const Footer = () => {
  return (
    <footer className="w-full bg-[var(--color-background)] text-center text-xs text-[var(--color-text)] py-4">
      © {new Date().getFullYear()} Archi. Tous droits réservés.
    </footer>
  );
};