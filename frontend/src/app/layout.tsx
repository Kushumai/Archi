import "@/styles/globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/authContext"

export const metadata: Metadata = {
  title: "Ton App",
  description: "Description",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
