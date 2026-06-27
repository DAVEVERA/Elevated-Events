'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Link2,
  CalendarDays,
  Users,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { EVENT_TYPES } from '@/lib/validations/planner';
import type { PlannerFormValues } from '@/lib/validations/planner';

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  icon: Icon,
}: {
  label: string;
  name: keyof PlannerFormValues;
  type?: string;
  placeholder: string;
  required?: boolean;
  icon: typeof User;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlannerFormValues>();

  const error = errors[name];
  const registerProps = name === 'estimated_guest_count'
    ? register(name, { valueAsNumber: true })
    : register(name);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm text-text-muted">
        {label}
        {required && <span className="text-deep-gold">*</span>}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50"
        />
        <input
          type={type}
          placeholder={placeholder}
          {...registerProps}
          className={cn(
            'w-full pl-10 pr-4 py-3 rounded-xl border bg-white/90 text-text-dark text-sm',
            'placeholder:text-text-muted/40 transition-all duration-200',
            error
              ? 'border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
              : 'border-border-soft focus:border-deep-gold/50 focus:outline-none focus:ring-2 focus:ring-deep-gold/15'
          )}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-xs pl-1"
        >
          {error.message as string}
        </motion.p>
      )}
    </div>
  );
}

export function PlannerForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlannerFormValues>();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-text-dark">
          Vertel over jezelf
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-md mx-auto">
          Zodat Gabriela zich optimaal kan voorbereiden op jullie gesprek.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Naam"
            name="full_name"
            placeholder="Je volledige naam"
            required
            icon={User}
          />
          <FormField
            label="Bedrijf"
            name="company_name"
            placeholder="Bedrijfsnaam"
            required
            icon={Building2}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="E-mail"
            name="email"
            type="email"
            placeholder="naam@bedrijf.nl"
            required
            icon={Mail}
          />
          <FormField
            label="Telefoon"
            name="phone"
            type="tel"
            placeholder="+31 6 12345678"
            required
            icon={Phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Website"
            name="website"
            type="url"
            placeholder="https://bedrijf.nl"
            icon={Globe}
          />
          <FormField
            label="LinkedIn"
            name="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/..."
            icon={Link2}
          />
        </div>

        <div className="h-px bg-border-soft" />

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-text-muted">
            Type evenement
            <span className="text-deep-gold">*</span>
          </label>
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50"
            />
            <select
              {...register('event_type')}
              className={cn(
                'w-full pl-10 pr-10 py-3 rounded-xl border bg-white/90 text-text-dark text-sm appearance-none',
                'transition-all duration-200 cursor-pointer',
                errors.event_type
                  ? 'border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                  : 'border-border-soft focus:border-deep-gold/50 focus:outline-none focus:ring-2 focus:ring-deep-gold/15'
              )}
              defaultValue=""
            >
              <option value="" disabled className="text-text-muted">
                Selecteer het type event
              </option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 pointer-events-none"
            />
          </div>
          {errors.event_type && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-xs pl-1"
            >
              {errors.event_type.message}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Verwachte eventdatum"
            name="estimated_event_date"
            type="date"
            placeholder=""
            icon={CalendarDays}
          />
          <FormField
            label="Verwacht aantal gasten"
            name="estimated_guest_count"
            type="number"
            placeholder="bijv. 150"
            icon={Users}
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-text-muted">
            Bericht
          </label>
          <div className="relative">
            <MessageSquare
              size={16}
              className="absolute left-4 top-3.5 text-text-muted/50"
            />
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Vertel vrijblijvend iets over je event, wensen of vragen"
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-xl border bg-white/90 text-text-dark text-sm resize-none',
                'placeholder:text-text-muted/40 transition-all duration-200',
                'border-border-soft focus:border-deep-gold/50 focus:outline-none focus:ring-2 focus:ring-deep-gold/15'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
