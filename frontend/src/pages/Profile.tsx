import { useProfile, useBeneficiaries, useAddBeneficiary, useUpdateProfile } from "../api/hooks";
import { FormEvent, useState } from "react";

export default function Profile(){
  const prof = useProfile(); const bens = useBeneficiaries();
  const upd = useUpdateProfile(); const addBen = useAddBeneficiary();
  const [form,setForm]=useState<{address?:string;city?:string;bank_name?:string;bank_account?:string}>({})
  if (prof.isLoading || bens.isLoading) return <p style={{padding:24}}>Loading...</p>
  const p = prof.data
  async function save(e:FormEvent){ e.preventDefault(); await upd.mutateAsync(form) }
  async function add(e:FormEvent){ 
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement)
    await addBen.mutateAsync({full_name:fd.get("full_name"), relationship:fd.get("relationship"), percentage:Number(fd.get("percentage"))})
  }
  return (
    <div style={{padding:24, display:"grid", gap:24}}>
      <h2>Profile</h2>
      <div>
        <div>NSSF No: {p.nssf_number}</div>
        <form onSubmit={save} style={{display:"grid", gap:8, maxWidth:420}}>
          <input placeholder="Address" defaultValue={p.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/>
          <input placeholder="City" defaultValue={p.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/>
          <input placeholder="Bank Name" defaultValue={p.bank_name} onChange={e=>setForm(f=>({...f,bank_name:e.target.value}))}/>
          <input placeholder="Bank Account" defaultValue={p.bank_account} onChange={e=>setForm(f=>({...f,bank_account:e.target.value}))}/>
          <button>Save</button>
        </form>
      </div>
      <div>
        <h3>Beneficiaries</h3>
        <ul>{(bens.data||[]).map((b:any)=>(<li key={b.id}>{b.full_name} — {b.relationship} — {b.percentage}%</li>))}</ul>
        <form onSubmit={add} style={{display:"flex", gap:8}}>
          <input name="full_name" placeholder="Full name" required/>
          <input name="relationship" placeholder="Relationship" required/>
          <input name="percentage" type="number" placeholder="%" min={0} max={100} required/>
          <button>Add</button>
        </form>
      </div>
    </div>
  )
}
