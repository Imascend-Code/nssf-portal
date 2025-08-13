// src/api/notifications.ts
import { api } from "@/api/client";

export type Notification = {
  id: number;
  channel: "in_app" | "email";
  subject: string;
  message: string;
  was_read: boolean;
  sent_at: string;
};

export async function fetchUnreadCount(): Promise<{ unread: number }> {
  return (await api.get("/notifications/unread_count/")).data;
}

export async function fetchNotifications(): Promise<Notification[] | { results: Notification[] }> {
  return (await api.get("/notifications/")).data;
}

export async function markRead(id: number) {
  return (await api.post(`/notifications/${id}/mark_read/`)).data;
}

export async function markAllRead() {
  return (await api.post("/notifications/mark_all_read/`")).data;
}

export async function markManyRead(ids: number[]) {
  return (await api.post("/notifications/mark_many_read/", { ids })).data;
}
