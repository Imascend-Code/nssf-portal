// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "PENSIONER" | "STAFF" | "ADMIN";
export type User = {
  id: number;
  email: string;
  role: Role;
  full_name?: string;
  phone?: string;
};

type State = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type Actions = {
  setUser: (u: User | null) => void;
  setTokens: (t: { access: string | null; refresh: string | null }) => void;
  login: (u: User, t: { access: string; refresh: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: ({ access, refresh }) => set({ accessToken: access, refreshToken: refresh }),
      login: (user, tokens) => set({ user, accessToken: tokens.access, refreshToken: tokens.refresh }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "nssf-auth" }
  )
);
