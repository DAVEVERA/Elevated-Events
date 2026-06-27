'use client';

import { motion } from 'framer-motion';
import { Monitor, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { MeetingType } from '@/types';

interface MeetingTypeSelectorProps {
  value: MeetingType | null;
  onChange: (type: MeetingType) => void;
}

const MEETING_OPTIONS: {
  type: MeetingType;
  icon: typeof Monitor;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    type: 'digital',
    icon: Monitor,
    title: 'Digitale kennismaking',
    description: 'Ontdek in een videocall hoe we jouw event naar een hoger niveau tillen.',
    detail: 'Direct bevestigd met meetinglink',
  },
  {
    type: 'face_to_face',
    icon: Users,
    title: 'Persoonlijke afspraak',
    description: 'Ontmoet Gabriela persoonlijk en bespreek je event in detail.',
    detail: 'Gabriela bevestigt na afstemming',
  },
];

export function MeetingTypeSelector({ value, onChange }: MeetingTypeSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-text-dark">
          Hoe wil je kennismaken?
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Kies de manier die het beste bij je past. Beide opties zijn geheel vrijblijvend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
        {MEETING_OPTIONS.map((option) => {
          const isSelected = value === option.type;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.type}
              type="button"
              onClick={() => onChange(option.type)}
              className={cn(
                'relative group text-left rounded-[30px] p-6 md:p-8 transition-all duration-300 cursor-pointer',
                'border backdrop-blur-sm',
                isSelected
                  ? 'border-deep-gold/60 bg-white/90 shadow-[0_4px_40px_rgba(170,122,40,0.12)]'
                  : 'border-border-soft bg-white/80 hover:border-deep-gold/40 hover:bg-white/90 hover:shadow-[0_2px_20px_rgba(170,122,40,0.08)]'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-[30px] border-2 border-deep-gold/50"
                  layoutId="meeting-type-ring"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative space-y-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300',
                    isSelected
                      ? 'bg-deep-gold/15 text-deep-gold'
                      : 'bg-champagne/40 text-text-muted group-hover:text-deep-gold'
                  )}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                  <h3
                    className={cn(
                      'font-serif text-xl md:text-2xl transition-colors duration-300',
                      isSelected ? 'text-text-dark' : 'text-text-dark'
                    )}
                  >
                    {option.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div
                  className={cn(
                    'inline-flex items-center gap-2 text-xs font-medium tracking-wide px-3 py-1.5 rounded-full transition-colors duration-300',
                    isSelected
                      ? 'bg-deep-gold/10 text-deep-gold'
                      : 'bg-champagne/30 text-text-muted'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-deep-gold' : 'bg-text-muted/40'
                    )}
                  />
                  {option.detail}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
