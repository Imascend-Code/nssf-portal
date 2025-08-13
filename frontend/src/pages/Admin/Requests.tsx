import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
export default function AdminRequests(){
  const q = useQuery({queryKey:["requests-admin"], queryFn: async()=> (await api.get("/requests/")).data})
  if (q.isLoading) return <p style={{padding:24}}>Loading...</p>
  return (
    <div style={{padding:24}}>
      <h2>All Requests</h2>
      <ul>{(q.data?.results||[]).map((r:any)=>(<li key={r.id}>{r.title} — {r.status}</li>))}</ul>
    </div>
  )
}
