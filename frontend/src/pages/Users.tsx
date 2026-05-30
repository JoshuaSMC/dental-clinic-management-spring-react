import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserPlus, Trash2, ShieldCheck, User } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { createUser, deleteUser } from '../api/users';
import { SkeletonRows } from '../components/ui/Skeleton';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { UserDTO } from '../types';

const schema = z.object({
  name:     z.string().min(1, 'Requerido'),
  lastName: z.string().min(1, 'Requerido'),
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function Users() {
  const { users, loading, reload } = useUsers();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserDTO | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate  = () => { reset(); setShowCreate(true); };
  const closeCreate = () => setShowCreate(false);
  const closeDelete = () => setDeleteTarget(null);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await createUser(data);
      toast.success('Usuario creado correctamente');
      reload();
      closeCreate();
    } catch {
      toast.error('No se pudo crear el usuario. El email puede estar en uso.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;

    // Guard: no eliminar al último admin
    if (deleteTarget.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1) {
      toast.error('No podés eliminar al único administrador del sistema');
      closeDelete();
      return;
    }

    setSaving(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success('Usuario eliminado');
      reload();
      closeDelete();
    } catch {
      toast.error('No se pudo eliminar el usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-dental-muted uppercase tracking-[1.2px] m-0">Administración</p>
          <h1 className="text-[28px] font-light text-dental-black tracking-[-0.8px] mt-1 mb-0">Usuarios</h1>
        </div>
        <Button onClick={openCreate}>
          <UserPlus size={15} /> Nuevo usuario
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-dental-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Nombre', 'Apellido', 'Email', 'Rol', 'Acciones'].map(h => (
                <th key={h} className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={4} cols={5} />
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-dental-muted">No hay usuarios registrados</td>
              </tr>
            ) : (
              users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={i > 0
                    ? 'border-t border-[#f5f5f7] hover:bg-[#fafafa] transition-colors duration-100'
                    : 'hover:bg-[#fafafa] transition-colors duration-100'}
                >
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{u.name}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">{u.lastName}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-muted">{u.email}</td>
                  <td className="px-6 py-[13px] text-[13px] text-dental-dark">
                    <span
                      className={[
                        'inline-flex items-center gap-[5px] text-[11px] font-semibold px-[10px] py-[3px] rounded-full tracking-[0.4px]',
                        u.role === 'ADMIN'
                          ? 'text-dental-black bg-dental-black/[0.1]'
                          : 'text-[#555] bg-[#f0f0f0]',
                      ].join(' ')}
                    >
                      {u.role === 'ADMIN' ? <ShieldCheck size={11} /> : <User size={11} />}
                      {u.role === 'ADMIN' ? 'Admin' : 'Recepcionista'}
                    </span>
                  </td>
                  <td className="px-6 py-[10px] text-right">
                    <button
                      onClick={() => setDeleteTarget(u)}
                      title="Eliminar usuario"
                      className="inline-flex items-center gap-[5px] px-3 py-[5px] rounded-lg text-[12px] border border-[#ffdddd] bg-[#fff5f5] text-[#cc3333] cursor-pointer"
                    >
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Nuevo usuario */}
      <Modal open={showCreate} title="Nuevo usuario" onClose={closeCreate}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Nombre"   placeholder="María"  error={errors.name?.message}     {...register('name')} />
            <Input label="Apellido" placeholder="López"  error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email"      type="email"    placeholder="maria@dental.com"    error={errors.email?.message}    {...register('email')} />
          <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
            El usuario se creará con rol <strong>Recepcionista</strong>.
          </p>
          <div className="flex gap-2.5 justify-end mt-1">
            <Button type="button" variant="secondary" size="sm" onClick={closeCreate}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Creando...' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirmar eliminación */}
      <Modal
        open={!!deleteTarget}
        title="Eliminar usuario"
        onClose={closeDelete}
        onConfirm={onDelete}
        confirmLabel={saving ? 'Eliminando...' : 'Eliminar'}
        confirmDisabled={saving}
        danger
      >
        <p style={{ color: '#444', fontSize: '14px', margin: 0 }}>
          ¿Confirmás que querés eliminar la cuenta de{' '}
          <strong>{deleteTarget?.name} {deleteTarget?.lastName}</strong>?{' '}
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
