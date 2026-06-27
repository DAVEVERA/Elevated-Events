-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Admins can read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Admins can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text not null,
  phone text,
  website text,
  linkedin_url text,
  event_type text,
  estimated_event_date date,
  estimated_guest_count int,
  message text,
  status text default 'new',
  enrichment_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Public can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

-- Meetings
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  meeting_type text not null check (meeting_type in ('digital', 'face_to_face')),
  status text not null default 'requested',
  start_time timestamptz,
  end_time timestamptz,
  timezone text default 'Europe/Amsterdam',
  meeting_link text,
  preferred_date_windows jsonb,
  preferred_time_windows jsonb,
  preferred_location text,
  location_lat numeric,
  location_lng numeric,
  travel_distance_meters int,
  travel_duration_seconds int,
  suggested_buffer_minutes int,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meetings enable row level security;

create policy "Public can insert meetings"
  on public.meetings for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated can read meetings"
  on public.meetings for select
  to authenticated
  using (true);

create policy "Authenticated can update meetings"
  on public.meetings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete meetings"
  on public.meetings for delete
  to authenticated
  using (true);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text default 'open' check (status in ('open', 'in_progress', 'done', 'archived')),
  due_at timestamptz,
  created_by text default 'system',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Authenticated can read tasks"
  on public.tasks for select
  to authenticated
  using (true);

create policy "Authenticated can insert tasks"
  on public.tasks for insert
  to authenticated
  with check (true);

create policy "Authenticated can update tasks"
  on public.tasks for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete tasks"
  on public.tasks for delete
  to authenticated
  using (true);

-- Prospect Enrichments
create table if not exists public.prospect_enrichments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  status text default 'pending',
  company_summary text,
  industry text,
  company_size_estimate text,
  location text,
  brand_tone text,
  recent_news jsonb,
  event_relevance_notes text,
  suggested_sales_angle text,
  possible_event_opportunity text,
  sources jsonb,
  confidence_score numeric,
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.prospect_enrichments enable row level security;

create policy "Authenticated can read enrichments"
  on public.prospect_enrichments for select
  to authenticated
  using (true);

create policy "Authenticated can insert enrichments"
  on public.prospect_enrichments for insert
  to authenticated
  with check (true);

create policy "Authenticated can update enrichments"
  on public.prospect_enrichments for update
  to authenticated
  using (true)
  with check (true);

-- Email Logs
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  recipient text,
  subject text,
  body text,
  provider text,
  provider_message_id text,
  status text,
  created_at timestamptz default now()
);

alter table public.email_logs enable row level security;

create policy "Authenticated can read email logs"
  on public.email_logs for select
  to authenticated
  using (true);

create policy "Authenticated can insert email logs"
  on public.email_logs for insert
  to authenticated
  with check (true);

-- Settings
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.settings enable row level security;

create policy "Authenticated can read settings"
  on public.settings for select
  to authenticated
  using (true);

create policy "Authenticated can update settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);

-- Indexes
create index idx_leads_status on public.leads(status);
create index idx_leads_email on public.leads(email);
create index idx_leads_created_at on public.leads(created_at desc);
create index idx_meetings_lead_id on public.meetings(lead_id);
create index idx_meetings_status on public.meetings(status);
create index idx_meetings_start_time on public.meetings(start_time);
create index idx_tasks_lead_id on public.tasks(lead_id);
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_priority on public.tasks(priority);
create index idx_enrichments_lead_id on public.prospect_enrichments(lead_id);
create index idx_email_logs_lead_id on public.email_logs(lead_id);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_leads
  before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_meetings
  before update on public.meetings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_tasks
  before update on public.tasks
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_enrichments
  before update on public.prospect_enrichments
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_settings
  before update on public.settings
  for each row execute function public.handle_updated_at();

-- Default settings
insert into public.settings (key, value) values
  ('availability', '{
    "slot_duration_minutes": 30,
    "timezone": "Europe/Amsterdam",
    "working_hours": {"start": "09:00", "end": "17:00"},
    "working_days": [1, 2, 3, 4, 5],
    "buffer_minutes": 15,
    "advance_days": 30
  }'::jsonb),
  ('base_address', '{"address": "Amsterdam, Netherlands", "lat": 52.3676, "lng": 4.9041}'::jsonb)
on conflict (key) do nothing;
