'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import {
  Users,
  Calendar,
  CheckSquare,
  UserPlus,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { KPICard } from '@/components/admin/KPICard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DashboardSkeleton } from '@/components/admin/LoadingSkeleton';
import type { Lead, Meeting, Task } from '@/types';
import { format, isToday, parseISO } from 'date-fns';

interface DashboardData {
  leads: Lead[];
  meetings: Meeting[];
  tasks: Task[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const supabase = createClient();

      const [leadsRes, meetingsRes, tasksRes] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('meetings')
          .select('*, lead:leads(*)')
          .order('start_time', { ascending: true })
          .limit(50),
        supabase
          .from('tasks')
          .select('*, lead:leads(*)')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      setData({
        leads: (leadsRes.data as Lead[]) ?? [],
        meetings: (meetingsRes.data as Meeting[]) ?? [],
        tasks: (tasksRes.data as Task[]) ?? [],
      });
      setLoading(false);
    }

    fetchDashboard();
  }, []);

  const kpis = useMemo(() => {
    if (!data) return null;

    const newLeadsToday = data.leads.filter((l) => {
      try {
        return isToday(parseISO(l.created_at));
      } catch {
        return false;
      }
    }).length;

    const upcomingMeetings = data.meetings.filter(
      (m) => m.status === 'confirmed' || m.status === 'requested'
    ).length;

    const openTasks = data.tasks.filter(
      (t) => t.status === 'open' || t.status === 'in_progress'
    ).length;

    const f2fRequests = data.meetings.filter(
      (m) =>
        m.meeting_type === 'face_to_face' &&
        m.status === 'requested'
    ).length;

    return { newLeadsToday, upcomingMeetings, openTasks, f2fRequests };
  }, [data]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data || !kpis) return null;

  const recentLeads = data.leads.slice(0, 5);
  const upcomingMeetingsList = data.meetings
    .filter((m) => m.status === 'confirmed' || m.status === 'requested')
    .slice(0, 5);
  const recentTasks = data.tasks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-dark-muted)]">
          Overview of your leads, meetings, and tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="New Leads Today"
          value={kpis.newLeadsToday}
          icon={UserPlus}
        />
        <KPICard
          label="Upcoming Meetings"
          value={kpis.upcomingMeetings}
          icon={Calendar}
        />
        <KPICard
          label="Open Tasks"
          value={kpis.openTasks}
          icon={CheckSquare}
        />
        <KPICard
          label="F2F Requests"
          value={kpis.f2fRequests}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ActivityCard
          title="Recent Leads"
          icon={UserPlus}
          actionLabel="View All"
          onAction={() => router.push('/admin/leads')}
        >
          {recentLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-dark-muted)]">
              No leads yet.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-dark-line)]">
              {recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-dark-text)]">
                      {lead.full_name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-dark-muted)]">
                      {lead.company_name ?? lead.email}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </li>
              ))}
            </ul>
          )}
        </ActivityCard>

        <ActivityCard
          title="Upcoming Meetings"
          icon={Calendar}
          actionLabel="View All"
          onAction={() => router.push('/admin/meetings')}
        >
          {upcomingMeetingsList.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-dark-muted)]">
              No upcoming meetings.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-dark-line)]">
              {upcomingMeetingsList.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-dark-text)]">
                      {m.lead?.full_name ?? 'Unknown'}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-dark-muted)]">
                      <Clock className="h-3 w-3" />
                      {m.start_time
                        ? format(parseISO(m.start_time), 'MMM d, HH:mm')
                        : 'TBD'}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </ActivityCard>

        <ActivityCard
          title="Recent Tasks"
          icon={CheckSquare}
          actionLabel="View All"
          onAction={() => router.push('/admin/tasks')}
        >
          {recentTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--color-dark-muted)]">
              No tasks yet.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-dark-line)]">
              {recentTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-dark-text)]">
                      {t.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-dark-muted)]">
                      {t.lead?.full_name ?? 'Unlinked'}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </ActivityCard>
      </div>
    </div>
  );
}

function ActivityCard({
  title,
  icon: Icon,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-dark-line)] bg-[var(--color-dark-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-dark-line)] px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-dark-text)]">
          <Icon className="h-4 w-4 text-[var(--color-dark-gold)]" />
          {title}
        </span>
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs text-[var(--color-dark-muted)] transition-colors hover:text-[var(--color-dark-soft-gold)]"
        >
          {actionLabel}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      {children}
    </div>
  );
}
