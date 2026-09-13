# Data Model

## Funnel state machine
Allowed forward transitions:
- `CAPTURED -> CHECKOUT_REDIRECTED`
- `CAPTURED -> SALE_STARTED`
- `CHECKOUT_REDIRECTED -> SALE_STARTED`
- `SALE_STARTED -> PAYMENT_FAILED`
- `SALE_STARTED -> PURCHASED`
- `PAYMENT_FAILED -> SALE_STARTED`
- `PAYMENT_FAILED -> PURCHASED`
- `PURCHASED -> CANCELLED_REFUNDED`

Rules:
- `PURCHASED` cannot be overwritten by delayed pre-purchase webhooks.
- Repeated same-state events append timeline events but do not repeat downstream communication unless policy explicitly allows it.
- Cancellation/refund is authoritative if received after purchase.

## Suggested SQL shape
```sql
create type lead_status as enum (
  'CAPTURED',
  'CHECKOUT_REDIRECTED',
  'SALE_STARTED',
  'PAYMENT_FAILED',
  'PURCHASED',
  'CANCELLED_REFUNDED'
);

create table leads (
  id uuid primary key,
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
```

Append-only event and webhook tables are specified in the main design.

## PII retention
Define a campaign retention period before production. Keep operationally necessary buyer data only as required by the organizer’s lawful basis and obligations. Delete or anonymize stale non-buyer lead data according to the approved privacy policy.
