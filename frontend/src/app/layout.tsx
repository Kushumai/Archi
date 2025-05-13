import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Archi",
  description: "Application de gestion immobilière",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}