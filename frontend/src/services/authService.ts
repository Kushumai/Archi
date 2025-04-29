// frontend/src/services/authService.ts
import api from './api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<void> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
}

export async function refreshToken(): Promise<void> {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {
    refreshToken: localStorage.getItem('refreshToken'),
  });
  localStorage.setItem('accessToken', data.accessToken);
}

export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}