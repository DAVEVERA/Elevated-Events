import { addDays, addMinutes, format, parse, isAfter, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { TimeSlot } from '@/types';

interface AvailabilityConfig {
  slot_duration_minutes: number;
  timezone: string;
  working_hours: { start: string; end: string };
  working_days: number[];
  buffer_minutes: number;
  advance_days: number;
}

const DEFAULT_CONFIG: AvailabilityConfig = {
  slot_duration_minutes: 30,
  timezone: 'Europe/Amsterdam',
  working_hours: { start: '09:00', end: '17:00' },
  working_days: [1, 2, 3, 4, 5],
  buffer_minutes: 15,
  advance_days: 30,
};

export function generateAvailableSlots(
  bookedSlots: { start: string; end: string }[],
  config: Partial<AvailabilityConfig> = {}
): TimeSlot[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const now = new Date();
  const slots: TimeSlot[] = [];

  for (let d = 1; d <= cfg.advance_days; d++) {
    const day = addDays(startOfDay(now), d);
    const dayOfWeek = day.getDay();

    if (!cfg.working_days.includes(dayOfWeek === 0 ? 7 : dayOfWeek)) continue;

    const [startH, startM] = cfg.working_hours.start.split(':').map(Number);
    const [endH, endM] = cfg.working_hours.end.split(':').map(Number);

    let slotStart = setMinutes(setHours(day, startH), startM);
    const dayEnd = setMinutes(setHours(day, endH), endM);

    while (isBefore(addMinutes(slotStart, cfg.slot_duration_minutes), dayEnd) ||
           addMinutes(slotStart, cfg.slot_duration_minutes).getTime() === dayEnd.getTime()) {
      const slotEnd = addMinutes(slotStart, cfg.slot_duration_minutes);

      const isBooked = bookedSlots.some((booked) => {
        const bookedStart = new Date(booked.start);
        const bookedEnd = new Date(booked.end);
        const bufferedStart = addMinutes(bookedStart, -cfg.buffer_minutes);
        const bufferedEnd = addMinutes(bookedEnd, cfg.buffer_minutes);
        return isBefore(slotStart, bufferedEnd) && isAfter(slotEnd, bufferedStart);
      });

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isBooked,
      });

      slotStart = addMinutes(slotStart, cfg.slot_duration_minutes);
    }
  }

  return slots;
}
