import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { UserDTO } from '../types';
import { getUsers } from '../api/users';

export function useUsers() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUsers()
      .then((data) => { if (!cancelled) setUsers(data); })
      .catch(() => { if (!cancelled) toast.error('No se pudieron cargar los usuarios'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [version]);

  return { users, loading, reload };
}
