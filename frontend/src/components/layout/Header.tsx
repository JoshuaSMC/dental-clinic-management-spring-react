import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Stethoscope, Users, CalendarCheck, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const navLinks = [
  { to: '/dashboard',    label: 'Inicio',       icon: LayoutDashboard, adminOnly: false },
  { to: '/dentists',     label: 'Odontólogos',  icon: Stethoscope,     adminOnly: false },
  { to: '/patients',     label: 'Pacientes',    icon: Users,           adminOnly: false },
  { to: '/appointments', label: 'Turnos',       icon: CalendarCheck,   adminOnly: false },
  { to: '/users',        label: 'Usuarios',     icon: ShieldCheck,     adminOnly: true  },
];

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-50 w-full bg-dental-black">
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="no-underline">
          <Logo size="sm" />
        </NavLink>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navLinks.filter(({ adminOnly }) => !adminOnly || isAdmin).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-1.5 px-3 py-1.5 text-[13px] transition-all duration-150 no-underline rounded-lg',
                  isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-[#888] hover:text-white',
                ].join(' ')
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#777]">{user?.sub}</span>
            <span
              className={[
                'text-[10px] font-semibold px-2 py-[3px] rounded-full tracking-[0.4px]',
                isAdmin
                  ? 'bg-white text-dental-black'
                  : 'bg-white/[0.08] text-[#ccc]',
              ].join(' ')}
            >
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] border border-white/[0.08] bg-transparent text-[#777] cursor-pointer transition-all duration-150 hover:text-white hover:border-white/20"
          >
            <LogOut size={13} />
            Salir
          </motion.button>
        </div>
      </div>
      <div className="h-px bg-white/[0.04]" />
    </header>
  );
}
