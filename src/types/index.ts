export type MeetingType = 'digital' | 'face_to_face';

export type MeetingStatus =
  | 'requested'
  | 'confirmed'
  | 'needs_manual_planning'
  | 'cancelled'
  | 'completed';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type EnrichmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TaskStatus = 'open' | 'in_progress' | 'done' | 'archived';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type MeetingProvider = 'google_meet' | 'zoom' | 'whereby' | 'manual';

export type EnrichmentProvider = 'mock' | 'firecrawl' | 'tavily' | 'serpapi';

export interface Lead {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
  event_type: string | null;
  estimated_event_date: string | null;
  estimated_guest_count: number | null;
  message: string | null;
  status: LeadStatus;
  enrichment_status: EnrichmentStatus;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  lead_id: string;
  meeting_type: MeetingType;
  status: MeetingStatus;
  start_time: string | null;
  end_time: string | null;
  timezone: string;
  meeting_link: string | null;
  preferred_date_windows: string[] | null;
  preferred_time_windows: string[] | null;
  preferred_location: string | null;
  location_lat: number | null;
  location_lng: number | null;
  travel_distance_meters: number | null;
  travel_duration_seconds: number | null;
  suggested_buffer_minutes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
}

export interface Task {
  id: string;
  lead_id: string | null;
  meeting_id: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_at: string | null;
  created_by: 'system' | 'manual';
  created_at: string;
  updated_at: string;
  lead?: Lead;
  meeting?: Meeting;
}

export interface ProspectEnrichment {
  id: string;
  lead_id: string;
  status: EnrichmentStatus;
  company_summary: string | null;
  industry: string | null;
  company_size_estimate: string | null;
  location: string | null;
  brand_tone: string | null;
  recent_news: Record<string, unknown>[] | null;
  event_relevance_notes: string | null;
  suggested_sales_angle: string | null;
  possible_event_opportunity: string | null;
  sources: Record<string, unknown>[] | null;
  confidence_score: number | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  lead_id: string | null;
  meeting_id: string | null;
  recipient: string;
  subject: string;
  body: string;
  provider: string | null;
  provider_message_id: string | null;
  status: string;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PlannerFormData {
  meeting_type: MeetingType;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  website: string;
  linkedin_url: string;
  event_type: string;
  estimated_event_date: string;
  estimated_guest_count: number;
  message: string;
  selected_slot?: string;
  preferred_location?: string;
  preferred_date_windows?: string[];
  preferred_time_windows?: string[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface TravelInfo {
  distance_meters: number;
  duration_seconds: number;
  suggested_buffer_minutes: number;
}
