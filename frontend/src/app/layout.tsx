import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/authContext";
import { MainLayout } from "@/components/templates/MainLayout";

export const metadata: Metadata = {
  title: "Archi",
  description: "Application de gestion immobilière",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}