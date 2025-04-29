// frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // Au montage, on tente de charger le token depuis le localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const token = response.data.accessToken;
    // Stockage et configuration d’Axios
    localStorage.setItem('accessToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAccessToken(token);
    // Redirection vers la page d’accueil après login
    router.push('/dashboard');
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['Authorization'];
    setAccessToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};