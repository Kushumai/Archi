"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  role?: string;
  username?: string;
  profile?: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get<User>("/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const res = await api.post<{ accessToken: string }>("/auth/login", { email, password });
    const token = res.data.accessToken;

    localStorage.setItem("accessToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    let me;
    try {
      me = await api.get<User>("/me");
    } catch (err) {
      console.log("Erreur lors de la récupération du profil :", err);
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        me = await api.get<User>("/me");
      } catch (err) {
        console.log("Erreur lors de la récupération du profil après attente :", err);
        setUser(null);
        setLoading(false);
        alert("Votre profil n'est pas encore prêt. Merci de patienter quelques secondes et réessayez.");
        return;
      }
    }

    setUser(me.data);
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
