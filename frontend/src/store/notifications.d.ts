type NotifState = {
    unread: number;
};
type NotifActions = {
    setUnread: (n: number) => void;
    inc: (n?: number) => void;
    dec: (n?: number) => void;
};
export declare const useNotifStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NotifState & NotifActions>>;
export {};
