import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
export default function Protected({ roles, children }) {
    const user = useAuthStore((s) => s.user);
    const location = useLocation();
    // not logged in → go to /login and remember where we wanted to go
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { returnTo: location.pathname } });
    }
    // normalize role checks — allow staff/superuser to behave as ADMIN
    const isAdminLike = (u) => u?.role === 'ADMIN' || u?.is_staff || u?.is_superuser;
    const hasRole = (wanted) => {
        if (!wanted || wanted.length === 0)
            return true;
        if (wanted.includes('ADMIN') && isAdminLike(user))
            return true;
        return wanted.includes(user.role);
    };
    if (!hasRole(roles)) {
        // insufficient permissions → shove to a safe place
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
