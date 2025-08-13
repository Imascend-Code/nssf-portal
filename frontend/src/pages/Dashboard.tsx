import { Link } from "react-router-dom";
import { useMe, usePayments, useMyRequests } from "../api/hooks";

export default function Dashboard(){
  const me = useMe(); const pays = usePayments(); const reqs = useMyRequests();
  if (me.isLoading || pays.isLoading || reqs.isLoading) return <p style={{padding:24}}>Loading...</p>
  return (
    <div style={{padding:24, display:"grid", gap:16}}>
      <h2>Welcome {me.data?.full_name || me.data?.email}</h2>
      <div>
        <h3>Recent Payments</h3>
        <ul>
          {(pays.data?.results || []).slice(0,5).map((p:any)=>(
            <li key={p.id}>{p.period_start} — {p.amount} — {p.status}</li>
          ))}
        </ul>
        <Link to="/payments">View all</Link>
      </div>
      <div>
        <h3>Recent Requests</h3>
        <ul>
          {(reqs.data?.results || []).slice(0,5).map((r:any)=>(
            <li key={r.id}>{r.title} — {r.status}</li>
          ))}
        </ul>
        <Link to="/requests">My requests</Link> | <Link to="/requests/new">New request</Link>
      </div>
    </div>
  )
}
