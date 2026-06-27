'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
  value: string | undefined;
  onChange: (slotStart: string) => void;
}

export function TimeSlotPicker({ value, onChange }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/availability');
        if (!res.ok) throw new Error('Beschikbaarheid kon niet worden opgehaald');
        const data: TimeSlot[] = await res.json();
        setSlots(data.filter((s) => s.available));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Er ging iets mis bij het ophalen van beschikbare tijden'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const groupedByDate = slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const dateKey = format(parseISO(slot.start), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort();
  const activeDate = selectedDate || dates[0] || null;
  const activeSlots = activeDate ? groupedByDate[activeDate] || [] : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-8 h-8 text-deep-gold animate-spin" />
        <p className="text-text-muted text-sm">Beschikbare tijden ophalen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-deep-gold text-sm underline underline-offset-4 hover:text-soft-gold transition-colors"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (dates.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-champagne/40 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-text-muted" />
        </div>
        <div className="space-y-2">
          <p className="text-text-dark font-serif text-lg">
            Momenteel geen beschikbare tijden
          </p>
          <p className="text-text-muted text-sm max-w-sm mx-auto">
            Neem gerust contact op via e-mail, dan zoeken we samen een geschikt moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-text-dark">
          Kies een moment
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
          Selecteer een datum en tijdstip voor je digitale kennismaking.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => {
            const parsed = parseISO(date);
            const isActive = date === activeDate;
            const dayName = format(parsed, 'EEE', { locale: nl });
            const dayNum = format(parsed, 'd');
            const month = format(parsed, 'MMM', { locale: nl });

            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border transition-all duration-200 min-w-[72px] min-h-[72px]',
                  isActive
                    ? 'border-deep-gold/60 bg-white/90 text-text-dark shadow-[0_2px_12px_rgba(170,122,40,0.1)]'
                    : 'border-border-soft bg-white/70 text-text-muted hover:border-deep-gold/40 hover:bg-white/80'
                )}
              >
                <span className="text-[10px] uppercase tracking-widest font-medium">
                  {dayName}
                </span>
                <span className="text-lg font-serif">{dayNum}</span>
                <span className="text-[10px] uppercase tracking-wide">{month}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDate}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {activeSlots.map((slot) => {
              const start = parseISO(slot.start);
              const end = parseISO(slot.end);
              const isSelected = value === slot.start;
              const timeLabel = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;

              return (
                <motion.button
                  key={slot.start}
                  type="button"
                  onClick={() => onChange(slot.start)}
                  className={cn(
                    'relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-medium min-h-[48px]',
                    isSelected
                      ? 'border-deep-gold bg-white/95 text-text-dark shadow-[0_2px_16px_rgba(170,122,40,0.15)]'
                      : 'border-border-soft bg-white/70 text-text-muted hover:border-deep-gold/40 hover:text-text-dark hover:bg-white/85'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Clock size={14} className={isSelected ? 'text-deep-gold' : 'text-text-muted/60'} />
                  {timeLabel}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {value && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-text-muted text-sm">
              Geselecteerd:{' '}
              <span className="text-deep-gold font-medium">
                {format(parseISO(value), "EEEE d MMMM 'om' HH:mm", { locale: nl })}
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
