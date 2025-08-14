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
export declare const useUIStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<UIState & UIActions>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UIState & UIActions, UIState & UIActions>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UIState & UIActions) => void) => () => void;
        onFinishHydration: (fn: (state: UIState & UIActions) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UIState & UIActions, UIState & UIActions>>;
    };
}>;
export {};
