import { ThemeSwitcher } from "@/components/atoms/ThemeSwitcher";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur Archi 👋</h1>
      <ThemeSwitcher />
    </main>
  );
}