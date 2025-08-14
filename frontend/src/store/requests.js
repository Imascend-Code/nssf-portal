// src/store/requests.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
const defaultFilters = { status: "all", categoryId: "all", q: "" };
const defaultDraft = { title: "", description: "", priority: "normal", files: [] };
export const useRequestsStore = create()(persist((set) => ({
    filters: defaultFilters,
    draft: defaultDraft,
    selectedRequestId: undefined,
    setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
    resetFilters: () => set({ filters: defaultFilters }),
    setDraft: (d) => set((s) => ({ draft: { ...s.draft, ...d } })),
    resetDraft: () => set({ draft: defaultDraft }),
    setSelected: (id) => set({ selectedRequestId: id }),
    addFiles: (files) => set((s) => ({ draft: { ...s.draft, files: [...s.draft.files, ...files] } })),
    removeFileAt: (idx) => set((s) => ({
        draft: { ...s.draft, files: s.draft.files.filter((_, i) => i !== idx) },
    })),
}), { name: "nssf-requests", partialize: (s) => ({ filters: s.filters, draft: { ...s.draft, files: [] } }) }));
