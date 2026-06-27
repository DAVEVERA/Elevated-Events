'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { Users, Search, Filter } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import type { Column } from '@/components/admin/DataTable';
import type { Lead, LeadStatus } from '@/types';
import { format, parseISO } from 'date-fns';

const LEAD_STATUS_OPTIONS: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const EVENT_TYPE_OPTIONS = [
  { value: '', label: 'All Event Types' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'conference', label: 'Conference' },
  { value: 'gala', label: 'Gala' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      setLeads((data as Lead[]) ?? []);
      setLoading(false);
    }
    fetchLeads();
  }, []);

  const filtered = useMemo(() => {
    let result = leads;

    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (eventTypeFilter) {
      result = result.filter((l) => l.event_type === eventTypeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.full_name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.company_name && l.company_name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [leads, search, statusFilter, eventTypeFilter]);

  const columns: Column<Lead>[] = useMemo(
    () => [
      {
        key: 'full_name',
        header: 'Name',
        sortable: true,
        sortValue: (row) => row.full_name.toLowerCase(),
        render: (row) => (
          <span className="font-medium">{row.full_name}</span>
        ),
      },
      {
        key: 'company_name',
        header: 'Company',
        sortable: true,
        sortValue: (row) => (row.company_name ?? '').toLowerCase(),
        render: (row) => (
          <span className="text-[var(--color-dark-muted)]">
            {row.company_name ?? '-'}
          </span>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        render: (row) => (
          <span className="text-[var(--color-dark-muted)]">{row.email}</span>
        ),
      },
      {
        key: 'event_type',
        header: 'Event Type',
        sortable: true,
        render: (row) => (
          <span className="capitalize text-[var(--color-dark-muted)]">
            {row.event_type?.replace(/_/g, ' ') ?? '-'}
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
        key: 'enrichment_status',
        header: 'Enrichment',
        render: (row) => <StatusBadge status={row.enrichment_status} />,
      },
      {
        key: 'created_at',
        header: 'Created',
        sortable: true,
        sortValue: (row) => row.created_at,
        render: (row) => (
          <span className="text-xs text-[var(--color-dark-muted)]">
            {format(parseISO(row.created_at), 'MMM d, yyyy')}
          </span>
        ),
      },
    ],
    []
  );

  const handleRowClick = useCallback(
    (row: Lead) => router.push(`/admin/leads/${row.id}`),
    [router]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
            Leads
          </h1>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const selectClasses = cn(
    'h-9 rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] px-3 text-sm text-[var(--color-dark-text)]',
    'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20',
    'appearance-none'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
          Leads
        </h1>
        <p className="mt-1 text-sm text-[var(--color-dark-muted)]">
          {leads.length} total leads
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-dark-muted)]" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
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
          aria-label="Filter by status"
        >
          {LEAD_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className={selectClasses}
          aria-label="Filter by event type"
        >
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {(statusFilter || eventTypeFilter || search) && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setEventTypeFilter('');
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
        onRowClick={handleRowClick}
        pageSize={10}
        emptyState={
          <EmptyState
            icon={Users}
            title="No leads found"
            description={
              search || statusFilter || eventTypeFilter
                ? 'Try adjusting your filters.'
                : 'Leads will appear here once prospects fill out the intake form.'
            }
          />
        }
      />
    </div>
  );
}
