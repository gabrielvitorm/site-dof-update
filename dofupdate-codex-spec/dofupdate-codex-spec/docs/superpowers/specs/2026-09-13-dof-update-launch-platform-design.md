# DOF Update 2026 — Launch Platform Design Specification

**Status:** Approved baseline for implementation  
**Date:** 2026-09-13  
**Event:** DOF Update 2026 — III Imersão Interprofissional em DTM e Dores Orofaciais

## 1. Product objective
Create the official sales landing page and conversion layer for DOF Update 2026. The site must educate multiple health-professional audiences, present the scientific value of the event, capture high-intent leads immediately before checkout, preserve paid-media attribution, redirect to Even3 with minimum friction, reconcile purchase status and support follow-up through n8n and WhatsApp.

The system is a marketing and orchestration layer above Even3. Even3 remains the system of record for registration and payment.

## 2. Event facts used by the product
- Event main date: 03/10/2026.
- Main-event time: 07:30–18:45.
- Main location: Auditório da FAESA, Vitória/ES.
- Pre-event workshop: 02/10/2026, 18:30–20:30.
- Format: 100% presencial.
- No online broadcast and no event recording for participants.
- Main themes: DTM, dores orofaciais, sono, neurofisiologia, farmacologia, treatments and interprofessional care.
- Audiences: dentistry, physiotherapy, speech therapy/audiology, medicine, students/professionals in formation and adjacent health professionals.
- Current displayed price: R$ 320.
- Current commercial phase: Último lote.
- Workshop registration is separate and requires main-event registration.
- Group conditions: 10% for groups of 5 and 15% for groups of 10, through the organization’s specific process.

## 3. Core positioning
Primary promise:

> Uma imersão interprofissional para transformar evidência científica em decisões clínicas mais seguras.

Tone:
- scientific;
- premium;
- informative;
- clinically relevant;
- credible rather than aggressive;
- urgency based on truthful last-lot/event-date context, not fake scarcity.

## 4. Primary funnel
1. User arrives from ad, organic social, direct, referral or search.
2. Landing page captures attribution in the browser.
3. User consumes content and clicks any sales CTA.
4. A mini-capture modal opens.
5. User submits name, WhatsApp, email and consent.
6. Backend validates and upserts the lead, records attribution and CTA origin.
7. Frontend receives the active checkout URL.
8. Browser fires lead / begin-checkout analytics events.
9. User is redirected to Even3.
10. Even3 emits sale/registration webhooks.
11. Backend validates, deduplicates and updates funnel state.
12. Backend dispatches normalized internal events to n8n.
13. n8n handles follow-up or buyer communication based on status.

## 5. Fallback principle
The lead-capture layer must improve conversion intelligence without becoming a single point of failure.

If the lead API fails after a valid form submission:
- show a short non-technical message;
- try one safe retry if appropriate;
- allow the user to continue to a known-safe checkout fallback URL;
- record client-side failure analytics when possible;
- never trap the user indefinitely in the modal.

## 6. Landing page information architecture
Recommended order:
1. Hero / last lot / date / place / primary CTA.
2. Why participate.
3. Who the event is for.
4. Scientific pillars / what the participant will find.
5. Program.
6. Speakers.
7. What makes DOF Update different.
8. Pre-event workshop.
9. Main offer / last lot / R$ 320.
10. Group registration conditions.
11. Location section with embedded map, full address, route CTA and guidance for visitors from other cities.
12. FAQ.
13. Final CTA.
14. Footer: privacy, contact, event rules and organization.

### Content placeholders
Until definitive information arrives, speaker/program fields must use structured placeholder data. Never invent credentials or sessions.

## 7. CTA behavior
Every purchase CTA calls the same `openCheckoutCapture({ ctaOrigin })` behavior.

Examples of `cta_origin`:
- `hero`
- `why_participate`
- `audience`
- `program`
- `speakers`
- `experience`
- `workshop_cross_sell`
- `offer`
- `location`
- `faq`
- `final`
- `sticky_mobile`

The CTA must not link directly to checkout unless fallback mode is active.

## 8. Mini-capture modal
Fields:
- `name`: required, 2–100 chars.
- `phone`: required, Brazilian-friendly input, normalized server-side to E.164 where possible.
- `email`: required, normalized lowercase.
- `consent`: required boolean.

Supporting copy:
- title: `Você está a um passo de garantir sua vaga`;
- action: `Continuar para inscrição`;
- legal: data will be used for registration/event-related communications; full privacy link available.

Accessibility:
- dialog semantics;
- focus trap;
- ESC close;
- visible focus;
- field labels independent of placeholder text;
- error summary/inline errors;
- submit loading state.

## 9. Attribution payload
Persist when available:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`
- `gclid`
- `referrer`
- `landing_url`
- `cta_origin`
- `session_id`
- `created_at`
- coarse `device_class` (`mobile`, `tablet`, `desktop`)

Do not implement invasive fingerprinting.

## 10. Frontend architecture
Technology:
- React;
- Vite;
- TypeScript strict;
- React Router only if needed for legal/thank-you routes;
- CSS strategy may use Tailwind or CSS Modules, but pick one and remain consistent.

Recommended domains:
- `src/content/`: event copy and structured content.
- `src/features/checkout/`: CTA and modal behavior.
- `src/features/attribution/`: UTM/click-id capture.
- `src/features/analytics/`: event abstraction.
- `src/components/`: reusable visual components.
- `src/sections/`: landing sections.
- `src/lib/api/`: typed backend client.

## 11. Backend architecture
Technology:
- Node.js;
- Fastify;
- TypeScript strict;
- Zod or equivalent schema validation;
- PostgreSQL;
- migrations managed by a deterministic migration tool.

Primary routes:
- `GET /health`
- `GET /api/config/public`
- `POST /api/leads`
- `POST /webhooks/even3/:secret`

Backend responsibilities:
- validate and normalize leads;
- persist attribution;
- return active checkout URL;
- receive Even3 webhooks;
- deduplicate webhook deliveries;
- correlate participant/sale with existing leads;
- update lead funnel state;
- dispatch normalized internal automation events;
- provide health and operational logs.

## 12. Lead statuses
Recommended funnel states:
- `CAPTURED`
- `CHECKOUT_REDIRECTED`
- `SALE_STARTED`
- `PAYMENT_FAILED`
- `PURCHASED`
- `CANCELLED_REFUNDED`

Do not infer `PURCHASED` from a browser return page. Only authoritative server-side Even3 confirmation can set it.

## 13. Database model
Minimum tables:

### leads
- `id uuid pk`
- `name text`
- `email text`
- `email_normalized text`
- `phone text`
- `phone_e164 text nullable`
- `consent boolean`
- `status text`
- `checkout_url text`
- attribution fields
- `first_captured_at timestamptz`
- `last_activity_at timestamptz`
- `purchased_at timestamptz nullable`
- `created_at`, `updated_at`

### lead_events
Append-only business timeline:
- `id uuid pk`
- `lead_id uuid fk`
- `type text`
- `source text`
- `payload jsonb`
- `occurred_at timestamptz`
- `created_at timestamptz`

### even3_webhook_deliveries
- `even3_delivery_id text unique`
- `event_type text`
- `payload jsonb`
- `received_at timestamptz`
- `processed_at timestamptz nullable`
- `processing_status text`
- `error_message text nullable`

### automation_dispatches
- `id uuid pk`
- `lead_id uuid nullable`
- `event_type text`
- `idempotency_key text unique`
- `payload jsonb`
- `status text`
- `attempt_count int`
- `last_attempt_at timestamptz nullable`
- `created_at timestamptz`

## 14. Lead upsert rules
Primary match:
1. normalized email exact match;
2. if no email match, normalized E.164 phone exact match.

On repeat capture:
- keep `first_captured_at` unchanged;
- update latest profile fields if valid;
- update `last_activity_at`;
- append a `LEAD_CAPTURED` event;
- preserve both first-touch and last-touch attribution if schema supports it;
- do not downgrade a `PURCHASED` lead back to pre-purchase status.

## 15. Even3 integration
Use Even3’s direct payment link for the active ticket when available. Even3 documentation states that a payment link can be generated per registration entry; use the list-of-entries link only when the user must choose among multiple entries.

Process webhook categories needed for MVP:
- Venda iniciada;
- Venda aprovada;
- Venda reprovada;
- Venda cancelada/reembolsada;
- Participante com inscrição pendente no evento;
- Participante com inscrição confirmada no evento;
- Participante com inscrição cancelada no evento.

Even3 documents a unique identifier for each webhook dispatch. Store it and enforce uniqueness so retries are idempotent.

Correlation:
- prefer the ticket/registration code present across related webhook types when available;
- otherwise correlate by normalized email, then phone;
- ambiguous matches must not silently overwrite the wrong person.

Response strategy:
- validate URL secret;
- validate payload shape and expected event type;
- persist delivery;
- return a 2xx quickly after safe persistence;
- process downstream work separately where possible.

Even3 currently documents retry behavior after unsuccessful delivery. Backend reliability is therefore important, but idempotency is mandatory because retries can occur.

## 16. n8n contract
Backend sends normalized internal events to a protected n8n webhook or queue-like endpoint.

Event envelope:
```json
{
  "eventId": "uuid",
  "eventType": "lead.captured",
  "occurredAt": "2026-09-13T22:00:00Z",
  "lead": {
    "id": "uuid",
    "name": "Nome",
    "email": "email@example.com",
    "phone": "+5527999999999",
    "status": "CAPTURED"
  },
  "attribution": {
    "utmSource": "meta",
    "utmCampaign": "last_lot",
    "ctaOrigin": "hero"
  }
}
```

MVP internal event types:
- `lead.captured`
- `checkout.redirected`
- `sale.started`
- `sale.failed`
- `sale.approved`
- `sale.cancelled`

## 17. WhatsApp automation principles
- WhatsApp is support/recovery, not a prerequisite for checkout.
- `sale.approved` must cancel pending recovery flows.
- Recovery should be status-aware and idempotent.
- Avoid excessive messaging.
- All templates/messages must be approved by the business before production.
- Provider credentials and API keys remain only in backend/n8n secret storage.

## 18. Analytics plan
Browser events:
- `page_view`
- `view_content`
- `cta_click`
- `lead_form_open`
- `lead_form_submit`
- `lead`
- `begin_checkout`
- `checkout_redirect_failed`
- FAQ and map interactions as secondary events.

Server-side:
- `purchase` after authoritative `Venda aprovada` or equivalent confirmed state.

Platforms:
- GA4;
- Meta Pixel;
- Meta Conversions API is recommended for purchase if credentials and business configuration are available.

Never fire `purchase` on mere redirect or thank-you-page load.

## 19. Security and privacy
- HTTPS only.
- Secrets in environment variables or secret manager.
- No sensitive secret in Vite-exposed variables.
- Rate limit lead and webhook endpoints.
- Validation and maximum lengths on every input.
- n8n must not be directly exposed to browser requests.
- Mask PII in logs.
- Store raw Even3 payload only in restricted DB fields and retention policy.
- Provide privacy notice and consent wording.
- Provide data deletion/retention process for campaign data.
- Optional Turnstile/honeypot only if abuse appears; do not add friction by default.

## 20. VPS deployment
Docker Compose services:
- `web` or static build served by Nginx;
- `api`;
- `postgres`;
- optionally `n8n` if hosted on same VPS, preferably isolated with its own credentials and volumes.

Nginx:
- TLS termination;
- HTTP -> HTTPS redirect;
- `/api/*` -> backend;
- `/webhooks/*` -> backend;
- static site and compression/caching;
- request-size limits.

Operational requirements:
- `/health` endpoint;
- daily PostgreSQL backup;
- monitored certificate expiry;
- 4xx/5xx logs;
- webhook processing failure alert;
- documented rollback to previous container image.

## 21. Performance, SEO and accessibility
- Mobile-first Core Web Vitals.
- Optimize images to WebP/AVIF.
- Lazy-load map and below-the-fold media.
- Semantic headings.
- Event structured data when final details are confirmed.
- Open Graph metadata.
- Correct title/description.
- WCAG-minded color contrast and keyboard behavior.
- No autoplay heavy media.

## 22. Public configuration
`GET /api/config/public` returns only safe public values:
```json
{
  "eventPrice": 320,
  "salesPhase": "Último lote",
  "checkoutUrl": "https://...",
  "groupFormUrl": "https://forms.gle/...",
  "mapsUrl": "https://maps.google.com/...",
  "salesEnabled": true
}
```

If public configuration adds too much scope for first release, these values may be build-time public environment variables except secrets. The checkout fallback URL must still be available client-side for failure mode.

## 23. Acceptance criteria
- Landing works on current Chrome/Safari/Firefox/Edge desktop and mobile sizes.
- All purchase CTAs open the same modal and record correct `cta_origin`.
- Form requires valid name, phone, email and consent.
- Attribution survives navigation and is posted with lead.
- Valid lead submission redirects to the active Even3 checkout.
- Backend failure does not permanently block purchase.
- Even3 webhook retry does not duplicate business state or messages.
- `Venda aprovada` leads to `PURCHASED`.
- Purchased leads are suppressed from recovery.
- GA4/Meta receive funnel events; purchase is server-authoritative.
- Embedded map, route button, group link and workshop information work.
- HTTPS, healthcheck, backup and rollback are documented and tested.

## 24. Out of scope for MVP
- Native checkout.
- User login.
- Admin dashboard.
- Speaker CMS.
- Dynamic ticket inventory engine.
- Complex CRM UI.
- Multi-event platform.

## 25. Open inputs to replace before production
These are data dependencies, not implementation uncertainty:
- final speaker list, photos, titles and bios;
- final detailed agenda;
- exact FAESA address/map URL;
- final direct Even3 payment link for active ticket;
- workshop-specific link/price/availability rules;
- official WhatsApp number/provider;
- GA4 measurement ID;
- Meta Pixel ID and CAPI credentials if used;
- production domain and DNS;
- privacy-controller/contact details;
- approved event logo/brand assets.

Code must isolate these values in content/config modules so replacement is trivial.

## 26. Official integration references
- Even3 webhook: https://ajuda.even3.com.br/hc/pt-br/articles/37014614126107-Como-funciona-o-Webhook-Even3
- Even3 registration/payment links: https://ajuda.even3.com.br/hc/pt-br/articles/19702766275739-Disponibilizar-link-de-inscri%C3%A7%C3%A3o-no-meu-evento
- Even3 API: https://docs.even3.com.br/
