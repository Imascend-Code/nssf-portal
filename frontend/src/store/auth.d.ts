export type Role = "PENSIONER" | "STAFF" | "ADMIN";
export type User = {
    id: number;
    email: string;
    role: Role;
    full_name?: string;
    phone?: string;
};
type State = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
};
type Actions = {
    setUser: (u: User | null) => void;
    setTokens: (t: {
        access: string | null;
        refresh: string | null;
    }) => void;
    login: (u: User, t: {
        access: string;
        refresh: string;
    }) => void;
    logout: () => void;
};
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<State & Actions>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<State & Actions, State & Actions>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: State & Actions) => void) => () => void;
        onFinishHydration: (fn: (state: State & Actions) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<State & Actions, State & Actions>>;
    };
}>;
export {};
