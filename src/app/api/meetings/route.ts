import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { createDigitalMeetingLink } from '@/lib/services/meeting-provider';
import { sendEmail } from '@/lib/services/email-provider';
import { geocodeAddress, calculateTravelTime } from '@/lib/services/geo-provider';
import {
  digitalMeetingConfirmation,
  faceToFaceRequestConfirmation,
  internalNotification,
} from '@/lib/email/templates';
import type { MeetingType } from '@/types';

const GABRIELA_OFFICE_LAT = parseFloat(process.env.GABRIELA_OFFICE_LAT || '52.0907');
const GABRIELA_OFFICE_LNG = parseFloat(process.env.GABRIELA_OFFICE_LNG || '5.1214');

const meetingSchema = z.object({
  lead_id: z.string().uuid(),
  meeting_type: z.enum(['digital', 'face_to_face']),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  timezone: z.string().max(100).optional().default('Europe/Amsterdam'),
  preferred_location: z.string().max(500).optional(),
  preferred_date_windows: z.array(z.string()).max(10).optional(),
  preferred_time_windows: z.array(z.string()).max(10).optional(),
  notes: z.string().max(5000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = meetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createServiceRoleClient();

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://elevated-eventmaker.nl'}/admin/leads/${lead.id}`;

    if (data.meeting_type === 'digital') {
      const meeting = await createDigitalMeetingRecord(supabase, lead, data, adminUrl);
      return NextResponse.json(
        { success: true, meeting_id: meeting?.id ?? null },
        { status: 201 }
      );
    }

    const meeting = await createFaceToFaceMeetingRecord(supabase, lead, data, adminUrl);
    return NextResponse.json(
      { success: true, meeting_id: meeting?.id ?? null },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createDigitalMeetingRecord(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>,
  data: z.infer<typeof meetingSchema>,
  adminUrl: string
) {
  let meetingLink: string | null = null;

  if (data.start_time && data.end_time) {
    meetingLink = await createDigitalMeetingLink({
      title: `Kennismaking: ${lead.full_name as string}`,
      startTime: data.start_time,
      endTime: data.end_time,
      attendeeEmail: lead.email as string,
    });
  }

  const { data: meeting } = await supabase
    .from('meetings')
    .insert({
      lead_id: data.lead_id,
      meeting_type: 'digital' as MeetingType,
      status: 'confirmed',
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      timezone: data.timezone,
      meeting_link: meetingLink,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (meetingLink && data.start_time) {
    const startDate = new Date(data.start_time);
    const confirmationEmail = digitalMeetingConfirmation({
      name: lead.full_name as string,
      date: startDate.toISOString(),
      time: startDate.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Amsterdam',
      }),
      meetingLink,
    });

    await sendEmail({
      to: lead.email as string,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
    });
  }

  const gabrielaEmail = process.env.GABRIELA_EMAIL;
  if (gabrielaEmail) {
    const notification = internalNotification({
      type: 'digital',
      leadName: lead.full_name as string,
      company: (lead.company_name as string) || '',
      email: lead.email as string,
      eventType: (lead.event_type as string) || '',
      meetingLink: meetingLink || undefined,
      enrichmentStatus: (lead.enrichment_status as string) || 'unknown',
      adminUrl,
    });

    await sendEmail({
      to: gabrielaEmail,
      subject: notification.subject,
      html: notification.html,
    });
  }

  return meeting;
}

async function createFaceToFaceMeetingRecord(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>,
  data: z.infer<typeof meetingSchema>,
  adminUrl: string
) {
  let locationLat: number | null = null;
  let locationLng: number | null = null;
  let travelDistanceMeters: number | null = null;
  let travelDurationSeconds: number | null = null;
  let suggestedBufferMinutes: number | null = null;
  let travelTimeDisplay: string | undefined;

  if (data.preferred_location) {
    const coords = await geocodeAddress(data.preferred_location);
    if (coords) {
      locationLat = coords.lat;
      locationLng = coords.lng;

      const travelInfo = await calculateTravelTime(
        GABRIELA_OFFICE_LAT,
        GABRIELA_OFFICE_LNG,
        coords.lat,
        coords.lng
      );

      if (travelInfo) {
        travelDistanceMeters = travelInfo.distance_meters;
        travelDurationSeconds = travelInfo.duration_seconds;
        suggestedBufferMinutes = travelInfo.suggested_buffer_minutes;
        const mins = Math.round(travelInfo.duration_seconds / 60);
        travelTimeDisplay = `~${mins} min (${(travelInfo.distance_meters / 1000).toFixed(1)} km)`;
      }
    }
  }

  const { data: meeting } = await supabase
    .from('meetings')
    .insert({
      lead_id: data.lead_id,
      meeting_type: 'face_to_face' as MeetingType,
      status: 'needs_manual_planning',
      timezone: data.timezone,
      preferred_location: data.preferred_location || null,
      preferred_date_windows: data.preferred_date_windows || null,
      preferred_time_windows: data.preferred_time_windows || null,
      location_lat: locationLat,
      location_lng: locationLng,
      travel_distance_meters: travelDistanceMeters,
      travel_duration_seconds: travelDurationSeconds,
      suggested_buffer_minutes: suggestedBufferMinutes,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (meeting) {
    await supabase.from('tasks').insert({
      lead_id: data.lead_id,
      meeting_id: meeting.id,
      title: `Face-to-face afspraak plannen: ${lead.full_name as string}`,
      description: `Nieuwe face-to-face aanvraag van ${lead.full_name as string}${lead.company_name ? ` (${lead.company_name})` : ''}. Locatie: ${data.preferred_location || 'niet opgegeven'}. Voorkeursdata: ${data.preferred_date_windows?.join(', ') || 'niet opgegeven'}.`,
      priority: 'high',
      status: 'open',
      created_by: 'system',
    });
  }

  const confirmationEmail = faceToFaceRequestConfirmation({
    name: lead.full_name as string,
    location: data.preferred_location || 'Nader te bepalen',
    dateWindows: data.preferred_date_windows || ['Flexibel'],
  });

  await sendEmail({
    to: lead.email as string,
    subject: confirmationEmail.subject,
    html: confirmationEmail.html,
  });

  const gabrielaEmail = process.env.GABRIELA_EMAIL;
  if (gabrielaEmail) {
    const notification = internalNotification({
      type: 'face_to_face',
      leadName: lead.full_name as string,
      company: (lead.company_name as string) || '',
      email: lead.email as string,
      eventType: (lead.event_type as string) || '',
      travelTime: travelTimeDisplay,
      enrichmentStatus: (lead.enrichment_status as string) || 'unknown',
      adminUrl,
    });

    await sendEmail({
      to: gabrielaEmail,
      subject: notification.subject,
      html: notification.html,
    });
  }

  return meeting;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const meetingType = searchParams.get('meeting_type');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') === 'asc' ? true : false;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('meetings')
      .select('*, lead:leads(*)', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (meetingType) {
      query = query.eq('meeting_type', meetingType);
    }

    if (search) {
      query = query.or(
        `lead.full_name.ilike.%${search}%,lead.company_name.ilike.%${search}%,lead.email.ilike.%${search}%`,
        { referencedTable: 'leads' }
      );
    }

    const allowedSortFields = ['created_at', 'updated_at', 'start_time', 'status', 'meeting_type'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';

    query = query.order(sortField, { ascending: order }).range(offset, offset + limit - 1);

    const { data: meetings, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch meetings', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: meetings,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
