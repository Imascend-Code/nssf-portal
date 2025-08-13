import { Link } from "react-router-dom";
export default function Home(){
  return (
    <div style={{padding:24}}>
      <h1>NSSF Pensioner Self‑Service Portal</h1>
      <p>View payments, manage profile & beneficiaries, submit service requests.</p>
      <div style={{display:"flex", gap:12}}>
        <Link to="/login">Sign In</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}
