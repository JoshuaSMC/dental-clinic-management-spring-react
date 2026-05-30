import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getAppointments } from '../api/appointments';
import type { AppointmentDTO } from '../types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAppointments()
      .then((data) => { if (!cancelled) setAppointments(data); })
      .catch(() => { if (!cancelled) toast.error('No se pudieron cargar los turnos'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [version]);

  return { appointments, loading, reload };
}
