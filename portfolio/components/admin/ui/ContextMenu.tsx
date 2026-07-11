'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MoreHorizontal } from 'lucide-react';
import { Dropdown, type DropdownItem } from './Dropdown';
import { scaleIn } from './motion-presets';

/** Three-dot row action trigger — thin wrapper over Dropdown for the common "row menu" case. */
export function ActionMenu({ items }: { items: DropdownItem[] }) {
  return (
    <Dropdown
      trigger={
        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-faint transition-colors hover:bg-surface hover:text-ink">
          <MoreHorizontal size={16} />
          <span className="sr-only">Open row actions</span>
        </span>
      }
      items={items}
    />
  );
}

/**
 * Right-click context menu. Wrap any element as `children`; the menu opens
 * at the cursor position on contextmenu and closes on click-away, Escape,
 * or item selection. Note: right-click-to-open has no standard keyboard
 * equivalent (same as OS-level context menus) — ActionMenu above, built on
 * the fully keyboard-operable Dropdown, should be offered alongside this
 * for the same actions wherever keyboard/screen-reader users need them.
 */
export function ContextMenu({ children, items }: { children: ReactNode; items: DropdownItem[] }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!pos) return;

    const firstEnabled = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)');
    firstEnabled?.focus();

    const close = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      menuItems[(currentIndex + 1) % menuItems.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length]?.focus();
    }
  };

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setPos({ x: e.clientX, y: e.clientY });
        }}
      >
        {children}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {pos && (
              <motion.div
                ref={menuRef}
                role="menu"
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit="exit"
                onKeyDown={onMenuKeyDown}
                style={{ position: 'fixed', top: pos.y, left: pos.x }}
                className="z-[100] min-w-[10rem] rounded-[var(--radius-md)] border border-border-hover bg-bg-elevated p-1 shadow-lg"
              >
                {items.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick();
                      setPos(null);
                    }}
                    className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 ${
                      item.danger ? 'text-error hover:bg-error-bg' : 'text-ink hover:bg-surface-hover'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
