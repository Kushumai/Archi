export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg">Page non trouvée.</p>
    </div>
  );
}