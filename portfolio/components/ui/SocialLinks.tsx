'use client';

import { motion } from 'motion/react';
import type { Social } from '@/types';
import { SocialIcon } from '@/components/ui/SocialIcon';

const EASE = [0.22, 1, 0.36, 1] as const;

type SocialLinksSize = 'sm' | 'md' | 'lg';
type SocialLinksVariant = 'outline' | 'ghost';

const SIZE_CLASSES: Record<SocialLinksSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-10 w-10',
};

const ICON_SIZE: Record<SocialLinksSize, number> = {
  sm: 15,
  md: 16,
  lg: 16,
};

const VARIANT_CLASSES: Record<SocialLinksVariant, string> = {
  outline:
    'rounded-full border border-border text-faint hover:border-border-hover hover:text-ink',
  ghost: 'rounded-lg text-faint hover:bg-surface hover:text-ink',
};

interface SocialLinksProps {
  socials: Social[];
  size?: SocialLinksSize;
  variant?: SocialLinksVariant;
  /** Lift-on-hover micro-interaction; off by default for dense contexts like the navbar. */
  liftOnHover?: boolean;
  /** Called with the clicked social on every click — for analytics, etc. */
  onItemClick?: (social: Social) => void;
  className?: string;
}

/**
 * Shared social-icon row used by Hero, Contact, Footer, and Navbar. Existed
 * as four near-identical copies before (same href/target/rel/aria-label
 * logic, only sizing and hover style differed) — consolidated here.
 */
export function SocialLinks({
  socials,
  size = 'md',
  variant = 'outline',
  liftOnHover = true,
  onItemClick,
  className = '',
}: SocialLinksProps) {
  if (socials.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socials.map((s) => {
        const content = (
          <a
            href={s.href}
            target={s.platform === 'email' ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={s.label}
            onClick={onItemClick ? () => onItemClick(s) : undefined}
            className={`flex items-center justify-center transition-colors duration-200 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}
          >
            <SocialIcon name={s.icon} size={ICON_SIZE[size]} />
          </a>
        );

        if (!liftOnHover) return <div key={s.platform}>{content}</div>;

        return (
          <motion.div key={s.platform} whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            {content}
          </motion.div>
        );
      })}
    </div>
  );
}
