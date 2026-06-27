'use client';

import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function KPICard({ label, value, icon: Icon, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl p-[1px]',
        'bg-gradient-to-br from-[var(--color-dark-gold)]/40 via-[var(--color-dark-line)] to-transparent',
        className
      )}
    >
      <div className="flex items-center gap-4 rounded-[11px] bg-[var(--color-dark-surface)] px-5 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-dark-gold)]/10">
          <Icon className="h-5 w-5 text-[var(--color-dark-gold)]" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-[var(--color-dark-text)]">
            {value}
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-dark-muted)]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
