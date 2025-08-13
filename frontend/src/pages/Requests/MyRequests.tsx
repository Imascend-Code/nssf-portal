import { Link } from "react-router-dom";
import { useMyRequests } from "../../api/hooks";
export default function MyRequests(){
  const q = useMyRequests()
  if (q.isLoading) return <p style={{padding:24}}>Loading...</p>
  return (
    <div style={{padding:24}}>
      <h2>My Requests</h2>
      <ul>
        {(q.data?.results||[]).map((r:any)=>(
          <li key={r.id}><Link to={`/requests/${r.id}`}>{r.title}</Link> — {r.status}</li>
        ))}
      </ul>
    </div>
  )
}
