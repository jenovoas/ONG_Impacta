import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

// El backend vive detrás del proxy /api/ de nginx (que strippea el prefijo).
// VITE_API_URL permite apuntar a otro origen en dev.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh-on-401: cuando un request falla con 401 y tenemos refresh_token,
// intentamos /auth/refresh UNA vez. Si falla, limpiamos todo y mandamos al /login.
let refreshing: Promise<string | null> | null = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
    try {
      if (!refreshing) {
        refreshing = axios
          .post(API_BASE + '/auth/refresh',
            { refreshToken }, { headers: { 'Content-Type': 'application/json' } })
          .then((r) => {
            const { access_token, refresh_token } = r.data;
            useAuthStore.getState().updateTokens(access_token, refresh_token);
            return access_token;
          })
          .finally(() => { refreshing = null; });
      }
      const newAccess = await refreshing;
      if (!newAccess) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }
      original._retried = true;
      original.headers.Authorization = `Bearer ${newAccess}`;
      return client(original);
    } catch {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
  }
);

export default client;
