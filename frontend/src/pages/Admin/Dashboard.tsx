import { useReport } from "../../api/hooks";
export default function AdminDashboard(){
  const r = useReport()
  if (r.isLoading) return <p style={{padding:24}}>Loading...</p>
  return <pre style={{padding:24, background:"#f5f5f5"}}>{JSON.stringify(r.data,null,2)}</pre>
}
