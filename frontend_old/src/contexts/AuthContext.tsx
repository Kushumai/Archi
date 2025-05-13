// frontend/src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';    // ← votre instance, PAS axios

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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  console.log('🛠 api.defaults.baseURL =', api.defaults.baseURL);
  console.log('🛠 api.defaults.withCredentials =', api.defaults.withCredentials);


  const login = async (email: string, password: string) => {
    console.log('🛠 Calling api.post("/auth/login")…');
    const response = await api.post('/auth/login', { email, password });
    console.log('🛠 api.post resolved with', response.status, response.data);
    const token = response.data.accessToken;
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAccessToken(token);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
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