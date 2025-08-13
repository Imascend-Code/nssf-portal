// src/store/payments.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentFilters = {
  status?: "processed" | "pending" | "on_hold" | "all";
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
};

type PaymentState = {
  filters: PaymentFilters;
};

type PaymentActions = {
  setFilters: (f: Partial<PaymentFilters>) => void;
  resetFilters: () => void;
};

const initial: PaymentFilters = { status: "all" };

export const usePaymentsStore = create<PaymentState & PaymentActions>()(
  persist(
    (set) => ({
      filters: initial,
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: initial }),
    }),
    { name: "nssf-payments" }
  )
);
