"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/api"
import { jwtDecode } from "jwt-decode"

interface User {
  id: string
  email: string
  username?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await axios.post("/auth/refresh", {}, { withCredentials: true })
        const token = res.data.accessToken
        const decoded = jwtDecode<User>(token)
        setAccessToken(token)
        setUser(decoded)
      } catch {
        setAccessToken(null)
        setUser(null)
      }
    }

    tryRefresh()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/auth/login", { email, password }, { withCredentials: true })
      const token = res.data.accessToken
      const decoded = jwtDecode<User>(token)
      setAccessToken(token)
      setUser(decoded)
      router.push("/dashboard")
    } catch {
      throw new Error("Échec de la connexion")
    }
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!accessToken,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}