import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export interface LoginBrandingProps {
  name: string;
  title: string;
}

const FEATURES = [
  { icon: Sparkles, label: 'Curated project showcase, kept current in one place' },
  { icon: Zap, label: 'Fast, focused admin — no bloat, just your content' },
  { icon: ShieldCheck, label: 'Session-based auth with rate-limited, hardened endpoints' },
] as const;

/** Static left-panel branding — logo initial, real profile name/title, and
 *  a short feature list. No client state; purely presentational so it can
 *  render on the server. */
export function LoginBranding({ name, title }: LoginBrandingProps) {
  const initial = name.trim().charAt(0).toUpperCase() || 'A';
  const displayName = name.trim() || 'Portfolio Admin';

  return (
    <div className="flex flex-col gap-10 max-w-md">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent2-500)] flex items-center justify-center shadow-[var(--shadow-glow-accent)]">
          <span className="text-white font-bold text-lg">{initial}</span>
        </div>
        <span className="text-[var(--color-ink)] font-semibold text-lg">{displayName}</span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-[var(--color-ink)] leading-tight">
          Manage your portfolio,
          <br />
          without the friction.
        </h1>
        <p className="text-[var(--color-faint)] text-sm leading-relaxed">
          {title ? `${title} — sign in to update projects, skills, and everything else.` : 'Sign in to update projects, skills, and everything else.'}
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="mt-0.5 w-8 h-8 rounded-lg bg-[var(--color-accent-500)]/10 border border-[var(--color-accent-500)]/20 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-[var(--color-accent-400)]" />
            </span>
            <span className="text-sm text-[var(--color-muted)] leading-snug pt-1">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
