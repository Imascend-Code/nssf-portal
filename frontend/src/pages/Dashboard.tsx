// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useMe, usePayments, useMyRequests } from "../api/hooks";

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{children}</span>;
}

export default function Dashboard() {
  const me = useMe();
  const pays = usePayments();
  const reqs = useMyRequests();

  const loading = me.isLoading || pays.isLoading || reqs.isLoading;

  const payments = (pays.data?.results ?? pays.data ?? []).slice(0, 5);
  const requests = (reqs.data?.results ?? reqs.data ?? []).slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          {loading ? "Loading…" : `Welcome ${me.data?.full_name || me.data?.email}`}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard
            title="Recent Payments"
            action={<Link className="text-sm text-sky-700 hover:underline" to="/payments">View all</Link>}
          >
            <ul className="divide-y text-sm">
              {payments.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  <div className="truncate text-gray-700">
                    {p.period_start} → {p.period_end}
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <Badge>{p.status}</Badge>
                    <span className="font-medium text-gray-900">
                      {Number(p.amount).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
              {payments.length === 0 && <li className="py-4 text-gray-500">No payments yet.</li>}
            </ul>
          </SectionCard>

          <SectionCard
            title="Recent Requests"
            action={
              <div className="space-x-3 text-sm">
                <Link className="text-sky-700 hover:underline" to="/requests">My requests</Link>
                <Link className="text-sky-700 hover:underline" to="/requests/new">New</Link>
              </div>
            }
          >
            <ul className="divide-y text-sm">
              {requests.map((r: any) => (
                <li key={r.id} className="flex items-center justify-between py-2">
                  <div className="truncate pr-3 text-gray-700">{r.title}</div>
                  <Badge>{r.status}</Badge>
                </li>
              ))}
              {requests.length === 0 && <li className="py-4 text-gray-500">No requests yet.</li>}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
