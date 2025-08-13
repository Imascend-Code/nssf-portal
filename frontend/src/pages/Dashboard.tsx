// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useMe, usePayments, useMyRequests } from "../api/hooks";

export default function Dashboard() {
  const me = useMe();
  const pays = usePayments();
  const reqs = useMyRequests();

  if (me.isLoading || pays.isLoading || reqs.isLoading) return <p className="p-6">Loading…</p>;

  const payments = (pays.data?.results ?? pays.data ?? []).slice(0, 5);
  const requests = (reqs.data?.results ?? reqs.data ?? []).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Welcome {me.data?.full_name || me.data?.email}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Recent Payments</h3>
            <Link className="text-sm underline" to="/payments">View all</Link>
          </div>
          <ul className="text-sm space-y-1">
            {payments.map((p: any) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.period_start} → {p.period_end}</span>
                <span>{Number(p.amount).toLocaleString()} ({p.status})</span>
              </li>
            ))}
            {payments.length === 0 && <li className="text-gray-500">No payments yet.</li>}
          </ul>
        </section>

        <section className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Recent Requests</h3>
            <div className="space-x-3 text-sm">
              <Link className="underline" to="/requests">My requests</Link>
              <Link className="underline" to="/requests/new">New</Link>
            </div>
          </div>
          <ul className="text-sm space-y-1">
            {requests.map((r: any) => (
              <li key={r.id} className="flex justify-between">
                <span className="truncate">{r.title}</span>
                <span>{r.status}</span>
              </li>
            ))}
            {requests.length === 0 && <li className="text-gray-500">No requests yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
