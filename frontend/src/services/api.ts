// frontend/src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: '/api',          // proxied by Next.js rewrites
  withCredentials: true,    // sends cookies for refresh token if used
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh token state
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let subscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalReq = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 once per request
    if (error.response?.status !== 401 || originalReq._retry) {
      return Promise.reject(error);
    }

    // Don't retry the refresh endpoint itself
    if (originalReq.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    originalReq._retry = true;

    // Start refresh once
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = api
        .post('/auth/refresh')
        .then(res => {
          const newToken = res.data.accessToken;
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          onRefreshed(newToken);
          isRefreshing = false;
          return newToken;
        })
        .catch(err => {
          isRefreshing = false;
          // redirect to login on refresh failure
          window.location.href = '/login';
          return Promise.reject(err);
        });
    }

    // Wait for refresh to complete, then replay original request
    return new Promise(resolve => {
      subscribers.push(token => {
        if (!originalReq.headers) originalReq.headers = {};
        (originalReq.headers as any)['Authorization'] = `Bearer ${token}`;
        resolve(api(originalReq));
      });
    });
  }
);

export default api;