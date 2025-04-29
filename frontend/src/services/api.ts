// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',  // ← l’URL de votre auth-service
    headers: {
      'Content-Type': 'application/json',
    },
});

// interceptor d’envoi de token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// (Optionnel) Interceptor de réponse pour gérer le refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Appel pour rafraîchir le token
      const { data } = await api.post('/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('accessToken', data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;