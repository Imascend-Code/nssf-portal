// src/store/ui.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

type UIState = {
  theme: Theme;
  sidebarOpen: boolean;
  busy: boolean;
};

type UIActions = {
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  setBusy: (b: boolean) => void;
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: false,
      busy: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setBusy: (busy) => set({ busy }),
    }),
    { name: "nssf-ui" }
  )
);
