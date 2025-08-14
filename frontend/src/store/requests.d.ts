export type RequestStatus = "submitted" | "under_review" | "in_progress" | "resolved" | "rejected" | "closed";
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
    files: File[];
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
export declare const useRequestsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<RequestState & RequestActions>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<RequestState & RequestActions, {
            filters: Filters;
            draft: {
                files: never[];
                title: string;
                description: string;
                categoryId?: number;
                priority: Priority;
            };
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: RequestState & RequestActions) => void) => () => void;
        onFinishHydration: (fn: (state: RequestState & RequestActions) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<RequestState & RequestActions, {
            filters: Filters;
            draft: {
                files: never[];
                title: string;
                description: string;
                categoryId?: number;
                priority: Priority;
            };
        }>>;
    };
}>;
export {};
