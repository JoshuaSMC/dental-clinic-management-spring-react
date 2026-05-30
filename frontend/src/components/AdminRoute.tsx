import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { token, user, isAdmin } = useAuth();

  // typeof guard prevents NaN when exp is absent from a malformed payload
  const isExpired = !!user && typeof user.exp === 'number' && user.exp * 1000 < Date.now();

  if (!token || !user || isExpired) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
