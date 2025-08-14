// src/store/notifications.ts
import { create } from "zustand";
export const useNotifStore = create()((set) => ({
    unread: 0,
    setUnread: (n) => set({ unread: Math.max(0, n) }),
    inc: (n = 1) => set((s) => ({ unread: s.unread + n })),
    dec: (n = 1) => set((s) => ({ unread: Math.max(0, s.unread - n) })),
}));
