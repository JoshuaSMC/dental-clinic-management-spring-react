import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, Users, CalendarCheck, ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDentists } from '../hooks/useDentists';
import { usePatients } from '../hooks/usePatients';
import { useAppointments } from '../hooks/useAppointments';
import type { AppointmentDTO } from '../types';

const DAYS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function todayLabel() {
  const d = new Date();
  return `${DAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

function thisWeekCount(appointments: AppointmentDTO[]): number {
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const from = today.toISOString().split('T')[0];
  const to   = weekEnd.toISOString().split('T')[0];
  return appointments.filter(a => a.date >= from && a.date <= to).length;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { dentists }     = useDentists();
  const { patients }     = usePatients();
  const { appointments } = useAppointments();

  const today    = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter(a => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''))
    .slice(0, 8);

  const todayAppts = appointments
    .filter(a => a.date === today)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

  const weekCount = thisWeekCount(appointments);

  const dentistName = (id: number) => { const d = dentists.find(d => d.id === id); return d ? `${d.name} ${d.lastName}` : '—'; };
  const patientName = (id: number) => { const p = patients.find(p => p.id === id); return p ? `${p.name} ${p.lastName}` : '—'; };

  const stats = [
    { label: 'Odontólogos', value: dentists.length,     icon: Stethoscope,  to: '/dentists'     },
    { label: 'Pacientes',   value: patients.length,     icon: Users,        to: '/patients'     },
    { label: 'Turnos',      value: appointments.length, icon: CalendarCheck, to: '/appointments' },
  ];

  return (
    <div className="bg-dental-gray min-h-[calc(100vh-61px)]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-dental-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-14 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-semibold text-[#555] uppercase tracking-[1.2px] m-0 mb-3">
              {todayLabel()}
            </p>
            <h1 className="text-[38px] font-light text-white m-0 mb-2.5 tracking-[-1px] leading-[1.15]">
              Bienvenido,{' '}
              <span className="font-semibold">{user?.sub?.split('@')[0]}</span>
            </h1>
            <p className="text-[14px] text-[#555] m-0">
              {weekCount === 0
                ? 'No hay turnos programados para esta semana.'
                : `Tenés ${weekCount} turno${weekCount !== 1 ? 's' : ''} programado${weekCount !== 1 ? 's' : ''} esta semana.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-3 gap-4 -translate-y-7">
          {stats.map(({ label, value, icon: Icon, to }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.07 }}
            >
              <Link to={to} className="no-underline block">
                <div className="bg-white rounded-2xl p-6 border border-dental-border cursor-pointer transition-all duration-200 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)] hover:-translate-y-0.5">
                  <div>
                    <div className="text-[40px] font-light text-dental-black tracking-[-1.5px] leading-none">{value}</div>
                    <div className="text-[13px] text-dental-muted mt-1.5">{label}</div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-dental-gray flex items-center justify-center">
                    <Icon size={20} color="#0a0a0a" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_300px] gap-4 pb-12 -mt-3">

          {/* Upcoming appointments */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
            className="bg-white rounded-2xl border border-dental-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="px-6 py-5 border-b border-[#f0f0f0] flex items-center justify-between">
              <div className="text-[14px] font-medium text-dental-dark flex items-center gap-2">
                <Clock size={15} color="#6e6e73" />
                <span>Próximos turnos</span>
              </div>
              <Link to="/appointments" className="flex items-center gap-1 text-[12px] text-dental-muted no-underline">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="p-12 text-center text-dental-muted text-[14px]">No hay turnos próximos</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Fecha', 'Paciente', 'Odontólogo'].map(h => (
                      <th key={h} className="px-6 py-[10px] text-left text-[11px] font-semibold text-dental-muted uppercase tracking-[0.6px] bg-[#fafafa]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((a, i) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.36 + i * 0.04 }}
                      className="border-t border-[#f5f5f7] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-6 py-[13px] text-[13px] font-medium text-dental-dark">{a.date}</td>
                      <td className="px-6 py-[13px] text-[13px] text-dental-dark">{patientName(a.patientId)}</td>
                      <td className="px-6 py-[13px] text-[13px] text-dental-muted">{dentistName(a.dentistId)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* Today's agenda */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="bg-white rounded-2xl border border-dental-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="px-6 py-5 border-b border-[#f0f0f0] flex items-center gap-2">
              <CalendarDays size={15} color="#6e6e73" />
              <span className="text-[14px] font-medium text-dental-dark">Hoy</span>
            </div>

            {todayAppts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-9 h-9 rounded-[10px] bg-dental-gray flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={16} color="#aaaaaa" />
                </div>
                <p className="text-[13px] text-[#aaaaaa] m-0">Sin turnos para hoy</p>
              </div>
            ) : (
              <div className="py-2">
                {todayAppts.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.42 + i * 0.05 }}
                    className={[
                      'px-5 py-3 hover:bg-[#fafafa] transition-colors',
                      i < todayAppts.length - 1 ? 'border-b border-[#f5f5f7]' : '',
                    ].join(' ')}
                  >
                    <div className="text-[13px] font-medium text-dental-dark mb-0.5">{patientName(a.patientId)}</div>
                    <div className="text-[12px] text-[#aaaaaa]">{dentistName(a.dentistId)}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
