// frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '../services/authService';  // ← importer tout le service

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Au montage, charger le token existant
  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored) setToken(stored);
  }, []);

  // wrapper sur authService.login
  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const newToken = localStorage.getItem('accessToken');
    if (newToken) {
      setToken(newToken);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};