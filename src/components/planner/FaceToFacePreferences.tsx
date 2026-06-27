'use client';

import { motion } from 'framer-motion';
import { format, addDays, startOfDay } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MapPin, Sun, Sunset, Moon, CalendarDays, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FaceToFacePreferencesProps {
  selectedDates: string[];
  selectedTimeWindows: string[];
  location: string;
  onDatesChange: (dates: string[]) => void;
  onTimeWindowsChange: (windows: string[]) => void;
  onLocationChange: (location: string) => void;
}

const TIME_WINDOWS = [
  { id: 'ochtend', label: 'Ochtend', sublabel: '09:00 - 12:00', icon: Sun },
  { id: 'middag', label: 'Middag', sublabel: '12:00 - 17:00', icon: Sunset },
  { id: 'avond', label: 'Avond', sublabel: '17:00 - 20:00', icon: Moon },
] as const;

export function FaceToFacePreferences({
  selectedDates,
  selectedTimeWindows,
  location,
  onDatesChange,
  onTimeWindowsChange,
  onLocationChange,
}: FaceToFacePreferencesProps) {
  const today = startOfDay(new Date());
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(today, i + 2));

  const toggleDate = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      onDatesChange(selectedDates.filter((d) => d !== dateStr));
    } else {
      onDatesChange([...selectedDates, dateStr]);
    }
  };

  const toggleTimeWindow = (windowId: string) => {
    if (selectedTimeWindows.includes(windowId)) {
      onTimeWindowsChange(selectedTimeWindows.filter((w) => w !== windowId));
    } else {
      onTimeWindowsChange([...selectedTimeWindows, windowId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-text-dark">
          Wanneer en waar?
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
          Geef je voorkeur aan. Gabriela stemt persoonlijk af en komt bij je terug.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-text-dark">
            <CalendarDays size={16} className="text-deep-gold" />
            <h3 className="font-serif text-lg">Voorkeursdagen</h3>
            <span className="text-text-muted text-xs ml-auto">Selecteer een of meerdere</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {dateOptions.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isSelected = selectedDates.includes(dateStr);
              const dayName = format(date, 'EEE', { locale: nl });
              const dayNum = format(date, 'd');
              const month = format(date, 'MMM', { locale: nl });

              return (
                <motion.button
                  key={dateStr}
                  type="button"
                  onClick={() => toggleDate(dateStr)}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border transition-all duration-200 min-h-[72px]',
                    isSelected
                      ? 'border-deep-gold/60 bg-white/90 text-text-dark shadow-[0_2px_12px_rgba(170,122,40,0.1)]'
                      : 'border-border-soft bg-white/70 text-text-muted hover:border-deep-gold/40 hover:bg-white/80'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-deep-gold flex items-center justify-center"
                    >
                      <Check size={10} className="text-white" />
                    </motion.div>
                  )}
                  <span className="text-[10px] uppercase tracking-widest font-medium">
                    {dayName}
                  </span>
                  <span className="text-lg font-serif">{dayNum}</span>
                  <span className="text-[10px] uppercase tracking-wide">{month}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-text-dark">
            <Sun size={16} className="text-deep-gold" />
            <h3 className="font-serif text-lg">Voorkeursmoment</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TIME_WINDOWS.map((window) => {
              const isSelected = selectedTimeWindows.includes(window.id);
              const Icon = window.icon;

              return (
                <motion.button
                  key={window.id}
                  type="button"
                  onClick={() => toggleTimeWindow(window.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-200 min-h-[88px]',
                    isSelected
                      ? 'border-deep-gold/60 bg-white/90 text-text-dark shadow-[0_2px_12px_rgba(170,122,40,0.1)]'
                      : 'border-border-soft bg-white/70 text-text-muted hover:border-deep-gold/40 hover:bg-white/80'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'transition-colors',
                      isSelected ? 'text-deep-gold' : 'text-text-muted/60'
                    )}
                  />
                  <span className="text-sm font-medium">{window.label}</span>
                  <span className="text-[11px] text-text-muted">{window.sublabel}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-text-dark">
            <MapPin size={16} className="text-deep-gold" />
            <h3 className="font-serif text-lg">Locatie</h3>
          </div>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Adres of plaatsnaam"
              className={cn(
                'w-full pl-10 pr-4 py-3.5 rounded-xl border bg-white/90 text-text-dark text-sm',
                'placeholder:text-text-muted/50 transition-all duration-200',
                'border-border-soft focus:border-deep-gold/50 focus:outline-none focus:ring-2 focus:ring-deep-gold/15'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
