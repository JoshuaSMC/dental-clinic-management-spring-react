import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getDentists } from '../api/dentists';
import type { Dentist } from '../types';

export function useDentists() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDentists()
      .then((data) => { if (!cancelled) setDentists(data); })
      .catch(() => { if (!cancelled) toast.error('No se pudieron cargar los odontólogos'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [version]);

  return { dentists, loading, reload };
}
