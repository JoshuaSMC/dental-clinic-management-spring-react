import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dental-black flex items-center justify-center font-sans p-6 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:72px_72px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative"
      >
        <p className="text-[11px] font-semibold text-[#444] uppercase tracking-[2.5px] m-0 mb-6">
          Error 404
        </p>

        <h1 className="m-0 mb-4">
          <span className="block text-[72px] font-light text-white tracking-[-3.5px] leading-[0.92]">Página</span>
          <span className="block text-[72px] font-bold text-white tracking-[-3.5px] leading-[1.08]">no encontrada.</span>
        </h1>

        <p className="text-[#555] text-[14px] m-0 mb-12">
          La ruta que buscás no existe en el sistema.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-[13px] rounded-full bg-white text-dental-black no-underline text-[14px] font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
