'use client';

import { Send, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SocialIcon } from '@/components/ui/SocialIcon';
import type { Profile, Social } from '@/types';
import { useContact } from '@/hooks/useContact';

export function ContactSection({ profile, socials: allSocials }: { profile: Profile; socials: Social[] }) {
  const { sending, sent, error, fieldErrors, submit, reset } = useContact();
  const socials = allSocials.filter((s) => s.platform !== 'email');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submit({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    });
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint/60 outline-none transition-colors duration-200 focus:border-accent-500 focus:bg-surface';

  return (
    <SectionContainer id="contact" width="wide">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description={profile.contactNote || undefined}
      />

      <Reveal className="mt-14 grid items-start gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        {/* Left: reachable details */}
        <div className="space-y-8">
          <dl className="space-y-5">
            {profile.email && (
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-faint" />
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-faint">Email</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    <a
                      href={`mailto:${profile.email}`}
                      className="transition-colors duration-200 hover:text-accent-400"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {profile.location && (
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-faint" />
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-faint">Location</dt>
                  <dd className="mt-0.5 text-sm text-ink">{profile.location}</dd>
                </div>
              </div>
            )}
          </dl>

          {socials.length > 0 && (
            <div className="flex items-center gap-0.5">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-faint transition-colors duration-200 hover:text-ink hover:bg-surface"
                >
                  <SocialIcon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right: form */}
        <div>
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-line bg-card p-10 text-center">
              <CheckCircle2 size={32} className="text-success" />
              <h3 className="text-xl font-semibold text-ink">Message sent</h3>
              <p className="text-sm text-muted">Thanks for reaching out — I&apos;ll read it and reply.</p>
              <button
                onClick={reset}
                className="text-sm text-accent-400 transition-colors duration-200 hover:text-accent-300"
              >
                Send another →
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-line bg-card p-6"
            >
              {error && (
                <div className="rounded-lg border border-error/30 bg-error/10 px-3 py-2.5 text-xs text-error">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { field: 'name', label: 'Name', placeholder: 'Your name', type: 'text', autoComplete: 'name' },
                  { field: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email', autoComplete: 'email' },
                ].map(({ field, label, placeholder, type, autoComplete }) => (
                  <div key={field}>
                    <label htmlFor={field} className="mb-1.5 block text-xs text-faint">
                      {label}
                    </label>
                    <input
                      id={field}
                      type={type}
                      name={field}
                      required
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      className={inputClass}
                    />
                    {fieldErrors[field] && (
                      <p className="mt-1 text-xs text-error">{fieldErrors[field][0]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs text-faint">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  required
                  placeholder="What's this about?"
                  autoComplete="off"
                  className={inputClass}
                />
                {fieldErrors.subject && (
                  <p className="mt-1 text-xs text-error">{fieldErrors.subject[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs text-faint">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project or idea…"
                  className={`${inputClass} resize-none`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-error">{fieldErrors.message[0]}</p>
                )}
              </div>

              {/* Honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-600 disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </SectionContainer>
  );
}
