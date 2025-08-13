import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

type Payment = {
  id: number;
  period_start: string;
  period_end: string;
  amount: string;
  status: "processed" | "pending" | "on_hold";
  paid_at?: string | null;
  reference: string;
};

export default function Payments() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await api.get<{ results?: Payment[] } >("/payments/")).data,
  });

  const items = (data as any)?.results ?? (data ?? []);

  if (isLoading) return <p>Loading payments…</p>;
  if (isError) return <p>Failed to load payments.</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Payments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Reference</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: Payment) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  {new Date(p.period_start).toLocaleDateString()} – {new Date(p.period_end).toLocaleDateString()}
                </td>
                <td className="p-2">{Number(p.amount).toLocaleString()}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
