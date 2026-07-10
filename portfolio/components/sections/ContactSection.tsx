'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Send, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { FloatingField } from '@/components/ui/FloatingField';
import type { Profile, Social } from '@/types';
import { useContact } from '@/hooks/useContact';

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactSection({ profile, socials: allSocials }: { profile: Profile; socials: Social[] }) {
  const { sending, sent, error, fieldErrors, submit, reset } = useContact();
  const socials = allSocials.filter((s) => s.platform !== 'email');
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);

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

  return (
    <SectionContainer id="contact" width="wide" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-72 w-72 rounded-full bg-accent2-500/8 blur-[100px]" />
      </div>

      <MotionReveal>
        <SectionHeading eyebrow="Contact" title="Get in touch" description={profile.contactNote || undefined} />
      </MotionReveal>

      <div className="mt-14 grid items-start gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        {/* ============== Left: reachable details ============== */}
        <MotionReveal from="left" delay={0.05} className="space-y-9">
          {profile.currentWork && (
            <div className="flex items-start gap-2.5">
              <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <p className="text-sm leading-relaxed text-muted">{profile.currentWork}</p>
            </div>
          )}

          <dl className="space-y-5">
            {profile.email && (
              <div className="flex items-start gap-3 group">
                <Mail size={15} className="mt-0.5 shrink-0 text-faint transition-colors group-hover:text-accent-300" />
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-faint">Email</dt>
                  <dd className="mt-0.5 text-sm text-ink">
                    <a href={`mailto:${profile.email}`} className="transition-colors duration-200 hover:text-accent-300">
                      {profile.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {profile.location && (
              <div className="flex items-start gap-3 group">
                <MapPin size={15} className="mt-0.5 shrink-0 text-faint transition-colors group-hover:text-accent-300" />
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-faint">Location</dt>
                  <dd className="mt-0.5 text-sm text-ink">{profile.location}</dd>
                </div>
              </div>
            )}
          </dl>

          {socials.length > 0 && <SocialLinks socials={socials} size="lg" className="pt-2" />}
        </MotionReveal>

        {/* ============== Right: glass form ============== */}
        <MotionReveal from="right" delay={0.1}>
          <div className="card-glass relative rounded-[var(--radius-xl)] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex flex-col items-center justify-center gap-4 py-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg"
                  >
                    <CheckCircle2 size={28} className="text-success" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-ink">Message sent</h3>
                  <p className="max-w-[32ch] text-sm text-muted">
                    Thanks for reaching out — I&apos;ll read it and reply soon.
                  </p>
                  <button
                    onClick={reset}
                    className="text-sm font-medium text-accent-300 transition-colors duration-200 hover:text-accent-200"
                  >
                    Send another message →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="space-y-5"
                  noValidate
                >
                  {error && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-error/30 bg-error-bg px-3.5 py-2.5 text-xs text-error"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingField
                      label="Name"
                      name="name"
                      autoComplete="name"
                      required
                      error={fieldErrors.name?.[0]}
                    />
                    <FloatingField
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      error={fieldErrors.email?.[0]}
                    />
                  </div>

                  <FloatingField
                    label="Subject"
                    name="subject"
                    autoComplete="off"
                    required
                    error={fieldErrors.subject?.[0]}
                  />

                  <FloatingField
                    label="Message"
                    name="message"
                    required
                    multiline
                    rows={5}
                    error={fieldErrors.message?.[0]}
                  />

                  {/* Honeypot */}
                  <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                  <motion.button
                    type="submit"
                    disabled={sending}
                    onPointerDown={() => setPressed(true)}
                    onPointerUp={() => setPressed(false)}
                    onPointerLeave={() => setPressed(false)}
                    animate={reduceMotion ? undefined : { scale: pressed ? 0.98 : 1 }}
                    transition={{ duration: 0.15 }}
                    className="btn btn-primary btn-lg w-full"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {sending ? (
                        <motion.span
                          key="sending"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Sending…
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Send size={15} />
                          Send message
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </MotionReveal>
      </div>
    </SectionContainer>
  );
}
