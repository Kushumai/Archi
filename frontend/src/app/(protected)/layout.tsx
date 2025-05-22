import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verify } from "jsonwebtoken"
import type { ReactNode } from "react"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("refreshToken")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    verify(token, process.env.JWT_SECRET!)
  } catch (err) {
    redirect("/login")
  }

  return <>{children}</>
}
