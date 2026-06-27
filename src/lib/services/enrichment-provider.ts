import type { EnrichmentProvider } from '@/types';

interface EnrichmentInput {
  companyName?: string;
  website?: string;
  linkedInUrl?: string;
  contactName?: string;
  email?: string;
}

interface EnrichmentResult {
  company_summary: string | null;
  industry: string | null;
  company_size_estimate: string | null;
  location: string | null;
  brand_tone: string | null;
  recent_news: Record<string, unknown>[] | null;
  event_relevance_notes: string | null;
  suggested_sales_angle: string | null;
  possible_event_opportunity: string | null;
  sources: Record<string, unknown>[];
  confidence_score: number;
}

const provider: EnrichmentProvider =
  (process.env.ENRICHMENT_PROVIDER as EnrichmentProvider) || 'mock';

async function mockEnrichment(input: EnrichmentInput): Promise<EnrichmentResult> {
  await new Promise((r) => setTimeout(r, 500));

  const domain = input.website
    ? new URL(input.website.startsWith('http') ? input.website : `https://${input.website}`).hostname
    : input.email?.split('@')[1] || 'unknown';

  return {
    company_summary: input.companyName
      ? `${input.companyName} is een organisatie actief in de zakelijke dienstverlening. Verdere analyse vereist een live enrichment provider.`
      : null,
    industry: 'Zakelijke dienstverlening (geschat)',
    company_size_estimate: '10-50 medewerkers (geschat)',
    location: 'Nederland (geschat)',
    brand_tone: 'Professioneel, zakelijk',
    recent_news: null,
    event_relevance_notes:
      'Potentieel geïnteresseerd in klantendagen, netwerkevents of productlanceringen.',
    suggested_sales_angle:
      'Focus op merkbeleving en professionele uitstraling bij zakelijke bijeenkomsten.',
    possible_event_opportunity:
      'Klantendag of netwerkevent voor relatiebeheer.',
    sources: [{ type: 'mock', domain, timestamp: new Date().toISOString() }],
    confidence_score: 0.3,
  };
}

export async function enrichProspect(
  input: EnrichmentInput
): Promise<EnrichmentResult> {
  switch (provider) {
    case 'firecrawl':
    case 'tavily':
    case 'serpapi':
      return mockEnrichment(input);
    case 'mock':
    default:
      return mockEnrichment(input);
  }
}
