import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateAvailableSlots } from '@/lib/services/availability';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get('timezone') || 'Europe/Amsterdam';
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '30', 10)));
    const duration = Math.min(120, Math.max(15, parseInt(searchParams.get('duration') || '30', 10)));

    const supabase = await createServiceRoleClient();

    const now = new Date().toISOString();
    const { data: bookedMeetings, error } = await supabase
      .from('meetings')
      .select('start_time, end_time')
      .in('status', ['confirmed', 'needs_manual_planning'])
      .not('start_time', 'is', null)
      .not('end_time', 'is', null)
      .gte('end_time', now);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch availability', details: error.message },
        { status: 500 }
      );
    }

    const bookedSlots = (bookedMeetings || [])
      .filter(
        (m): m is { start_time: string; end_time: string } =>
          m.start_time !== null && m.end_time !== null
      )
      .map((m) => ({ start: m.start_time, end: m.end_time }));

    const slots = generateAvailableSlots(bookedSlots, {
      timezone,
      advance_days: days,
      slot_duration_minutes: duration,
    });

    const availableOnly = searchParams.get('available_only') === 'true';
    const result = availableOnly ? slots.filter((s) => s.available) : slots;

    return NextResponse.json({
      data: result,
      meta: {
        timezone,
        duration_minutes: duration,
        advance_days: days,
        total_slots: result.length,
        available_slots: result.filter((s) => s.available).length,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
