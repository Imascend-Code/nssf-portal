// src/api/hooks.ts

import { useAuthStore } from "../store/auth";
import type { User } from "../store/auth"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

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


// 1) My Profile
export function useProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => (await api.get("/profiles/me/")).data,
    staleTime: 5 * 60 * 1000,
  });
}

// 2) Update Profile (PATCH /profiles/me/)
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      address?: string;
      city?: string;
      bank_name?: string;
      bank_account?: string;
      // you can include other editable fields you support
    }) => (await api.patch("/profiles/me/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

// 3) List my beneficiaries
export function useBeneficiaries(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["beneficiaries", params],
    queryFn: async () => (await api.get("/profiles/me/beneficiaries/", { params })).data,
  });
}

// 4) Add a beneficiary (POST /profiles/me/beneficiaries/)
export function useAddBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      full_name: string;
      relationship: string;
      percentage: number;
      phone?: string;
      national_id?: string;
    }) => (await api.post("/profiles/me/beneficiaries/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beneficiaries"] });
      qc.invalidateQueries({ queryKey: ["profile", "me"] }); // if server recalculates % or any summary
    },
  });
}