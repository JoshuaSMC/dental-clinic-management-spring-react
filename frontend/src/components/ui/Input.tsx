import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export default function Input({ label, error, dark, className, ...props }: InputProps) {
  const baseInput = 'w-full px-[14px] py-[10px] rounded-[10px] text-sm outline-none transition-all duration-150 border';

  const lightInput = error
    ? 'border-[#ef5350] bg-white text-dental-dark focus:border-dental-black focus:ring-2 focus:ring-black/[0.06]'
    : 'border-[#d1d1d6] bg-white text-dental-dark focus:border-dental-black focus:ring-2 focus:ring-black/[0.06]';

  const darkInput = error
    ? 'border-[#ef5350] bg-white/[0.03] text-white focus:border-white/20 focus:ring-2 focus:ring-white/[0.05]'
    : 'border-white/[0.08] bg-white/[0.03] text-white focus:border-white/20 focus:ring-2 focus:ring-white/[0.05]';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-[13px] font-medium ${dark ? 'text-[#a0a0a5]' : 'text-dental-muted'}`}>
          {label}
        </label>
      )}
      <input
        {...props}
        className={[baseInput, dark ? darkInput : lightInput, className ?? ''].filter(Boolean).join(' ')}
      />
      {error && (
        <span className="text-[12px] text-[#ef5350]">{error}</span>
      )}
    </div>
  );
}
