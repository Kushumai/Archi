import "@/styles/globals.css"
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/authContext";
import { MainLayout } from "@/components/templates/MainLayout";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Archi",
  description: "Application de gestion immobilière",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">
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