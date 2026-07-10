'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { RippleContainer } from '@/components/ui/RippleContainer';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  children,
}: ButtonProps) {
  const classes = `btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  // Ripple only reads well on filled/bordered surfaces — skip on ghost, it'd
  // just look like a stray smudge with no surface to contain it.
  const rippleRadius = size === 'lg' ? 'rounded-[var(--radius-lg)]' : 'rounded-[var(--radius-md)]';

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  );

  if (href) {
    const isPlainAnchor =
      external ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:');

    if (variant === 'ghost') {
      return isPlainAnchor ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          onClick={onClick}
          className={classes}
        >
          {content}
        </a>
      ) : (
        <Link href={href} onClick={onClick} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <RippleContainer className={`${classes} ${rippleRadius} !inline-flex`}>
        {isPlainAnchor ? (
          <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            onClick={onClick}
            className="flex items-center gap-2"
          >
            {content}
          </a>
        ) : (
          <Link href={href} onClick={onClick} className="flex items-center gap-2">
            {content}
          </Link>
        )}
      </RippleContainer>
    );
  }

  if (variant === 'ghost') {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <RippleContainer className={`${classes} ${rippleRadius} !inline-flex`}>
      <button type={type} onClick={onClick} className="flex items-center gap-2 bg-transparent">
        {content}
      </button>
    </RippleContainer>
  );
}
