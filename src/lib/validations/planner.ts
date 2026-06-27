import { z } from 'zod';

export const EVENT_TYPES = [
  'Klantendag',
  'Lancering',
  'Netwerkevent',
  'Seminar',
  'Anders',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const optionalUrl = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.union([
      z.literal(''),
      z.string().url('Dat lijkt geen geldige URL te zijn'),
    ])
  );

const optionalLinkedInUrl = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.union([
      z.literal(''),
      z.string().url('Dat lijkt geen geldige LinkedIn URL te zijn'),
    ])
  );

export const plannerSchema = z.object({
  meeting_type: z.enum(['digital', 'face_to_face']),
  full_name: z
    .string()
    .min(2, 'Vul je volledige naam in (minimaal 2 tekens)'),
  company_name: z
    .string()
    .min(1, 'Vul je bedrijfsnaam in'),
  email: z
    .string()
    .min(1, 'Vul je e-mailadres in')
    .email('Dat lijkt geen geldig e-mailadres te zijn'),
  phone: z
    .string()
    .min(1, 'Vul je telefoonnummer in')
    .regex(
      /^[+]?[\d\s\-()]{7,20}$/,
      'Vul een geldig telefoonnummer in'
    ),
  website: optionalUrl,
  linkedin_url: optionalLinkedInUrl,
  event_type: z.enum(EVENT_TYPES, {
    message: 'Kies een type evenement',
  }),
  estimated_event_date: z.string(),
  estimated_guest_count: z
    .number()
    .int()
    .positive('Vul een geldig aantal gasten in')
    .optional(),
  message: z.string(),
  selected_slot: z.string().optional(),
  preferred_location: z.string().optional(),
  preferred_date_windows: z.array(z.string()).optional(),
  preferred_time_windows: z.array(z.string()).optional(),
});

export type PlannerFormValues = z.infer<typeof plannerSchema>;
