export type Notification = {
    id: number;
    channel: "in_app" | "email";
    subject: string;
    message: string;
    was_read: boolean;
    sent_at: string;
};
export declare function fetchUnreadCount(): Promise<{
    unread: number;
}>;
export declare function fetchNotifications(): Promise<Notification[] | {
    results: Notification[];
}>;
export declare function markRead(id: number): Promise<any>;
export declare function markAllRead(): Promise<any>;
export declare function markManyRead(ids: number[]): Promise<any>;
