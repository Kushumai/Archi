import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/atoms/ThemeProvider";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AuthProvider } from "@/contexts/authContext";

export const metadata: Metadata = {
  title: "Archi",
  description: "Plateforme immobilière intelligente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
              {children}
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}