import { FormEvent, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const nav = useNavigate(); const login = useAuthStore(s=>s.login);
  async function onSubmit(e:FormEvent){ e.preventDefault(); await login(email,password); nav("/dashboard"); }
  return (
    <form onSubmit={onSubmit} style={{maxWidth:360, margin:"40px auto", display:"grid", gap:12}}>
      <h2>Sign in</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button>Sign in</button>
      <small>No account? <Link to="/register">Register</Link></small>
    </form>
  )
}
