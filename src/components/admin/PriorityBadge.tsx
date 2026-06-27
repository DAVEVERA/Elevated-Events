'use client';

import { cn } from '@/lib/utils/cn';
import type { TaskPriority } from '@/types';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
  medium: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  high: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
  urgent: 'bg-red-500/15 text-red-400 ring-red-500/30',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        PRIORITY_STYLES[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
