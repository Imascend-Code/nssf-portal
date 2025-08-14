// src/api/notifications.ts
import { api } from "../api/client";
export async function fetchUnreadCount() {
    return (await api.get("/notifications/unread_count/")).data;
}
export async function fetchNotifications() {
    return (await api.get("/notifications/")).data;
}
export async function markRead(id) {
    return (await api.post(`/notifications/${id}/mark_read/`)).data;
}
export async function markAllRead() {
    return (await api.post("/notifications/mark_all_read/`")).data;
}
export async function markManyRead(ids) {
    return (await api.post("/notifications/mark_many_read/", { ids })).data;
}
