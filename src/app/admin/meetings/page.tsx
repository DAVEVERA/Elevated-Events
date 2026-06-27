'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { Calendar, Search, Filter, ExternalLink, Video, MapPin } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import type { Column } from '@/components/admin/DataTable';
import type { Meeting, MeetingStatus, MeetingType } from '@/types';
import { format, parseISO } from 'date-fns';

const STATUS_OPTIONS: { value: MeetingStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'requested', label: 'Requested' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'needs_manual_planning', label: 'Manual Planning' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const TYPE_OPTIONS: { value: MeetingType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'digital', label: 'Digital' },
  { value: 'face_to_face', label: 'Face to Face' },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchMeetings() {
      const supabase = createClient();
      const { data } = await supabase
        .from('meetings')
        .select('*, lead:leads(*)')
        .order('created_at', { ascending: false });

      setMeetings((data as Meeting[]) ?? []);
      setLoading(false);
    }
    fetchMeetings();
  }, []);

  const filtered = useMemo(() => {
    let result = meetings;

    if (statusFilter) {
      result = result.filter((m) => m.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter((m) => m.meeting_type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          (m.lead?.full_name ?? '').toLowerCase().includes(q) ||
          (m.lead?.company_name ?? '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [meetings, statusFilter, typeFilter, search]);

  const columns: Column<Meeting>[] = useMemo(
    () => [
      {
        key: 'lead_name',
        header: 'Lead',
        sortable: true,
        sortValue: (row) => (row.lead?.full_name ?? '').toLowerCase(),
        render: (row) => (
          <span className="font-medium">
            {row.lead?.full_name ?? 'Unknown'}
          </span>
        ),
      },
      {
        key: 'company',
        header: 'Company',
        render: (row) => (
          <span className="text-[var(--color-dark-muted)]">
            {row.lead?.company_name ?? '-'}
          </span>
        ),
      },
      {
        key: 'meeting_type',
        header: 'Type',
        sortable: true,
        render: (row) => (
          <span className="inline-flex items-center gap-1.5 text-[var(--color-dark-muted)]">
            {row.meeting_type === 'digital' ? (
              <Video className="h-3.5 w-3.5" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            <span className="capitalize">
              {row.meeting_type.replace(/_/g, ' ')}
            </span>
          </span>
        ),
      },
      {
        key: 'start_time',
        header: 'Date / Time',
        sortable: true,
        sortValue: (row) => row.start_time ?? '',
        render: (row) => (
          <span className="text-[var(--color-dark-muted)]">
            {row.start_time
              ? format(parseISO(row.start_time), 'MMM d, yyyy HH:mm')
              : 'TBD'}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: 'meeting_link',
        header: 'Link',
        render: (row) =>
          row.meeting_link ? (
            <a
              href={row.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[var(--color-dark-gold)] transition-colors hover:text-[var(--color-dark-soft-gold)]"
            >
              Join
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[var(--color-dark-muted)]">-</span>
          ),
      },
    ],
    []
  );

  const selectClasses = cn(
    'h-9 rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] px-3 text-sm text-[var(--color-dark-text)]',
    'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20',
    'appearance-none'
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
            Meetings
          </h1>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
          Meetings
        </h1>
        <p className="mt-1 text-sm text-[var(--color-dark-muted)]">
          {meetings.length} total meetings
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-dark-muted)]" />
          <input
            type="text"
            placeholder="Search by lead or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'h-9 w-full rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] pl-9 pr-4 text-sm text-[var(--color-dark-text)] placeholder:text-[var(--color-dark-muted)]/60',
              'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20'
            )}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClasses}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={selectClasses}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {(statusFilter || typeFilter || search) && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setTypeFilter('');
            }}
            className="flex items-center gap-1 text-xs text-[var(--color-dark-muted)] transition-colors hover:text-[var(--color-dark-text)]"
          >
            <Filter className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowKey={(row) => row.id}
        pageSize={10}
        emptyState={
          <EmptyState
            icon={Calendar}
            title="No meetings found"
            description={
              search || statusFilter || typeFilter
                ? 'Try adjusting your filters.'
                : 'Meetings will appear here once leads book them.'
            }
          />
        }
      />
    </div>
  );
}
