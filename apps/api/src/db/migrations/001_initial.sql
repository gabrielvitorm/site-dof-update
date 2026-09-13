create type lead_status as enum (
  'CAPTURED',
  'CHECKOUT_REDIRECTED',
  'SALE_STARTED',
  'PAYMENT_FAILED',
  'PURCHASED',
  'CANCELLED_REFUNDED'
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  email_normalized text not null,
  phone text not null,
  phone_e164 text,
  consent boolean not null,
  status lead_status not null default 'CAPTURED',
  checkout_url text,
  first_utm_source text,
  first_utm_medium text,
  first_utm_campaign text,
  first_utm_content text,
  first_utm_term text,
  last_utm_source text,
  last_utm_medium text,
  last_utm_campaign text,
  last_utm_content text,
  last_utm_term text,
  fbclid text,
  gclid text,
  referrer text,
  landing_url text,
  cta_origin text,
  session_id uuid,
  device_class text,
  even3_registration_code text,
  even3_participant_id text,
  first_captured_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_email_norm on leads(email_normalized);
create index idx_leads_phone_e164 on leads(phone_e164);
create index idx_leads_even3_registration_code on leads(even3_registration_code);

create table lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null,
  source text not null,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_lead_events_lead_id_created_at on lead_events(lead_id, created_at);

create table even3_webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  even3_delivery_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status text not null default 'RECEIVED',
  error_message text
);

create index idx_even3_webhook_deliveries_status on even3_webhook_deliveries(processing_status);

create table automation_dispatches (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  event_type text not null,
  idempotency_key text not null unique,
  payload jsonb not null,
  status text not null default 'PENDING',
  attempt_count integer not null default 0,
  last_attempt_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_automation_dispatches_status on automation_dispatches(status, created_at);

