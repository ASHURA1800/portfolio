'use client';

import { useState } from 'react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface UseContactReturn {
  sending: boolean;
  sent: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  submit: (form: ContactForm) => Promise<void>;
  reset: () => void;
}

export function useContact(): UseContactReturn {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (form: ContactForm) => {
    setSending(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) setFieldErrors(data.details);
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSent(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setSent(false);
    setError(null);
    setFieldErrors({});
  };

  return { sending, sent, error, fieldErrors, submit, reset };
}
