import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';

const HERO_PHOTO = 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=90';

export default function Landing() {
  const { token } = useAuth();

  return (
    <div className="h-screen relative overflow-hidden font-sans">

      {/* Background photo */}
      <img
        src={HERO_PHOTO}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center grayscale brightness-[1.08]"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Gradient overlay: heavy on left, lets photo breathe on right */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.62)_45%,rgba(0,0,0,0.15)_100%)]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:72px_72px] pointer-events-none" />

      {/* Vignette — darkens edges for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_130%_100%_at_75%_50%,transparent_38%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />

      {/* Bottom gradient — footer legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-[linear-gradient(to_top,rgba(0,0,0,0.6)_0%,transparent_100%)] pointer-events-none" />

      {/* Layout */}
      <div className="relative z-10 h-full flex flex-col justify-between px-[8%] py-10">

        {/* Top — logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Logo size="md" />
        </motion.div>

        {/* Center — brand + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-7 h-px bg-white/30 mb-[18px]" />
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[2.5px] m-0 mb-[22px]">
            Sistema de gestión interno
          </p>

          <h1 className="m-0 mb-11">
            <span className="block text-[76px] font-light text-white tracking-[-4px] leading-[0.92]">Atelier</span>
            <span className="block text-[76px] font-bold text-white tracking-[-4px] leading-[1.08]">Dental.</span>
          </h1>

          <Link
            to={token ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-2.5 px-[30px] py-3.5 rounded-full text-[14px] font-semibold bg-white text-dental-black no-underline shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          >
            {token ? 'Ir al panel' : 'Ingresar al sistema'} <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Bottom — footer discreto */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <span className="text-[12px] text-[#777]">© {new Date().getFullYear()} Atelier Dental</span>
        </motion.div>

      </div>
    </div>
  );
}
