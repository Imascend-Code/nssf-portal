// src/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { useAuthStore } from "../store/auth";
function asArray(payload) {
    if (!payload)
        return [];
    if (Array.isArray(payload))
        return payload;
    return payload.results ?? [];
}
/* =====================================================================================
   Small helpers
===================================================================================== */
const EP = {
    LOGIN: "/auth/login/",
    REFRESH: "/auth/refresh/", // used by axios interceptor, not here
    REGISTER: "/auth/register/",
    ME: "/users/me/",
    BENEFICIARIES: "/profiles/beneficiaries/",
    PAYMENTS: "/payments/",
    REQUESTS: "/requests/",
    CATEGORIES: "/service-categories/",
    REPORT_SUMMARY: "/reports/summary/",
};
const ME_STALE = 5 * 60 * 1000;
/* =====================================================================================
   AUTH
===================================================================================== */
export function useLogin() {
    const login = useAuthStore((s) => s.login);
    const setTokens = useAuthStore((s) => s.setTokens);
    return useMutation({
        mutationFn: async (payload) => {
            // 1) get tokens
            const { data: tokens } = await api.post(EP.LOGIN, payload);
            // 2) store tokens first so Authorization is attached
            setTokens({ access: tokens.access, refresh: tokens.refresh });
            // 3) fetch user (bearer will be added by interceptor)
            const { data: me } = await api.get(EP.ME);
            // 4) store user + tokens
            login(me, { access: tokens.access, refresh: tokens.refresh });
            return me;
        },
    });
}
export function useRegister() {
    const login = useAuthStore((s) => s.login);
    const setTokens = useAuthStore((s) => s.setTokens);
    return useMutation({
        mutationFn: async (payload) => {
            await api.post(EP.REGISTER, payload);
            const { data: tokens } = await api.post(EP.LOGIN, {
                email: payload.email,
                password: payload.password,
            });
            setTokens({ access: tokens.access, refresh: tokens.refresh });
            const { data: me } = await api.get(EP.ME);
            login(me, { access: tokens.access, refresh: tokens.refresh });
            return me;
        },
    });
}
/** One-time fetch if token exists but store has no user yet */
export function useMe() {
    const setUser = useAuthStore((s) => s.setUser);
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["me"],
        enabled: !!token && !user,
        queryFn: async () => {
            const { data } = await api.get(EP.ME);
            setUser(data);
            return data;
        },
        staleTime: ME_STALE,
    });
}
/* =====================================================================================
   PROFILE (current user)
===================================================================================== */
export function useProfile() {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["profile", "me"],
        enabled: !!token,
        queryFn: async () => (await api.get(EP.ME)).data,
        staleTime: ME_STALE,
    });
}
export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => (await api.patch(EP.ME, payload)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["profile", "me"] });
            qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
/* =====================================================================================
   BENEFICIARIES
===================================================================================== */
export function useBeneficiaries(params) {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["beneficiaries", params],
        enabled: !!token,
        queryFn: async () => (await api.get(EP.BENEFICIARIES, { params })).data,
    });
}
export function useAddBeneficiary() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => (await api.post(EP.BENEFICIARIES, payload)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["beneficiaries"] });
            qc.invalidateQueries({ queryKey: ["profile", "me"] });
        },
    });
}
/* =====================================================================================
   PAYMENTS
===================================================================================== */
export function usePayments(params) {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["payments", params],
        enabled: !!token,
        queryFn: async () => {
            const { data } = await api.get(EP.PAYMENTS, { params });
            // normalize to array for easy rendering
            return asArray(data);
        },
    });
}
/* =====================================================================================
   REQUESTS (member)
===================================================================================== */
export function useMyRequests(params) {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["my-requests", params],
        enabled: !!token,
        queryFn: async () => (await api.get(EP.REQUESTS, { params })).data, // backend should filter by requester
    });
}
export function useCategories() {
    const token = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["service-categories"],
        enabled: !!token, // set to false if public
        queryFn: async () => (await api.get(EP.CATEGORIES)).data,
    });
}
export function useCreateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => (await api.post(EP.REQUESTS, payload)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-requests"] });
        },
    });
}
export function useUploadAttachment(requestId) {
    return useMutation({
        mutationFn: async (formData) => (await api.post(`${EP.REQUESTS}${requestId}/attachments/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })).data,
    });
}
/* =====================================================================================
   REPORTS (admin-only)
===================================================================================== */
export function useReport() {
    const token = useAuthStore((s) => s.accessToken);
    const user = useAuthStore((s) => s.user);
    // Only enable for admins/staff/superusers to avoid 403 chatter
    const isAdmin = !!user && (user.role === "ADMIN" || user.is_staff === true || user.is_superuser === true);
    return useQuery({
        queryKey: ["report-summary"],
        enabled: !!token && isAdmin,
        queryFn: async () => (await api.get(EP.REPORT_SUMMARY)).data,
        // If backend throws 401/403, don't retry forever.
        retry: (attempt, err) => {
            const s = err?.response?.status;
            if (s === 401 || s === 403)
                return false;
            return attempt < 2;
        },
    });
}
