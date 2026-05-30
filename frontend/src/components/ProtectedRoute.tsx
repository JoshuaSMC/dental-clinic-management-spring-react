import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  // typeof guard prevents NaN when exp is absent from a malformed payload
  const isExpired = !!user && typeof user.exp === 'number' && user.exp * 1000 < Date.now();

  // !user covers malformed JWTs: decodeJwt returns null → !!user is false
  // Logout + storage cleanup is handled by AuthContext's 60-second interval
  // and the axios 401 interceptor — no need to call it here post-render.
  if (!token || !user || isExpired) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
