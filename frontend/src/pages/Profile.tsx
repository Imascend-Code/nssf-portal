import { useProfile, useBeneficiaries, useAddBeneficiary, useUpdateProfile } from "../api/hooks";
import { FormEvent, useState } from "react";

export default function Profile() {
  const prof = useProfile();
  const bens = useBeneficiaries();
  const upd = useUpdateProfile();
  const addBen = useAddBeneficiary();

  const [form, setForm] = useState<{
    address?: string;
    city?: string;
    bank_name?: string;
    bank_account?: string;
  }>({});

  if (prof.isLoading || bens.isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">Loading…</div>
      </div>
    );
  }

  const p = prof.data;

  async function save(e: FormEvent) {
    e.preventDefault();
    await upd.mutateAsync(form);
  }

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await addBen.mutateAsync({
      full_name: String(fd.get("full_name") || ""),
      relationship: String(fd.get("relationship") || ""),
      percentage: Number(fd.get("percentage") || 0),
    });
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile & Bank */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4">
              <div className="text-sm text-gray-500">NSSF Number</div>
              <div className="font-medium text-gray-900">{p.nssf_number}</div>
            </div>

            <form onSubmit={save} className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
                  placeholder="Address"
                  defaultValue={p.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
                  placeholder="City"
                  defaultValue={p.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
                  placeholder="Bank Name"
                  defaultValue={p.bank_name}
                  onChange={(e) => setForm((f) => ({ ...f, bank_name: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Bank Account</label>
                <input
                  className="w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
                  placeholder="Bank Account"
                  defaultValue={p.bank_account}
                  onChange={(e) => setForm((f) => ({ ...f, bank_account: e.target.value }))}
                />
              </div>

              <div className="pt-2">
                <button
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-60"
                  disabled={upd.isPending}
                >
                  {upd.isPending ? "Saving…" : "Save changes"}
                </button>
                {upd.isSuccess && <span className="ml-3 text-sm text-green-600">Saved.</span>}
                {upd.isError && <span className="ml-3 text-sm text-rose-600">Failed to save.</span>}
              </div>
            </form>
          </section>

          {/* Beneficiaries */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Beneficiaries</h3>

            <ul className="mb-4 divide-y text-sm">
              {(bens.data || []).map((b: any) => (
                <li key={b.id} className="flex items-center justify-between py-2">
                  <div className="truncate pr-3 text-gray-700">
                    <span className="font-medium text-gray-900">{b.full_name}</span> — {b.relationship} — {b.percentage}%
                  </div>
                </li>
              ))}
              {(!bens.data || bens.data.length === 0) && (
                <li className="py-4 text-gray-500">No beneficiaries added yet.</li>
              )}
            </ul>

            <form onSubmit={add} className="grid gap-3 md:grid-cols-3">
              <input
                name="full_name"
                placeholder="Full name"
                required
                className="rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <input
                name="relationship"
                placeholder="Relationship"
                required
                className="rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <input
                name="percentage"
                type="number"
                placeholder="%"
                min={0}
                max={100}
                required
                className="rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <div className="md:col-span-3">
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                  disabled={addBen.isPending}
                >
                  {addBen.isPending ? "Adding…" : "Add beneficiary"}
                </button>
                {addBen.isSuccess && <span className="ml-3 text-sm text-green-600">Added.</span>}
                {addBen.isError && <span className="ml-3 text-sm text-rose-600">Failed to add.</span>}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
