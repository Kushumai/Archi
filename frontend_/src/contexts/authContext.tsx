"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api, setAccessToken as storeTokenInApi } from "@/lib/api"

interface User {
  id: string
  email: string
  role?: string
  username?: string
  profile?: string
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
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const token = res.data.accessToken;
        setAccessToken(token);
        storeTokenInApi(token);
        const me = await api.get("/me", { withCredentials: true });
        setUser(me.data);
      } catch {
        setAccessToken(null);
        storeTokenInApi(null);
        setUser(null);
      }
    };

    const hasRefreshToken = document.cookie.split(';').some(cookie => cookie.trim().startsWith('refreshToken='));

    if (hasRefreshToken) {
      tryRefresh();
    } else {
      setAccessToken(null);
      storeTokenInApi(null);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true })
      const token = res.data.accessToken

      setAccessToken(token)
      storeTokenInApi(token)

      const me = await api.get("/me", { withCredentials: true })
      setUser(me.data)

      router.push("/dashboard")
    } catch {
      throw new Error("Échec de la connexion")
    }
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true })
    } catch {
      console.error("Logout failed")
    }
    setAccessToken(null)
    storeTokenInApi(null)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!accessToken, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}