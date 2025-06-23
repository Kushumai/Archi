// src/lib/api.ts
import axios, { AxiosError } from "axios";

// Instance Axios pointant vers ton BFF (préfixe /api/v1)
export const api = axios.create({
  baseURL: "/api/v1",
});

// Intercepteur pour injecter automatiquement le token stocké en localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && config.headers) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Gestion basique des erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
