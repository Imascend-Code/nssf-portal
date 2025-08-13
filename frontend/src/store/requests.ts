// src/store/requests.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RequestStatus =
  | "submitted" | "under_review" | "in_progress"
  | "resolved" | "rejected" | "closed";
export type Priority = "low" | "normal" | "high";

type Filters = {
  status?: RequestStatus | "all";
  categoryId?: number | "all";
  q?: string;
};

type ComposeDraft = {
  title: string;
  description: string;
  categoryId?: number;
  priority: Priority;
  files: File[]; // local selected files
};

type RequestState = {
  filters: Filters;
  draft: ComposeDraft;
  selectedRequestId?: number;
};

type RequestActions = {
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  setDraft: (d: Partial<ComposeDraft>) => void;
  resetDraft: () => void;
  setSelected: (id?: number) => void;
  addFiles: (files: File[]) => void;
  removeFileAt: (idx: number) => void;
};

const defaultFilters: Filters = { status: "all", categoryId: "all", q: "" };
const defaultDraft: ComposeDraft = { title: "", description: "", priority: "normal", files: [] };

export const useRequestsStore = create<RequestState & RequestActions>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      draft: defaultDraft,
      selectedRequestId: undefined,
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: defaultFilters }),
      setDraft: (d) => set((s) => ({ draft: { ...s.draft, ...d } })),
      resetDraft: () => set({ draft: defaultDraft }),
      setSelected: (id) => set({ selectedRequestId: id }),
      addFiles: (files) => set((s) => ({ draft: { ...s.draft, files: [...s.draft.files, ...files] } })),
      removeFileAt: (idx) =>
        set((s) => ({
          draft: { ...s.draft, files: s.draft.files.filter((_, i) => i !== idx) },
        })),
    }),
    { name: "nssf-requests", partialize: (s) => ({ filters: s.filters, draft: { ...s.draft, files: [] } }) }
  )
);
