import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useDentists } from '../hooks/useDentists';
import { usePatients } from '../hooks/usePatients';
import { SkeletonRows } from '../components/ui/Skeleton';
import type { AppointmentDTO } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const schema = z.object({
  patientId: z.coerce.number().int().positive('Seleccioná un paciente'),
  dentistId: z.coerce.number().int().positive('Seleccioná un odontólogo'),
  date: z.string().min(1, 'Requerido'),
  time: z.string().min(1, 'Requerido'),
});
type FormData = z.infer<typeof schema>;
type ModalMode = 'create' | 'edit' | 'delete' | 'cancel' | null;

export default function Appointments() {
  const { isAdmin } = useAuth();
  const { appointments, loading, reload } = useAppointments();
  const { dentists, loading: loadingDentists } = useDentists();
  const { patients, loading: loadingPatients } = usePatients();
  const listsReady = !loadingDentists && !loadingPatients;
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<AppointmentDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) as Resolver<FormData> });

  const dentistName = (id: number) => { const d = dentists.find(d => d.id === id); return d ? `${d.name} ${d.lastName}` : '—'; };
  const patientName = (id: number) => { const p = patients.find(p => p.id === id); return p ? `${p.name} ${p.lastName}` : '—'; };

  const openCreate = () => { setSelected(null); reset({ patientId: undefined, dentistId: undefined, date: '', time: '' }); setMode('create'); };
  const openEdit   = (a: AppointmentDTO) => {
    if (!listsReady) { toast.error('Las listas aún están cargando, intentá en un momento'); return; }
    setSelected(a); reset({ patientId: a.patientId, dentistId: a.dentistId, date: a.date, time: a.time || '' }); setMode('edit');
  };
  const openDelete = (a: AppointmentDTO) => { setSelected(a); setMode('delete'); };
  const openCancel = (a: AppointmentDTO) => { setSelected(a); setMode('cancel'); };
  const closeModal = () => setMode(null);

  const onSubmit = async (data: FormData) => {
    if (mode === 'edit' && !selected?.id) return;
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await createAppointment(data);
        toast.success('Turno agendado correctamente');
      } else {
        await updateAppointment({ ...data, id: selected!.id });
        toast.success('Turno actualizado');
      }
      reload(); closeModal();
    } catch (err: unknown) {
      const res = (err as { response?: { data?: unknown } })?.response?.data;
      const msg = typeof res === 'string' ? res : (res as { message?: string })?.message;
      toast.error(msg || 'Ocurrió un error');
    } finally { setSubmitting(false); }
  };

  const onDelete = async () => {
    if (!selected?.id) return;
    setSubmitting(true);
    try {
      await deleteAppointment(selected.id);
      toast.success('Turno eliminado');
      reload(); closeModal();
    } catch {
      toast.error('No se pudo eliminar el turno');
    } finally { setSubmitting(false); }
  };

  const onCancel = async () => {
    if (!selected?.id) return;
    setSubmitting(true);
    try {
      await deleteAppointment(selected.id);
      toast.success(`Turno de ${patientName(selected.patientId)} cancelado`);
      reload(); closeModal();
    } catch {
      toast.error('No se pudo cancelar el turno');
    } finally { setSubmitting(false); }
  };

  // Only search by name when lookup lists are loaded; otherwise names return '—'
  const filtered = appointments.filter(a =>
    String(a.date).includes(search) ||
    (listsReady && patientName(a.patientId).toLowerCase().includes(search.toLowerCase())) ||
    (listsReady && dentistName(a.dentistId).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-dental-muted uppercase tracking-[1.2px] m-0">Gestión</p>
          <h1 className="text-[28px] font-light text-dental-black tracking-[-0.8px] mt-1 mb-0">Turnos</h1>
        </div>
        <Button onClick={openCreate} disabled={!listsReady} title={!listsReady ? 'Cargando listas…' : undefined}>
          <Plus size={14} strokeWidth={2.5} /> Nuevo turno
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="relative mb-5">
        <Search size={14} color={listsReady ? '#aaaaaa' : '#cccccc'} className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          className="w-full pl-[38px] pr-4 py-[10px] bg-white border border-dental-border rounded-[10px] text-sm text-dental-dark outline-none transition-all duration-150 focus:border-dental-black focus:ring-2 focus:ring-black/[0.05]"
          placeholder={listsReady ? 'Buscar por fecha, paciente u odontólogo...' : 'Cargando listas…'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!listsReady}
          style={!listsReady ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-dental-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Fecha</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Hora</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Paciente</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Odontólogo</th>
              <th className="px-6 py-[10px] text-right text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={5} cols={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-dental-muted">
                  {search ? 'Sin resultados para tu búsqueda' : 'No hay turnos registrados'}
                </td>
              </tr>
            ) : (
              filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.03 }}
                  className={i > 0
                    ? 'border-t border-[#f5f5f7] hover:bg-[#fafafa] transition-colors duration-100'
                    : 'hover:bg-[#fafafa] transition-colors duration-100'}
                >
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark" style={{ fontWeight: 500 }}>{a.date}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.time || '—'}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{patientName(a.patientId)}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-muted">{dentistName(a.dentistId)}</td>
                  <td className="px-6 py-[10px] text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(a)}><Pencil size={13} /> Editar</Button>
                      {isAdmin
                        ? <Button variant="danger" size="sm" onClick={() => openDelete(a)}><Trash2 size={13} /> Eliminar</Button>
                        : <Button variant="secondary" size="sm" onClick={() => openCancel(a)} style={{ color: '#f59e0b', borderColor: '#fde68a' }}><X size={13} /> Cancelar</Button>
                      }
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Create / Edit modal */}
      <Modal
        open={mode === 'create' || mode === 'edit'}
        title={mode === 'create' ? 'Nuevo turno' : 'Editar turno'}
        onClose={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        confirmLabel={mode === 'create' ? 'Crear' : 'Guardar cambios'}
        confirmDisabled={submitting}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6e6e73', marginBottom: '6px' }}>Paciente</label>
          <select {...register('patientId')} className="w-full px-[14px] py-[10px] rounded-[10px] text-sm border border-[#d1d1d6] bg-white text-dental-dark outline-none focus:border-dental-black">
            <option value="">Seleccioná un paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name} {p.lastName}</option>)}
          </select>
          {errors.patientId && <span className="text-[12px] text-[#ef5350] mt-1">{errors.patientId.message}</span>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6e6e73', marginBottom: '6px' }}>Odontólogo</label>
          <select {...register('dentistId')} className="w-full px-[14px] py-[10px] rounded-[10px] text-sm border border-[#d1d1d6] bg-white text-dental-dark outline-none focus:border-dental-black">
            <option value="">Seleccioná un odontólogo</option>
            {dentists.map(d => <option key={d.id} value={d.id}>{d.name} {d.lastName} — Mat. {d.registration}</option>)}
          </select>
          {errors.dentistId && <span className="text-[12px] text-[#ef5350] mt-1">{errors.dentistId.message}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Fecha" type="date" error={errors.date?.message} {...register('date')} />
          <Input label="Hora" type="time" error={errors.time?.message} {...register('time')} />
        </div>
      </Modal>

      {/* Delete modal — admin only */}
      <Modal
        open={mode === 'delete'}
        title="Eliminar turno"
        onClose={closeModal}
        onConfirm={onDelete}
        confirmLabel="Eliminar"
        confirmDisabled={submitting}
        danger
      >
        <p style={{ color: '#1d1d1f', fontSize: '14px', margin: 0 }}>
          ¿Estás seguro que querés eliminar el turno del <strong>{selected?.date}</strong> a las{' '}
          <strong>{selected?.time}</strong> para{' '}
          <strong>{selected ? patientName(selected.patientId) : ''}</strong>?{' '}
          Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* Cancel modal — recepcionista */}
      <Modal
        open={mode === 'cancel'}
        title="Cancelar turno"
        onClose={closeModal}
        onConfirm={onCancel}
        confirmLabel="Confirmar cancelación"
        confirmDisabled={submitting}
      >
        <p style={{ color: '#1d1d1f', fontSize: '14px', margin: 0 }}>
          ¿Confirmás la cancelación del turno del <strong>{selected?.date}</strong> a las{' '}
          <strong>{selected?.time}</strong> para{' '}
          <strong>{selected ? patientName(selected.patientId) : ''}</strong>?
        </p>
        <p style={{ color: '#6e6e73', fontSize: '13px', margin: '8px 0 0' }}>
          El turno será removido del sistema. Si el paciente quiere reagendar, deberás crear un nuevo turno.
        </p>
      </Modal>

    </div>
  );
}
