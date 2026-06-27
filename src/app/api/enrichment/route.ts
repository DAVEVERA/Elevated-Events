import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { enrichProspect } from '@/lib/services/enrichment-provider';

const enrichmentSchema = z.object({
  lead_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = enrichmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { lead_id } = parsed.data;
    const serviceClient = await createServiceRoleClient();

    const { data: lead, error: leadError } = await serviceClient
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const { data: existing } = await serviceClient
      .from('prospect_enrichments')
      .select('id, status')
      .eq('lead_id', lead_id)
      .in('status', ['pending', 'processing'])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Enrichment already in progress', enrichment_id: existing.id },
        { status: 409 }
      );
    }

    const { data: enrichmentRecord, error: insertError } = await serviceClient
      .from('prospect_enrichments')
      .insert({
        lead_id,
        status: 'processing',
      })
      .select()
      .single();

    if (insertError || !enrichmentRecord) {
      return NextResponse.json(
        { error: 'Failed to create enrichment record', details: insertError?.message },
        { status: 500 }
      );
    }

    await serviceClient
      .from('leads')
      .update({ enrichment_status: 'processing' })
      .eq('id', lead_id);

    processEnrichment(serviceClient, lead, enrichmentRecord.id).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        enrichment_id: enrichmentRecord.id,
        status: 'processing',
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processEnrichment(
  supabase: Awaited<ReturnType<typeof createServiceRoleClient>>,
  lead: Record<string, unknown>,
  enrichmentId: string
) {
  try {
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
      .eq('id', enrichmentId);

    await supabase
      .from('leads')
      .update({ enrichment_status: 'completed' })
      .eq('id', lead.id as string);
  } catch {
    await supabase
      .from('prospect_enrichments')
      .update({ status: 'failed' })
      .eq('id', enrichmentId);

    await supabase
      .from('leads')
      .update({ enrichment_status: 'failed' })
      .eq('id', lead.id as string);
  }
}
