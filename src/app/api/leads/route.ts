import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/services/email-provider';
import { createDigitalMeetingLink } from '@/lib/services/meeting-provider';
import { enrichProspect } from '@/lib/services/enrichment-provider';
import { geocodeAddress, calculateTravelTime } from '@/lib/services/geo-provider';
import {
  digitalMeetingConfirmation,
  faceToFaceRequestConfirmation,
  internalNotification,
} from '@/lib/email/templates';
import type { MeetingType } from '@/types';

const GABRIELA_OFFICE_LAT = parseFloat(process.env.GABRIELA_OFFICE_LAT || '52.0907');
const GABRIELA_OFFICE_LNG = parseFloat(process.env.GABRIELA_OFFICE_LNG || '5.1214');

const leadSchema = z.object({
  meeting_type: z.enum(['digital', 'face_to_face']),
  full_name: z.string().min(2).max(200),
  company_name: z.string().max(200).optional().default(''),
  email: z.email(),
  phone: z.string().max(30).optional().default(''),
  website: z.string().max(500).optional().default(''),
  linkedin_url: z.string().max(500).optional().default(''),
  event_type: z.string().max(200).optional().default(''),
  estimated_event_date: z.string().max(100).optional().default(''),
  estimated_guest_count: z.number().int().min(0).max(100000).optional(),
  message: z.string().max(5000).optional().default(''),
  selected_slot: z.string().optional(),
  preferred_location: z.string().max(500).optional(),
  preferred_date_windows: z.array(z.string()).max(10).optional(),
  preferred_time_windows: z.array(z.string()).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

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
      .insert({
        full_name: data.full_name,
        company_name: data.company_name || null,
        email: data.email,
        phone: data.phone || null,
        website: data.website || null,
        linkedin_url: data.linkedin_url || null,
        event_type: data.event_type || null,
        estimated_event_date: data.estimated_event_date || null,
        estimated_guest_count: data.estimated_guest_count ?? null,
        message: data.message || null,
        status: 'new',
        enrichment_status: 'pending',
      })
      .select()
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Failed to create lead', details: leadError?.message },
        { status: 500 }
      );
    }

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://elevated-eventmaker.nl'}/admin/leads/${lead.id}`;

    if (data.meeting_type === 'digital') {
      await handleDigitalMeeting(supabase, lead, data, adminUrl);
    } else {
      await handleFaceToFaceMeeting(supabase, lead, data, adminUrl);
    }

    triggerEnrichment(supabase, lead).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        lead_id: lead.id,
        meeting_type: data.meeting_type,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleDigitalMeeting(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>,
  data: z.infer<typeof leadSchema>,
  adminUrl: string
) {
  let startTime: string | null = null;
  let endTime: string | null = null;
  let meetingLink: string | null = null;

  if (data.selected_slot) {
    startTime = data.selected_slot;
    const slotEnd = new Date(new Date(data.selected_slot).getTime() + 30 * 60000);
    endTime = slotEnd.toISOString();

    meetingLink = await createDigitalMeetingLink({
      title: `Kennismaking: ${lead.full_name as string}`,
      startTime,
      endTime,
      attendeeEmail: data.email,
    });
  }

  const { data: meeting } = await supabase
    .from('meetings')
    .insert({
      lead_id: lead.id as string,
      meeting_type: 'digital' as MeetingType,
      status: 'confirmed',
      start_time: startTime,
      end_time: endTime,
      timezone: 'Europe/Amsterdam',
      meeting_link: meetingLink,
    })
    .select()
    .single();

  if (meetingLink && startTime) {
    const startDate = new Date(startTime);
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
      to: data.email,
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
      email: data.email,
      eventType: data.event_type || '',
      meetingLink: meetingLink || undefined,
      enrichmentStatus: 'pending',
      adminUrl,
    });

    await sendEmail({
      to: gabrielaEmail,
      subject: notification.subject,
      html: notification.html,
    });
  }
}

async function handleFaceToFaceMeeting(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>,
  data: z.infer<typeof leadSchema>,
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
      lead_id: lead.id as string,
      meeting_type: 'face_to_face' as MeetingType,
      status: 'needs_manual_planning',
      timezone: 'Europe/Amsterdam',
      preferred_location: data.preferred_location || null,
      preferred_date_windows: data.preferred_date_windows || null,
      preferred_time_windows: data.preferred_time_windows || null,
      location_lat: locationLat,
      location_lng: locationLng,
      travel_distance_meters: travelDistanceMeters,
      travel_duration_seconds: travelDurationSeconds,
      suggested_buffer_minutes: suggestedBufferMinutes,
    })
    .select()
    .single();

  if (meeting) {
    await supabase.from('tasks').insert({
      lead_id: lead.id as string,
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
    to: data.email,
    subject: confirmationEmail.subject,
    html: confirmationEmail.html,
  });

  const gabrielaEmail = process.env.GABRIELA_EMAIL;
  if (gabrielaEmail) {
    const notification = internalNotification({
      type: 'face_to_face',
      leadName: lead.full_name as string,
      company: (lead.company_name as string) || '',
      email: data.email,
      eventType: data.event_type || '',
      travelTime: travelTimeDisplay,
      enrichmentStatus: 'pending',
      adminUrl,
    });

    await sendEmail({
      to: gabrielaEmail,
      subject: notification.subject,
      html: notification.html,
    });
  }
}

async function triggerEnrichment(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>
) {
  try {
    await supabase.from('prospect_enrichments').insert({
      lead_id: lead.id as string,
      status: 'pending',
    });

    const result = await enrichProspect({
      companyName: (lead.company_name as string) || undefined,
      website: (lead.website as string) || undefined,
      linkedInUrl: (lead.linkedin_url as string) || undefined,
      contactName: lead.full_name as string,
      email: lead.email as string,
    });

    await supabase
      .from('prospect_enrichments')
      .update({
        status: 'completed',
        company_summary: result.company_summary,
        industry: result.industry,
        company_size_estimate: result.company_size_estimate,
        location: result.location,
        brand_tone: result.brand_tone,
        recent_news: result.recent_news,
        event_relevance_notes: result.event_relevance_notes,
        suggested_sales_angle: result.suggested_sales_angle,
        possible_event_opportunity: result.possible_event_opportunity,
        sources: result.sources,
        confidence_score: result.confidence_score,
      })
      .eq('lead_id', lead.id as string);

    await supabase
      .from('leads')
      .update({ enrichment_status: 'completed' })
      .eq('id', lead.id as string);
  } catch {
    await supabase
      .from('leads')
      .update({ enrichment_status: 'failed' })
      .eq('id', lead.id as string);

    await supabase
      .from('prospect_enrichments')
      .update({ status: 'failed' })
      .eq('lead_id', lead.id as string);
  }
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
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') === 'asc' ? true : false;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const allowedSortFields = ['created_at', 'updated_at', 'full_name', 'company_name', 'status'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';

    query = query.order(sortField, { ascending: order }).range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch leads', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: leads,
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
