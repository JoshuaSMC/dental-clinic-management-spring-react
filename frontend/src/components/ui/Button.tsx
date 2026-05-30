import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'white';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-dental-black text-white border border-dental-black',
  secondary: 'bg-transparent text-dental-dark border border-[#d1d1d6]',
  danger:    'bg-transparent text-[#e53935] border border-[#ffcdd2]',
  ghost:     'bg-transparent text-dental-muted border border-transparent',
  warning:   'bg-transparent text-amber-500 border border-amber-200',
  white:     'bg-white text-dental-black border border-white',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-[5px] text-[13px] rounded-lg',
  md: 'px-5 py-[9px] text-[14px] rounded-[10px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  style,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      {...(props as object)}
      disabled={disabled}
      style={style}
      className={[
        'inline-flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        disabled ? 'opacity-45 cursor-not-allowed' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </motion.button>
  );
}
