import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Requerido'),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await login(data);
      setToken(res.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dental-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-[52px] h-[52px] rounded-[15px] bg-dental-black border border-white/[0.12] inline-flex items-center justify-center mb-[18px]">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <path d="M50 12C36 12 20 22 20 35C20 44 24 50 28 55L31 72C32 77 35 82 39 82C42 82 44 79 45 75L47 68C48 63 49 61 50 61C51 61 52 63 53 68L55 75C56 79 58 82 61 82C65 82 68 77 69 72L72 55C76 50 80 44 80 35C80 22 64 12 50 12Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-white text-[22px] m-0 tracking-[-0.5px]">
            <span className="font-light">Atelier </span><span className="font-bold">Dental</span>
          </h1>
          <p className="text-[#555] text-[13px] mt-[7px] font-normal">
            Iniciá sesión para continuar
          </p>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-[18px] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
            <Input
              dark
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              dark
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="white"
              disabled={loading}
              className="w-full justify-center mt-1"
              style={{ padding: '11px 20px' }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[#555] text-[13px] mt-5">
          <Link to="/" className="text-[#444] no-underline">← Volver al inicio</Link>
        </p>
      </motion.div>
    </div>
  );
}
