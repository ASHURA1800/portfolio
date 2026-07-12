'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/admin/ui/Input';
import { PasswordInput } from '@/components/admin/ui/PasswordInput';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Button } from '@/components/admin/ui/Button';
import { Alert } from '@/components/admin/ui/Alert';

/**
 * Auth logic here is unchanged from the pre-5.2 LoginForm (see
 * PHASE_5.1_AUTH_AUDIT.md §5): same fetch call, same 429/non-2xx/network
 * error branches, same redirectTo allow-list check. Only the JSX and a
 * real (backend-verified) rememberMe field are new.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Autofocus email on mount — real UX win, no behavioral change to auth.
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response body */
      }

      if (res.status === 429) {
        setError('Too many attempts. Please wait before trying again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Validate redirectTo against open-redirect: must be a relative /admin path.
      const raw = searchParams.get('redirectTo') ?? '';
      const destination = raw.startsWith('/admin') && !raw.includes('//') ? raw : '/admin';

      setSuccess(true);
      // Brief success state before navigating so the checkmark is visible.
      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 500);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Sign in">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">Welcome back</h2>
        <p className="text-sm text-[var(--color-faint)] mt-1">Sign in to your admin dashboard</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <Alert variant="error" key="login-error">
            {error}
          </Alert>
        )}
      </AnimatePresence>

      <Input
        ref={emailRef}
        id="email"
        label="Email"
        type="email"
        name="email"
        required
        autoComplete="email"
        disabled={loading || success}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@example.com"
      />

      <PasswordInput
        id="password"
        label="Password"
        name="password"
        required
        autoComplete="current-password"
        disabled={loading || success}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={loading || success}
        />
        <Link
          href="/admin/forgot-password"
          className="text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={success}
        icon={success ? undefined : <LogIn size={16} />}
      >
        {success ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5"
          >
            ✓ Signed in
          </motion.span>
        ) : loading ? (
          'Signing in…'
        ) : (
          'Sign In'
        )}
      </Button>

      <p className="text-center text-xs text-[var(--color-faint)]">
        Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">Enter</kbd> to submit
      </p>
    </form>
  );
}
