type PaymentFilters = {
    status?: "processed" | "pending" | "on_hold" | "all";
    start?: string;
    end?: string;
};
type PaymentState = {
    filters: PaymentFilters;
};
type PaymentActions = {
    setFilters: (f: Partial<PaymentFilters>) => void;
    resetFilters: () => void;
};
export declare const usePaymentsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PaymentState & PaymentActions>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PaymentState & PaymentActions, PaymentState & PaymentActions>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PaymentState & PaymentActions) => void) => () => void;
        onFinishHydration: (fn: (state: PaymentState & PaymentActions) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PaymentState & PaymentActions, PaymentState & PaymentActions>>;
    };
}>;
export {};
