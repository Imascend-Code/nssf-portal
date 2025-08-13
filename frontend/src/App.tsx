import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import NewRequest from "./pages/Requests/NewRequest";
import MyRequests from "./pages/Requests/MyRequests";
import RequestDetail from "./pages/Requests/RequestDetail";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRequests from "./pages/Admin/Requests";
import AdminUsers from "./pages/Admin/Users";
import Home from "./pages/Home";
import { useAuthStore } from "./store/auth";

function Protected({ children, roles }: {children: JSX.Element, roles?: string[]}) {
  const { accessToken, user } = useAuthStore()
  if (!accessToken) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
      <Route path="/payments" element={<Protected><Payments/></Protected>} />
      <Route path="/profile" element={<Protected><Profile/></Protected>} />
      <Route path="/requests/new" element={<Protected><NewRequest/></Protected>} />
      <Route path="/requests" element={<Protected><MyRequests/></Protected>} />
      <Route path="/requests/:id" element={<Protected><RequestDetail/></Protected>} />
      <Route path="/admin" element={<Protected roles={["ADMIN"]}><AdminDashboard/></Protected>} />
      <Route path="/admin/requests" element={<Protected roles={["ADMIN","STAFF"]}><AdminRequests/></Protected>} />
      <Route path="/admin/users" element={<Protected roles={["ADMIN"]}><AdminUsers/></Protected>} />
    </Routes>
  )
}
