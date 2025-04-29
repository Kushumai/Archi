// frontend/src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "../contexts/AuthContext"

export const metadata: Metadata = {
  title: "Nom à définir",
  description: "Gestion de dossiers de location immobilière entre locataires et propriétaires"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}