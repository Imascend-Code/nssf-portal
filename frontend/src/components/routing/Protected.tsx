import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useMe } from "../../api/hooks";

export default function Protected({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { accessToken, user } = useAuthStore();
  const { isFetching } = useMe();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname + location.search }} />;
  }
  if (isFetching) {
    return <div className="p-6 text-center" role="status" aria-live="polite">Loading…</div>;
  }
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
