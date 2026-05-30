import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/**
 * Module-level ref wired to the current logout() callback.
 * Lets axios.ts trigger React state cleanup on 401 without circular imports
 * or prop-drilling. The ref is set by AuthProvider on mount and cleared on unmount.
 */
export const logoutRef: { fn: (() => void) | null } = { fn: null };
import type { JwtPayload } from '../types';

interface AuthContextType {
  token: string | null;
  user: JwtPayload | null;
  isAdmin: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [user, setUser] = useState<JwtPayload | null>(() => {
    const stored = localStorage.getItem('token');
    return stored ? decodeJwt(stored) : null;
  });

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setTokenState(newToken);
      setUser(decodeJwt(newToken));
    } else {
      localStorage.removeItem('token');
      setTokenState(null);
      setUser(null);
    }
  }, []);

  // logout no depende de setToken (que cambia en cada render) sino directamente
  // de los state setters de useState, que son referencias estables garantizadas por React.
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setTokenState(null);
    setUser(null);
  }, []);

  // Keep the module-level ref in sync with the current stable logout callback
  // so axios.ts can call React state cleanup without going through the context.
  useEffect(() => {
    logoutRef.fn = logout;
    return () => { logoutRef.fn = null; };
  }, [logout]);

  // Chequea expiración al montar, cada vez que cambia el token,
  // y cada 60 s mientras la pestaña está abierta.
  useEffect(() => {
    const check = () => {
      if (token) {
        const payload = decodeJwt(token);
        if (payload && typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
          logout();
        }
      }
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{ token, user, isAdmin: user?.role === 'ADMIN', setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
