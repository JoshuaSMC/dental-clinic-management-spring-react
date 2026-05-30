import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getPatients } from '../api/patients';
import type { Patient } from '../types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPatients()
      .then((data) => { if (!cancelled) setPatients(data); })
      .catch(() => { if (!cancelled) toast.error('No se pudieron cargar los pacientes'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [version]);

  return { patients, loading, reload };
}
