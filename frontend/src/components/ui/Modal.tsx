import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}

export default function Modal({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel = 'Guardar',
  confirmDisabled,
  danger,
  children,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        /* Overlay */
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
        >
          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] bg-white rounded-[18px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-dental-black px-6 py-[18px] flex items-center justify-between">
              <span className="text-white text-[15px] font-medium tracking-[-0.2px]">
                {title}
              </span>
              <button
                onClick={onClose}
                className="bg-transparent border-0 text-[#666] cursor-pointer flex leading-none p-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {onConfirm && (
              <div className="px-6 py-4 border-t border-[#f0f0f0] flex justify-end gap-2.5">
                <Button variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
                <Button
                  variant={danger ? 'danger' : 'primary'}
                  size="sm"
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  className={danger ? '!bg-[#e53935] !text-white !border-[#e53935]' : ''}
                >
                  {confirmLabel}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
