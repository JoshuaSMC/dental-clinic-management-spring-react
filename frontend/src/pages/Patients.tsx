import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createPatient, updatePatient, deletePatient } from '../api/patients';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../hooks/usePatients';
import { SkeletonRows } from '../components/ui/Skeleton';
import type { Patient } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const schema = z.object({
  name:         z.string().min(1, 'Requerido'),
  lastName:     z.string().min(1, 'Requerido'),
  email:        z.string().email('Email inválido'),
  cardIdentity: z.coerce.number().int().positive().optional().or(z.literal(undefined)),
  admissionDate: z.string().optional(),
  street:       z.string().optional(),
  streetNumber: z.coerce.number().optional(),
  location:     z.string().optional(),
  province:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;
type ModalMode = 'create' | 'edit' | 'delete' | null;

export default function Patients() {
  const { isAdmin } = useAuth();
  const { patients, loading, reload } = usePatients();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setSelected(null);
    reset({ name: '', lastName: '', email: '', admissionDate: new Date().toISOString().split('T')[0] });
    setMode('create');
  };
  const openEdit = (p: Patient) => {
    setSelected(p);
    reset({
      name: p.name, lastName: p.lastName, email: p.email,
      cardIdentity: p.cardIdentity, admissionDate: p.admissionDate,
      street: p.address?.street || '', streetNumber: p.address?.number,
      location: p.address?.location || '', province: p.address?.province || '',
    });
    setMode('edit');
  };
  const openDelete = (p: Patient) => { setSelected(p); setMode('delete'); };
  const closeModal = () => setMode(null);

  const onSubmit = async (data: FormData) => {
    if (mode === 'edit' && !selected?.id) return;
    setSubmitting(true);
    try {
      const payload: Patient = {
        name: data.name, lastName: data.lastName, email: data.email,
        cardIdentity: data.cardIdentity, admissionDate: data.admissionDate,
        address: (data.street || data.location || data.province)
          ? { id: selected?.address?.id, street: data.street || '', number: data.streetNumber || 0, location: data.location || '', province: data.province || '' }
          : undefined,
      };
      if (mode === 'create') {
        await createPatient(payload);
        toast.success('Paciente registrado correctamente');
      } else {
        await updatePatient({ ...payload, id: selected!.id });
        toast.success('Datos del paciente actualizados');
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
      await deletePatient(selected.id);
      toast.success(`${selected.name} ${selected.lastName} eliminado del sistema`);
      reload(); closeModal();
    } catch {
      toast.error('No se pudo eliminar el paciente');
    } finally { setSubmitting(false); }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName.toLowerCase().includes(search.toLowerCase()) ||
    (p.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-dental-muted uppercase tracking-[1.2px] m-0">Gestión</p>
          <h1 className="text-[28px] font-light text-dental-black tracking-[-0.8px] mt-1 mb-0">Pacientes</h1>
        </div>
        <Button onClick={openCreate}><Plus size={14} strokeWidth={2.5} /> Nuevo paciente</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="relative mb-5">
        <Search size={14} color="#aaaaaa" className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          className="w-full pl-[38px] pr-4 py-[10px] bg-white border border-dental-border rounded-[10px] text-sm text-dental-dark outline-none transition-all duration-150 focus:border-dental-black focus:ring-2 focus:ring-black/[0.05]"
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-dental-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Nombre</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Apellido</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Email</th>
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Ingreso</th>
              <th className="px-6 py-[10px] text-right text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={5} cols={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-dental-muted">
                  {search ? 'Sin resultados para tu búsqueda' : 'No hay pacientes registrados'}
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.03 }}
                  className={i > 0
                    ? 'border-t border-[#f5f5f7] hover:bg-[#fafafa] transition-colors duration-100'
                    : 'hover:bg-[#fafafa] transition-colors duration-100'}
                >
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{p.name}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{p.lastName}</td>
                  <td className="px-6 py-[13px] text-[13px] font-mono text-dental-muted">{p.email}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-muted">{p.admissionDate || '—'}</td>
                  <td className="px-6 py-[10px] text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(p)}><Pencil size={13} /> Editar</Button>
                      {isAdmin && <Button variant="danger" size="sm" onClick={() => openDelete(p)}><Trash2 size={13} /> Eliminar</Button>}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <Modal
        open={mode === 'create' || mode === 'edit'}
        title={mode === 'create' ? 'Nuevo paciente' : 'Editar paciente'}
        onClose={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        confirmLabel={mode === 'create' ? 'Crear' : 'Guardar cambios'}
        confirmDisabled={submitting}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Nombre"   placeholder="Juan"  error={errors.name?.message}     {...register('name')} />
          <Input label="Apellido" placeholder="Pérez" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" placeholder="juan@email.com" error={errors.email?.message} {...register('email')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="DNI"              type="number" placeholder="12345678" {...register('cardIdentity')} />
          <Input label="Fecha de ingreso" type="date"                          {...register('admissionDate')} />
        </div>
        <p className="text-[11px] font-semibold text-dental-muted uppercase tracking-[1.2px] m-0">Dirección (opcional)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px' }}>
          <Input label="Calle" placeholder="Av. Corrientes" {...register('street')} />
          <Input label="Nro."  type="number" placeholder="1234" {...register('streetNumber')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Localidad" placeholder="CABA"          {...register('location')} />
          <Input label="Provincia" placeholder="Buenos Aires"  {...register('province')} />
        </div>
      </Modal>

      <Modal
        open={mode === 'delete'}
        title="Eliminar paciente"
        onClose={closeModal}
        onConfirm={onDelete}
        confirmLabel="Eliminar"
        confirmDisabled={submitting}
        danger
      >
        <p style={{ color: '#1d1d1f', fontSize: '14px', margin: 0 }}>
          ¿Estás seguro que querés eliminar a <strong>{selected?.name} {selected?.lastName}</strong>?{' '}
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
