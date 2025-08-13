import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";

export default function RequestDetail(){
  const { id } = useParams();
  const q = useQuery({ queryKey:["request",id], queryFn: async()=> (await api.get(`/requests/${id}/`)).data })
  if (q.isLoading) return <p style={{padding:24}}>Loading...</p>
  const r = q.data
  return (
    <div style={{padding:24}}>
      <h2>{r.title}</h2>
      <p>Status: {r.status} | Priority: {r.priority}</p>
      <p>{r.description}</p>
      <h4>Attachments</h4>
      <ul>{(r.attachments||[]).map((a:any)=>(<li key={a.id}><a href={a.file} target="_blank">file</a></li>))}</ul>
    </div>
  )
}
