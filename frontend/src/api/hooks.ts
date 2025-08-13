// src/api/hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./client";
import { useAuthStore, User } from "../store/auth";

// Auth
export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data: tokens } = await api.post("/auth/login/", payload);
      const { data: me } = await api.get<User>("/users/me/");
      login(me, { access: tokens.access, refresh: tokens.refresh });
      return me;
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; full_name?: string; phone?: string }) => {
      await api.post("/auth/register/", payload);
      const { data: tokens } = await api.post("/auth/login/", { email: payload.email, password: payload.password });
      const { data: me } = await api.get<User>("/users/me/");
      login(me, { access: tokens.access, refresh: tokens.refresh });
      return me;
    },
  });
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const enabled = !!useAuthStore.getState().accessToken && !user;
  return useQuery({
    queryKey: ["me"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<User>("/users/me/");
      setUser(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Payments
export function usePayments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => (await api.get("/payments/", { params })).data,
  });
}

// Requests (pensioner’s own)
export function useMyRequests(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["my-requests", params],
    queryFn: async () => (await api.get("/requests/", { params })).data, // backend filters to requester for pensioner role
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => (await api.get("/service-categories/")).data,
  });
}

export function useCreateRequest() {
  return useMutation({
    mutationFn: async (payload: { title: any; description: any; category: number; priority: any }) => {
      const { data } = await api.post("/requests/", payload);
      return data;
    },
  });
}

export function useUploadAttachment(requestId: number) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(`/requests/${requestId}/attachments/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
}

// Admin report
export function useReport() {
  return useQuery({
    queryKey: ["report-summary"],
    queryFn: async () => (await api.get("/reports/summary/")).data,
  });
}
