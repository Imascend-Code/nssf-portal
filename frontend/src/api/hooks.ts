// src/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { useAuthStore } from "../store/auth";
import type { User } from "../store/auth";

/* =========================
   AUTH
   ========================= */

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      // 1) get tokens
      const { data: tokens } = await api.post("/auth/login/", payload);

      // 2) store tokens immediately so Authorization header attaches
      setTokens({ access: tokens.access, refresh: tokens.refresh });

      // 3) fetch current user (now includes Bearer)
      const { data: me } = await api.get<User>("/users/me/");

      // 4) persist user + tokens
      login(me, { access: tokens.access, refresh: tokens.refresh });
      return me;
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      full_name?: string;
      phone?: string;
    }) => {
      await api.post("/auth/register/", payload);

      // Login after registering
      const { data: tokens } = await api.post("/auth/login/", {
        email: payload.email,
        password: payload.password,
      });

      setTokens({ access: tokens.access, refresh: tokens.refresh });

      const { data: me } = await api.get<User>("/users/me/");
      login(me, { access: tokens.access, refresh: tokens.refresh });
      return me;
    },
  });
}

/** One-time fetch of the current user if a token exists but store has no user yet. */
export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["me"],
    enabled: !!token && !user,
    queryFn: async () => {
      const { data } = await api.get<User>("/users/me/");
      setUser(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* =========================
   PROFILE
   ========================= */

export function useProfile() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["profile", "me"],
    enabled: !!token,
    queryFn: async () => (await api.get("/users/me/")).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      address?: string;
      city?: string;
      bank_name?: string;
      bank_account?: string;
      // add other editable fields here
    }) => (await api.patch("/users/me/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

/* =========================
   BENEFICIARIES
   (router.register("profiles/beneficiaries", ...))
   ========================= */

export function useBeneficiaries(params?: Record<string, any>) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["beneficiaries", params],
    enabled: !!token,
    queryFn: async () =>
      (await api.get("/profiles/beneficiaries/", { params })).data,
  });
}

export function useAddBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      full_name: string;
      relationship: string;
      percentage: number;
      phone?: string;
      national_id?: string;
    }) => (await api.post("/profiles/beneficiaries/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beneficiaries"] });
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

/* =========================
   PAYMENTS
   ========================= */

export function usePayments(params?: Record<string, any>) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["payments", params],
    enabled: !!token,
    queryFn: async () => (await api.get("/payments/", { params })).data,
  });
}

/* =========================
   REQUESTS (pensioner)
   ========================= */

export function useMyRequests(params?: Record<string, any>) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["my-requests", params],
    enabled: !!token,
    queryFn: async () => (await api.get("/requests/", { params })).data, // backend filters by requester
  });
}

export function useCategories() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["service-categories"],
    enabled: !!token, // set to false if public
    queryFn: async () => (await api.get("/service-categories/")).data,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      category: number;
      priority: string;
    }) => (await api.post("/requests/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
}

export function useUploadAttachment(requestId: number) {
  return useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await api.post(`/requests/${requestId}/attachments/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data,
  });
}

/* =========================
   REPORTS
   ========================= */

export function useReport() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["report-summary"],
    enabled: !!token,
    queryFn: async () => (await api.get("/reports/summary/")).data,
  });
}
