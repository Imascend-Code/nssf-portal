// src/store/ui.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useUIStore = create()(persist((set) => ({
    theme: "system",
    sidebarOpen: false,
    busy: false,
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setBusy: (busy) => set({ busy }),
}), { name: "nssf-ui" }));
