'use client';

import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, type FormEvent } from 'react';

interface AdminFormProps {
  /** Controls visibility — AnimatePresence handles enter/exit. */
  show: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

/**
 * AdminForm
 * Root form wrapper. Handles show/hide animation so every manager
 * gets the same entrance/exit for free — no per-manager AnimatePresence.
 */
export default function AdminForm({ show, onSubmit, children, className }: AdminFormProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.form
          initial={{ opacity: 0, y: -8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.99 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={onSubmit}
          className={`admin-card space-y-6 ${className ?? ''}`}
          noValidate
        >
          {children}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
