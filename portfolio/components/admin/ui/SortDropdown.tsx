'use client';

import { ArrowDownUp, Check } from 'lucide-react';
import { Dropdown, type DropdownItem } from './Dropdown';
import { Button } from './Button';

export interface SortOption {
  key: string;
  label: string;
}

export function SortDropdown({
  options,
  active,
  onChange,
}: {
  options: SortOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  const activeLabel = options.find((o) => o.key === active)?.label ?? 'Sort';

  const items: DropdownItem[] = options.map((opt) => ({
    label: opt.label,
    icon: opt.key === active ? <Check size={14} className="text-accent-300" /> : <span className="w-3.5" />,
    onClick: () => onChange(opt.key),
  }));

  return (
    <Dropdown
      trigger={
        <Button variant="outline" size="sm" icon={<ArrowDownUp size={13} />}>
          {activeLabel}
        </Button>
      }
      items={items}
      align="start"
    />
  );
}
