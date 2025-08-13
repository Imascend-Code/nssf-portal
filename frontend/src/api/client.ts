import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve,reject)=>queue.push({resolve,reject}))
          .then((token:string)=>{ original.headers.Authorization=`Bearer ${token}`; return api(original); });
      }
      original._retry = true; isRefreshing = true;
      try {
        const refresh = useAuthStore.getState().refreshToken;
        if (!refresh) throw new Error("no refresh");
        const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/refresh/", {refresh});
        const newAccess = res.data.access;
        useAuthStore.getState().setTokens(newAccess, refresh);
        queue.forEach(p => p.resolve(newAccess)); queue = [];
        return api(original);
      } catch (e) {
        queue.forEach(p => p.reject(e)); queue = [];
        useAuthStore.getState().logout();
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
