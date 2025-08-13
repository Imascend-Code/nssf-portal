import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export function useMe() {
  return useQuery({ queryKey:["me"], queryFn: async()=> (await api.get("/auth/me/")).data });
}
export function useProfile() {
  return useQuery({ queryKey:["profile"], queryFn: async()=> (await api.get("/profiles/me/")).data });
}
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch:any)=> (await api.patch("/profiles/me/","avatar" in patch ? patch : patch, {headers: patch?.avatar ? {"Content-Type":"multipart/form-data"}:{} })).data,
    onSuccess: ()=> qc.invalidateQueries({queryKey:["profile"]})
  })
}
export function useBeneficiaries() {
  return useQuery({queryKey:["beneficiaries"], queryFn: async()=> (await api.get("/profiles/me/beneficiaries/")).data})
}
export function useAddBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload:any)=> api.post("/profiles/me/beneficiaries/", payload).then(r=>r.data),
    onSuccess: ()=> qc.invalidateQueries({queryKey:["beneficiaries"]})
  })
}
export function usePayments(filters:any = {}) {
  return useQuery({ queryKey:["payments",filters], queryFn: async()=> (await api.get("/payments/", {params:filters})).data })
}
export function useCategories() {
  return useQuery({ queryKey:["categories"], queryFn: async()=> (await api.get("/service-categories/")).data })
}
export function useMyRequests(filters:any={}) {
  return useQuery({ queryKey:["requests",filters], queryFn: async()=> (await api.get("/requests/", {params:filters})).data })
}
export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload:any)=> api.post("/requests/", payload).then(r=>r.data),
    onSuccess: ()=> qc.invalidateQueries({queryKey:["requests"]})
  })
}
export function useUploadAttachment(id:number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd:FormData)=> api.post(`/requests/${id}/attachments/`, fd, {headers:{"Content-Type":"multipart/form-data"}}).then(r=>r.data),
    onSuccess: ()=> qc.invalidateQueries({queryKey:["requests"]})
  })
}
export function useReport() {
  return useQuery({ queryKey:["report"], queryFn: async()=> (await api.get("/reports/summary/")).data })
}
