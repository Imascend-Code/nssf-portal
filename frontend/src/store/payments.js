// src/store/payments.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
const initial = { status: "all" };
export const usePaymentsStore = create()(persist((set) => ({
    filters: initial,
    setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
    resetFilters: () => set({ filters: initial }),
}), { name: "nssf-payments" }));
