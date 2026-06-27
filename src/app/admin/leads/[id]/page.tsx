'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Link2,
  Building2,
  CalendarDays,
  Users as UsersIcon,
  FileText,
  Clock,
  ExternalLink,
  Sparkles,
  Save,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PriorityBadge } from '@/components/admin/PriorityBadge';
import { DetailSkeleton } from '@/components/admin/LoadingSkeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import type { Lead, Meeting, Task, ProspectEnrichment } from '@/types';
import { format, parseISO } from 'date-fns';

interface LeadDetailData {
  lead: Lead;
  meetings: Meeting[];
  tasks: Task[];
  enrichment: ProspectEnrichment | null;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [data, setData] = useState<LeadDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      const supabase = createClient();

      const [leadRes, meetingsRes, tasksRes, enrichmentRes] =
        await Promise.all([
          supabase.from('leads').select('*').eq('id', leadId).single(),
          supabase
            .from('meetings')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false }),
          supabase
            .from('tasks')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false }),
          supabase
            .from('prospect_enrichments')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

      if (!leadRes.data) {
        router.replace('/admin/leads');
        return;
      }

      const lead = leadRes.data as Lead;
      setNotes(lead.message ?? '');
      setData({
        lead,
        meetings: (meetingsRes.data as Meeting[]) ?? [],
        tasks: (tasksRes.data as Task[]) ?? [],
        enrichment: (enrichmentRes.data as ProspectEnrichment) ?? null,
      });
      setLoading(false);
    }

    fetchLead();
  }, [leadId, router]);

  const handleSaveNotes = useCallback(async () => {
    if (!data) return;
    setSavingNotes(true);
    const supabase = createClient();
    await supabase.from('leads').update({ message: notes }).eq('id', leadId);
    setSavingNotes(false);
  }, [data, notes, leadId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[var(--color-dark-muted)] transition-colors hover:text-[var(--color-dark-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </button>
        <DetailSkeleton />
      </div>
    );
  }

  if (!data) return null;

  const { lead, meetings, tasks, enrichment } = data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[var(--color-dark-muted)] transition-colors hover:text-[var(--color-dark-text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leads
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--color-dark-text)]">
            {lead.full_name}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-dark-muted)]">
            {lead.company_name ?? 'No company'} &middot; Added{' '}
            {format(parseISO(lead.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          <StatusBadge status={lead.enrichment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Event Details" icon={CalendarDays}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow
                label="Event Type"
                value={lead.event_type?.replace(/_/g, ' ') ?? '-'}
                capitalize
              />
              <InfoRow
                label="Estimated Date"
                value={
                  lead.estimated_event_date
                    ? format(
                        parseISO(lead.estimated_event_date),
                        'MMMM d, yyyy'
                      )
                    : '-'
                }
              />
              <InfoRow
                label="Estimated Guests"
                value={lead.estimated_guest_count?.toString() ?? '-'}
              />
              <InfoRow label="Status" value={<StatusBadge status={lead.status} />} />
            </div>
          </Card>

          <Card title="Notes" icon={FileText}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={cn(
                'w-full resize-none rounded-lg border border-[var(--color-dark-line)] bg-[var(--color-dark-bg)] px-4 py-3 text-sm text-[var(--color-dark-text)] placeholder:text-[var(--color-dark-muted)]/50',
                'outline-none transition-colors focus:border-[var(--color-dark-gold)]/50 focus:ring-1 focus:ring-[var(--color-dark-gold)]/20'
              )}
              placeholder="Add notes about this lead..."
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg bg-[var(--color-dark-gold)]/10 px-4 py-2 text-xs font-medium text-[var(--color-dark-gold)] transition-colors',
                  'hover:bg-[var(--color-dark-gold)]/20',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                <Save className="h-3.5 w-3.5" />
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </Card>

          {enrichment && enrichment.status === 'completed' && (
            <Card title="Prospect Intelligence" icon={Sparkles}>
              <div className="space-y-4">
                {enrichment.company_summary && (
                  <InfoBlock label="Company Summary" value={enrichment.company_summary} />
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {enrichment.industry && (
                    <InfoRow label="Industry" value={enrichment.industry} />
                  )}
                  {enrichment.company_size_estimate && (
                    <InfoRow label="Size" value={enrichment.company_size_estimate} />
                  )}
                  {enrichment.location && (
                    <InfoRow label="Location" value={enrichment.location} />
                  )}
                  {enrichment.brand_tone && (
                    <InfoRow label="Brand Tone" value={enrichment.brand_tone} />
                  )}
                </div>
                {enrichment.suggested_sales_angle && (
                  <InfoBlock label="Sales Angle" value={enrichment.suggested_sales_angle} />
                )}
                {enrichment.event_relevance_notes && (
                  <InfoBlock label="Event Relevance" value={enrichment.event_relevance_notes} />
                )}
                {enrichment.confidence_score != null && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[var(--color-dark-muted)]">
                      Confidence
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[var(--color-dark-gold)]"
                        style={{ width: `${Math.min(100, enrichment.confidence_score)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-dark-muted)]">
                      {enrichment.confidence_score}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card title="Timeline" icon={Clock}>
            {meetings.length === 0 && tasks.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--color-dark-muted)]">
                No events yet.
              </p>
            ) : (
              <div className="relative space-y-0 pl-6">
                <div className="absolute left-2.5 top-1 bottom-1 w-px bg-[var(--color-dark-line)]" />

                {[
                  ...meetings.map((m) => ({
                    type: 'meeting' as const,
                    id: m.id,
                    date: m.created_at,
                    title: `Meeting ${m.status}`,
                    subtitle: m.meeting_type === 'face_to_face' ? 'Face to Face' : 'Digital',
                    status: m.status,
                  })),
                  ...tasks.map((t) => ({
                    type: 'task' as const,
                    id: t.id,
                    date: t.created_at,
                    title: t.title,
                    subtitle: `Priority: ${t.priority}`,
                    status: t.status,
                  })),
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((event) => (
                    <div key={event.id} className="relative pb-4">
                      <div className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-dark-gold)] ring-2 ring-[var(--color-dark-surface)]" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-dark-text)]">
                            {event.title}
                          </p>
                          <p className="text-xs text-[var(--color-dark-muted)]">
                            {event.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={event.status} />
                          <span className="whitespace-nowrap text-xs text-[var(--color-dark-muted)]">
                            {format(parseISO(event.date), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Contact" icon={Mail}>
            <div className="space-y-3">
              <ContactRow icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              {lead.phone && (
                <ContactRow icon={Phone} label="Phone" value={lead.phone} href={`tel:${lead.phone}`} />
              )}
              {lead.website && (
                <ContactRow icon={Globe} label="Website" value={lead.website} href={lead.website} external />
              )}
              {lead.linkedin_url && (
                <ContactRow icon={Link2} label="LinkedIn" value="Profile" href={lead.linkedin_url} external />
              )}
              {lead.company_name && (
                <ContactRow icon={Building2} label="Company" value={lead.company_name} />
              )}
            </div>
          </Card>

          <Card title={`Meetings (${meetings.length})`} icon={CalendarDays}>
            {meetings.length === 0 ? (
              <p className="py-3 text-center text-sm text-[var(--color-dark-muted)]">
                No meetings linked.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-dark-line)]">
                {meetings.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[var(--color-dark-text)] capitalize">
                        {m.meeting_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-[var(--color-dark-muted)]">
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
          </Card>

          <Card title={`Tasks (${tasks.length})`} icon={FileText}>
            {tasks.length === 0 ? (
              <p className="py-3 text-center text-sm text-[var(--color-dark-muted)]">
                No tasks linked.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-dark-line)]">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[var(--color-dark-text)]">
                        {t.title}
                      </p>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <StatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-dark-line)] bg-[var(--color-dark-card)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-dark-line)] px-5 py-3">
        <Icon className="h-4 w-4 text-[var(--color-dark-gold)]" />
        <h2 className="text-sm font-medium text-[var(--color-dark-text)]">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  capitalize: cap,
}: {
  label: string;
  value: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <dl>
      <dt className="text-xs uppercase tracking-wider text-[var(--color-dark-muted)]">
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1 text-sm text-[var(--color-dark-text)]',
          cap && 'capitalize'
        )}
      >
        {value}
      </dd>
    </dl>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <dl>
      <dt className="mb-1 text-xs uppercase tracking-wider text-[var(--color-dark-muted)]">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-[var(--color-dark-text)]">
        {value}
      </dd>
    </dl>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon className="h-3.5 w-3.5 text-[var(--color-dark-muted)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-dark-muted)]">
          {label}
        </p>
        <p className="truncate text-sm text-[var(--color-dark-text)]">
          {value}
          {external && <ExternalLink className="ml-1 inline h-3 w-3 text-[var(--color-dark-muted)]" />}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block rounded-lg transition-colors hover:bg-white/[0.03]"
      >
        {content}
      </a>
    );
  }

  return content;
}
