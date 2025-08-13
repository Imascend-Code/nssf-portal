import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Root() {
  const { user, logout } = useAuthStore();
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#content" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>
      <header className="border-b">
        <nav className="max-w-6xl mx-auto flex items-center gap-4 p-3">
          <Link to="/" className="font-semibold">NSSF Portal</Link>
          <Link to="/payments" className="hover:underline">Payments</Link>
          <Link to="/requests" className="hover:underline">My Requests</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <div className="ml-auto flex items-center gap-3">
            {user?.role === "ADMIN" && <Link to="/admin" className="hover:underline">Admin</Link>}
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button onClick={() => logout()} className="border rounded px-2 py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="border rounded px-2 py-1">Login</Link>
                <Link to="/register" className="border rounded px-2 py-1">Register</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main id="content" className="flex-1 max-w-6xl mx-auto p-4">
        <Outlet />
      </main>

      <footer className="border-t text-center text-sm p-4 text-gray-600">
        © {new Date().getFullYear()} NSSF Pensioner Self‑Service
      </footer>
    </div>
  );
}
