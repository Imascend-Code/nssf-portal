// src/components/routing/Protected.tsx
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

type Props = {
  roles?: Array<'ADMIN' | 'STAFF' | 'PENSIONER'>; // optional role filter
  children: React.ReactNode;
};

export default function Protected({ roles, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  // not logged in → go to /login and remember where we wanted to go
  if (!user) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  }

  // normalize role checks — allow staff/superuser to behave as ADMIN
  const isAdminLike = (u: any) => u?.role === 'ADMIN' || u?.is_staff || u?.is_superuser;
  const hasRole = (wanted?: Props['roles']) => {
    if (!wanted || wanted.length === 0) return true;
    if (wanted.includes('ADMIN') && isAdminLike(user)) return true;
    return wanted.includes(user.role);
  };

  if (!hasRole(roles)) {
    // insufficient permissions → shove to a safe place
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
