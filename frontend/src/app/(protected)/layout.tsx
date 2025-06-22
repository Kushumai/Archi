import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verify } from "jsonwebtoken"
import type { ReactNode } from "react"
import Link from "next/link"
import LogoutButton from "@/components/atoms/LogoutButton"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("refreshToken")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    verify(token, process.env.JWT_SECRET!)
  } catch {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <nav className="space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/profile" className="hover:underline">Profil</Link>
        </nav>
        <LogoutButton />
      </header>

      <main className="px-6 py-8 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
