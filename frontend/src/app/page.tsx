import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur Archi 👋</h1>
      <div className="bg-debugpink text-white p-4">
        Si tu vois ce bloc rose fluo → Tailwind colors fonctionne ✅
      </div>
      <ThemeSwitcher />
    </main>
  );
}