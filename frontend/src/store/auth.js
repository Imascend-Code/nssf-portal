// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create()(persist((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setUser: (user) => set({ user }),
    setTokens: ({ access, refresh }) => set({ accessToken: access, refreshToken: refresh }),
    login: (user, tokens) => set({ user, accessToken: tokens.access, refreshToken: tokens.refresh }),
    logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}), { name: "nssf-auth" }));
