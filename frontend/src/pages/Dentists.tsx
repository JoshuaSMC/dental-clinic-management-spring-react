import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createDentist, updateDentist, deleteDentist } from '../api/dentists';
import { useAuth } from '../context/AuthContext';
import { useDentists } from '../hooks/useDentists';
import { SkeletonRows } from '../components/ui/Skeleton';
import type { Dentist } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const schema = z.object({
  name:         z.string().min(1, 'Requerido'),
  lastName:     z.string().min(1, 'Requerido'),
  registration: z.coerce.number().int().positive('Debe ser un número positivo'),
});
type FormData = z.infer<typeof schema>;
type ModalMode = 'create' | 'edit' | 'delete' | null;

export default function Dentists() {
  const { isAdmin } = useAuth();
  const { dentists, loading, reload } = useDentists();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Dentist | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => { setSelected(null); reset({ name: '', lastName: '', registration: undefined }); setMode('create'); };
  const openEdit   = (d: Dentist) => { setSelected(d); reset({ name: d.name, lastName: d.lastName, registration: d.registration }); setMode('edit'); };
  const openDelete = (d: Dentist) => { setSelected(d); setMode('delete'); };
  const closeModal = () => setMode(null);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await createDentist(data);
        toast.success('Odontólogo creado correctamente');
      } else {
        await updateDentist({ ...data, id: selected!.id });
        toast.success('Cambios guardados');
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
      await deleteDentist(selected.id);
      toast.success(`${selected.name} ${selected.lastName} eliminado`);
      reload(); closeModal();
    } catch {
      toast.error('No se pudo eliminar el odontólogo');
    } finally { setSubmitting(false); }
  };

  const filtered = dentists.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.lastName.toLowerCase().includes(search.toLowerCase()) ||
    String(d.registration).includes(search)
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-dental-muted uppercase tracking-[1.2px] m-0">Gestión</p>
          <h1 className="text-[28px] font-light text-dental-black tracking-[-0.8px] mt-1 mb-0">Odontólogos</h1>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus size={14} strokeWidth={2.5} /> Nuevo odontólogo
          </Button>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="relative mb-5">
        <Search size={14} color="#aaaaaa" className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          className="w-full pl-[38px] pr-4 py-[10px] bg-white border border-dental-border rounded-[10px] text-sm text-dental-dark outline-none transition-all duration-150 focus:border-dental-black focus:ring-2 focus:ring-black/[0.05]"
          placeholder="Buscar por nombre, apellido o matrícula..."
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
              <th className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Matrícula</th>
              {isAdmin && <th className="px-6 py-[10px] text-right text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={5} cols={isAdmin ? 4 : 3} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-12 text-center text-[14px] text-dental-muted">
                  {search ? 'Sin resultados para tu búsqueda' : 'No hay odontólogos registrados'}
                </td>
              </tr>
            ) : (
              filtered.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.03 }}
                  className={i > 0
                    ? 'border-t border-[#f5f5f7] hover:bg-[#fafafa] transition-colors duration-100'
                    : 'hover:bg-[#fafafa] transition-colors duration-100'}
                >
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{d.name}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{d.lastName}</td>
                  <td className="px-6 py-[13px] text-[13px] font-mono text-dental-muted">{d.registration}</td>
                  {isAdmin && (
                    <td className="px-6 py-[10px] text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(d)}><Pencil size={13} /> Editar</Button>
                        <Button variant="danger"    size="sm" onClick={() => openDelete(d)}><Trash2 size={13} /> Eliminar</Button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <Modal
        open={mode === 'create' || mode === 'edit'}
        title={mode === 'create' ? 'Nuevo odontólogo' : 'Editar odontólogo'}
        onClose={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        confirmLabel={mode === 'create' ? 'Crear' : 'Guardar cambios'}
        confirmDisabled={submitting}
      >
        <Input label="Nombre"    placeholder="Juan"  error={errors.name?.message}         {...register('name')} />
        <Input label="Apellido"  placeholder="Pérez" error={errors.lastName?.message}     {...register('lastName')} />
        <Input label="Matrícula" type="number" placeholder="12345" error={errors.registration?.message} {...register('registration')} />
      </Modal>

      <Modal
        open={mode === 'delete'}
        title="Eliminar odontólogo"
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
