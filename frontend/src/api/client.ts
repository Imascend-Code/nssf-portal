// src/api/client.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1", //import.meta.env.VITE_API_URL, // e.g. http://127.0.0.1:8000/api/v1
  headers: { "Content-Type": "application/json" },
});

// attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh on 401 once
let refreshing = false;
let queue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    const original = error.config;

    if (error?.response?.status === 401 && !original._retry && refreshToken) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push((t) => {
            if (!t) return reject(error);
            original.headers.Authorization = `Bearer ${t}`;
            resolve(api(original));
          });
        });
      }
      original._retry = true;
      refreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const newAccess = data?.access;
        setTokens({ access: newAccess, refresh: refreshToken });
        queue.forEach((fn) => fn(newAccess));
        queue = [];
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        queue.forEach((fn) => fn(null));
        queue = [];
        logout();
        throw error;
      } finally {
        refreshing = false;
      }
    }
    throw error;
  }
);
