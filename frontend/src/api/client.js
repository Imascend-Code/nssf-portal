// src/api/client.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";
export const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});
// attach access token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// refresh on 401 once
let refreshing = false;
let queue = [];
api.interceptors.response.use((r) => r, async (error) => {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    const original = error.config || {};
    const status = error?.response?.status;
    // do not try to refresh if no refresh token, or if this is the refresh endpoint
    const isRefreshCall = String(original?.url || "").includes("/auth/refresh/");
    if (status === 401 && !original._retry && refreshToken && !isRefreshCall) {
        if (refreshing) {
            return new Promise((resolve, reject) => {
                queue.push((t) => {
                    if (!t)
                        return reject(error);
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${t}`;
                    resolve(api(original));
                });
            });
        }
        original._retry = true;
        refreshing = true;
        try {
            // use the same axios instance so baseURL is consistent
            const { data } = await api.post("/auth/refresh/", { refresh: refreshToken });
            const newAccess = data?.access;
            setTokens({ access: newAccess, refresh: refreshToken });
            queue.forEach((fn) => fn(newAccess));
            queue = [];
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original);
        }
        catch {
            queue.forEach((fn) => fn(null));
            queue = [];
            logout();
            throw error;
        }
        finally {
            refreshing = false;
        }
    }
    throw error;
});
