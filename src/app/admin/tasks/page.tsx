'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import {
  CheckSquare,
  LayoutList,
  Columns3,
  Clock,
  ChevronDown,
  ChevronRight,
  User,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PriorityBadge } from '@/components/admin/PriorityBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import type { Task, TaskStatus } from '@/types';
import { format, parseISO } from 'date-fns';

type ViewMode = 'kanban' | 'list';

const STATUS_GROUPS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'open', label: 'Open', color: 'bg-blue-500' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { status: 'done', label: 'Done', color: 'bg-emerald-500' },
];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      const supabase = createClient();
      const { data } = await supabase
        .from('tasks')
        .select('*, lead:leads(*)')
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      setTasks((data as Task[]) ?? []);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      open: [],
      in_progress: [],
      done: [],
      archived: [],
    };
    tasks.forEach((t) => {
      if (groups[t.status]) {
        groups[t.status].push(t);
      }
    });
    return groups;
  }, [tasks]);

  const handleStatusToggle = useCallback(
    async (task: Task, newStatus: TaskStatus) => {
      const supabase = createClient();
      await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    },
    []
  );

  const nextStatus = (current: TaskStatus): TaskStatus => {
    const flow: Record<TaskStatus, TaskStatus> = {
      open: 'in_progress',
      in_progress: 'done',
      done: 'open',
      archived: 'open',
    };
    return flow[current];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
            Tasks
          </h1>
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-[var(--color-dark-muted)]">
            {tasks.length} active tasks
          </p>
        </div>

        <div className="flex items-center rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-surface)] p-0.5">
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'kanban'
                ? 'bg-[var(--color-dark-gold)]/10 text-[var(--color-dark-gold)]'
                : 'text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)]'
            )}
          >
            <Columns3 className="h-3.5 w-3.5" />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'list'
                ? 'bg-[var(--color-dark-gold)]/10 text-[var(--color-dark-gold)]'
                : 'text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)]'
            )}
          >
            <LayoutList className="h-3.5 w-3.5" />
            List
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Tasks are created automatically from lead activity or added manually."
        />
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STATUS_GROUPS.map(({ status, label, color }) => (
            <div key={status} className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', color)} />
                <h2 className="text-sm font-medium text-[var(--color-dark-text)]">
                  {label}
                </h2>
                <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-[var(--color-dark-muted)]">
                  {grouped[status].length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {grouped[status].length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--color-dark-line)] px-4 py-8 text-center text-xs text-[var(--color-dark-muted)]">
                    No tasks
                  </div>
                ) : (
                  grouped[status].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      expanded={expandedTask === task.id}
                      onToggleExpand={() =>
                        setExpandedTask((prev) =>
                          prev === task.id ? null : task.id
                        )
                      }
                      onStatusToggle={() =>
                        handleStatusToggle(task, nextStatus(task.status))
                      }
                      onLeadClick={
                        task.lead_id
                          ? () => router.push(`/admin/leads/${task.lead_id}`)
                          : undefined
                      }
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {STATUS_GROUPS.map(({ status, label, color }) => (
            <div key={status}>
              <div className="mb-2 flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', color)} />
                <h2 className="text-sm font-medium text-[var(--color-dark-text)]">
                  {label}
                </h2>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-[var(--color-dark-muted)]">
                  {grouped[status].length}
                </span>
              </div>

              {grouped[status].length === 0 ? (
                <p className="py-3 pl-4 text-xs text-[var(--color-dark-muted)]">
                  No tasks in this group.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--color-dark-line)] bg-[var(--color-dark-card)]">
                  <ul className="divide-y divide-[var(--color-dark-line)]">
                    {grouped[status].map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() =>
                              handleStatusToggle(
                                task,
                                nextStatus(task.status)
                              )
                            }
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                              task.status === 'done'
                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                : 'border-[var(--color-dark-line)] hover:border-[var(--color-dark-gold)]'
                            )}
                            aria-label={`Mark as ${nextStatus(task.status)}`}
                          >
                            {task.status === 'done' && (
                              <CheckSquare className="h-3 w-3" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <p
                              className={cn(
                                'truncate text-sm',
                                task.status === 'done'
                                  ? 'text-[var(--color-dark-muted)] line-through'
                                  : 'text-[var(--color-dark-text)]'
                              )}
                            >
                              {task.title}
                            </p>
                            {task.lead?.full_name && (
                              <p className="text-xs text-[var(--color-dark-muted)]">
                                {task.lead.full_name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <PriorityBadge priority={task.priority} />
                          {task.due_at && (
                            <span className="flex items-center gap-1 whitespace-nowrap text-xs text-[var(--color-dark-muted)]">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(task.due_at), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  expanded,
  onToggleExpand,
  onStatusToggle,
  onLeadClick,
}: {
  task: Task;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusToggle: () => void;
  onLeadClick?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-dark-line)] bg-[var(--color-dark-card)] transition-colors hover:border-[var(--color-dark-gold)]/20">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={onToggleExpand}
            className="flex min-w-0 items-start gap-1.5 text-left"
          >
            {expanded ? (
              <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-dark-muted)]" />
            ) : (
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-dark-muted)]" />
            )}
            <span className="text-sm font-medium text-[var(--color-dark-text)]">
              {task.title}
            </span>
          </button>
          <PriorityBadge priority={task.priority} />
        </div>

        {expanded && task.description && (
          <p className="mt-2 pl-5 text-xs leading-relaxed text-[var(--color-dark-muted)]">
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex items-center justify-between pl-5">
          <div className="flex items-center gap-3">
            {task.due_at && (
              <span className="flex items-center gap-1 text-xs text-[var(--color-dark-muted)]">
                <Clock className="h-3 w-3" />
                {format(parseISO(task.due_at), 'MMM d')}
              </span>
            )}
            {task.lead?.full_name && (
              <button
                onClick={onLeadClick}
                className="flex items-center gap-1 text-xs text-[var(--color-dark-muted)] transition-colors hover:text-[var(--color-dark-gold)]"
              >
                <User className="h-3 w-3" />
                {task.lead.full_name}
              </button>
            )}
          </div>

          <button
            onClick={onStatusToggle}
            className={cn(
              'rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors',
              task.status === 'done'
                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : task.status === 'in_progress'
                  ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            )}
          >
            {task.status === 'open'
              ? 'Start'
              : task.status === 'in_progress'
                ? 'Done'
                : 'Reopen'}
          </button>
        </div>
      </div>
    </div>
  );
}
