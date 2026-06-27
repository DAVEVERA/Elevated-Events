'use client';

import { cn } from '@/lib/utils/cn';
import type { LeadStatus, MeetingStatus, EnrichmentStatus, TaskStatus } from '@/types';

type BadgeStatus = LeadStatus | MeetingStatus | EnrichmentStatus | TaskStatus;

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  contacted: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  qualified: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  converted: 'bg-[var(--color-dark-gold)]/15 text-[var(--color-dark-soft-gold)] ring-[var(--color-dark-gold)]/30',
  lost: 'bg-red-500/15 text-red-400 ring-red-500/30',

  requested: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  needs_manual_planning: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  cancelled: 'bg-red-500/15 text-red-400 ring-red-500/30',
  completed: 'bg-[var(--color-dark-gold)]/15 text-[var(--color-dark-soft-gold)] ring-[var(--color-dark-gold)]/30',

  pending: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
  processing: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  failed: 'bg-red-500/15 text-red-400 ring-red-500/30',

  open: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  in_progress: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  done: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  archived: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost',
  requested: 'Requested',
  confirmed: 'Confirmed',
  needs_manual_planning: 'Manual Planning',
  cancelled: 'Cancelled',
  completed: 'Completed',
  pending: 'Pending',
  processing: 'Processing',
  failed: 'Failed',
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
  archived: 'Archived',
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        STATUS_STYLES[status] ?? 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
