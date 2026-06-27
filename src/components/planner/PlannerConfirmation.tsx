'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Check, Monitor, Users, Mail, Sparkles } from 'lucide-react';
import type { PlannerFormValues } from '@/lib/validations/planner';

interface PlannerConfirmationProps {
  data: PlannerFormValues;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-border-soft/50 last:border-0">
      <span className="text-text-muted text-sm flex-shrink-0">{label}</span>
      <span className="text-text-dark text-sm text-right">{value}</span>
    </div>
  );
}

export function PlannerConfirmation({ data }: PlannerConfirmationProps) {
  const isDigital = data.meeting_type === 'digital';

  const formattedSlot = data.selected_slot
    ? format(parseISO(data.selected_slot), "EEEE d MMMM yyyy 'om' HH:mm", {
        locale: nl,
      })
    : null;

  const timeWindowLabels: Record<string, string> = {
    ochtend: 'Ochtend (09:00 - 12:00)',
    middag: 'Middag (12:00 - 17:00)',
    avond: 'Avond (17:00 - 20:00)',
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute -top-2 -right-4"
        >
          <Sparkles className="w-5 h-5 text-soft-gold" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="absolute -bottom-1 -left-3"
        >
          <Sparkles className="w-4 h-4 text-deep-gold/60" />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-deep-gold/15 flex items-center justify-center ring-4 ring-deep-gold/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
          >
            <Check className="w-8 h-8 text-deep-gold" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-3"
      >
        <h2 className="font-serif text-3xl md:text-4xl text-text-dark">
          {isDigital ? 'Je kennismaking staat gepland' : 'Je aanvraag is ontvangen'}
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          {isDigital
            ? 'De bevestiging met meetinglink is naar je inbox gestuurd.'
            : 'Gabriela bekijkt locatie, reistijd en beschikbaarheid en komt persoonlijk bij je terug.'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-[30px] border border-border-soft bg-white/80 backdrop-blur-sm p-6 space-y-1 shadow-[0_4px_30px_rgba(170,122,40,0.08)]"
      >
        <div className="flex items-center gap-2 mb-4">
          {isDigital ? (
            <Monitor size={16} className="text-deep-gold" />
          ) : (
            <Users size={16} className="text-deep-gold" />
          )}
          <span className="text-text-dark font-serif text-sm">
            {isDigital ? 'Digitale kennismaking' : 'Persoonlijke afspraak'}
          </span>
        </div>

        <SummaryRow label="Naam" value={data.full_name} />
        <SummaryRow label="Bedrijf" value={data.company_name} />
        <SummaryRow label="E-mail" value={data.email} />
        <SummaryRow label="Telefoon" value={data.phone} />
        {data.website && <SummaryRow label="Website" value={data.website} />}
        {data.linkedin_url && <SummaryRow label="LinkedIn" value={data.linkedin_url} />}
        <SummaryRow label="Type event" value={data.event_type} />
        {data.estimated_event_date && (
          <SummaryRow label="Verwachte datum" value={data.estimated_event_date} />
        )}
        {data.estimated_guest_count && (
          <SummaryRow
            label="Aantal gasten"
            value={String(data.estimated_guest_count)}
          />
        )}

        {isDigital && formattedSlot && (
          <SummaryRow label="Gepland op" value={formattedSlot} />
        )}

        {!isDigital && data.preferred_date_windows && data.preferred_date_windows.length > 0 && (
          <SummaryRow
            label="Voorkeursdagen"
            value={data.preferred_date_windows
              .map((d) => format(parseISO(d), 'EEE d MMM', { locale: nl }))
              .join(', ')}
          />
        )}

        {!isDigital && data.preferred_time_windows && data.preferred_time_windows.length > 0 && (
          <SummaryRow
            label="Voorkeursmoment"
            value={data.preferred_time_windows
              .map((w) => timeWindowLabels[w] || w)
              .join(', ')}
          />
        )}

        {!isDigital && data.preferred_location && (
          <SummaryRow label="Locatie" value={data.preferred_location} />
        )}

        {data.message && <SummaryRow label="Bericht" value={data.message} />}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-2 text-text-muted text-sm"
      >
        <Mail size={14} className="text-deep-gold/60" />
        <span>
          Bevestiging is verstuurd naar{' '}
          <span className="text-text-dark font-medium">{data.email}</span>
        </span>
      </motion.div>
    </div>
  );
}
