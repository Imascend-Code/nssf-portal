import { usePayments } from "../api/hooks";
export default function Payments(){
  const q = usePayments();
  if (q.isLoading) return <p style={{padding:24}}>Loading...</p>
  return (
    <div style={{padding:24}}>
      <h2>Payment History</h2>
      <table><thead><tr><th>Period</th><th>Amount</th><th>Status</th><th>Ref</th></tr></thead>
      <tbody>
        {(q.data?.results||[]).map((p:any)=>(
          <tr key={p.id}><td>{p.period_start} → {p.period_end}</td><td>{p.amount}</td><td>{p.status}</td><td>{p.reference}</td></tr>
        ))}
      </tbody></table>
      <a href="http://127.0.0.1:8000/api/v1/documents/statement/" target="_blank">Download Statement (PDF)</a>
    </div>
  )
}
