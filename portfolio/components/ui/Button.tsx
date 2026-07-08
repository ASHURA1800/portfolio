import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

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
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 border border-accent-500 hover:border-accent-600',
  secondary:
    'bg-transparent text-ink border border-line hover:border-accent-500/50 hover:text-ink',
  ghost:
    'bg-transparent text-faint hover:text-ink border border-transparent',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-lg',
  md: 'text-sm px-4.5 py-2.5 gap-2 rounded-lg',
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
  const classes = `inline-flex items-center justify-center font-medium transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

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

    if (isPlainAnchor) {
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          onClick={onClick}
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
