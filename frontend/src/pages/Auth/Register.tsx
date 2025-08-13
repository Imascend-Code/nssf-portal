import { FormEvent, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [full_name,setName]=useState(""); const [phone,setPhone]=useState("");
  const nav = useNavigate(); const register = useAuthStore(s=>s.register);
  async function onSubmit(e:FormEvent){ e.preventDefault(); await register({email,password,full_name,phone}); nav("/dashboard"); }
  return (
    <form onSubmit={onSubmit} style={{maxWidth:420, margin:"40px auto", display:"grid", gap:12}}>
      <h2>Create account</h2>
      <input placeholder="Full name" value={full_name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}/>
      <button>Create</button>
    </form>
  )
}
