import { usePayments } from "../api/hooks";

export default function Payments() {
  const q = usePayments();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <a
            href="http://127.0.0.1:8000/api/v1/documents/statement/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            Download Statement (PDF)
          </a>
        </div>

        {q.isLoading ? (
          <div className="rounded-xl border bg-white p-6 shadow-sm">Loading…</div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(q.data?.results || []).map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        {p.period_start} → {p.period_end}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {Number(p.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.reference}</td>
                    </tr>
                  ))}
                  {(!q.data?.results || q.data.results.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
