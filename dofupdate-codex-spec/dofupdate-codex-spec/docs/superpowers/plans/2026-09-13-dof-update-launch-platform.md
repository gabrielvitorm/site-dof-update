# DOF Update 2026 Launch Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the official DOF Update 2026 landing page, pre-checkout lead capture, Even3 reconciliation, analytics and automation integration.

**Architecture:** A React/Vite SPA is served by Nginx on a VPS. A Fastify API persists lead/funnel state in PostgreSQL, returns the active Even3 checkout URL, processes Even3 webhooks idempotently and dispatches normalized events to n8n. Even3 remains the payment/registration system of record.

**Tech Stack:** React, Vite, TypeScript, Fastify, PostgreSQL, Docker Compose, Nginx, Vitest, Playwright, n8n, GA4, Meta Pixel/CAPI.

**Spec:** `docs/superpowers/specs/2026-09-13-dof-update-launch-platform-design.md`

## Global Constraints
- React + Vite + TypeScript strict for frontend.
- Node.js + Fastify + TypeScript strict for backend.
- PostgreSQL persistence.
- Docker Compose + Nginx on VPS.
- Even3 remains checkout/system of record.
- Main event: 03/10/2026, FAESA Vitória/ES, current displayed price R$320, last lot.
- All normal sales CTAs must use the mini-capture modal.
- API failure must have a controlled checkout fallback.
- `PURCHASED` is set only by authoritative Even3 server-side event.
- Purchased leads must be suppressed from recovery automation.
- No secrets in frontend bundle.
- No invented speakers/program details.

---

## File Structure to Create
```text
apps/
  web/
    src/
      components/
      content/event.ts
      features/analytics/
      features/attribution/
      features/checkout/
      lib/api/
      sections/
      App.tsx
      main.tsx
    tests/
  api/
    src/
      app.ts
      config.ts
      db/
      modules/leads/
      modules/even3/
      modules/automation/
      routes/health.ts
      routes/public-config.ts
    tests/
packages/
  contracts/
    src/index.ts
e2e/
  funnel.spec.ts
infra/
  nginx/
  docker-compose.yml
  scripts/
docs/ (already supplied)
```

### Task 1: Bootstrap monorepo and quality gates

**Files:**
- Create: root `package.json`, workspace config, TypeScript configs, lint config.
- Create: `apps/web`, `apps/api`, `packages/contracts`.
- Test: minimal Vitest smoke tests in web/api.

**Interfaces:**
- Produces workspace commands: `dev`, `build`, `test`, `typecheck`, `lint`.

- [ ] **Step 1: Write failing smoke tests** asserting each app exports/boots its minimal entry.
- [ ] **Step 2: Run `npm test` and verify failure** because workspace/apps do not exist.
- [ ] **Step 3: Create the minimal workspace** with strict TypeScript and the listed scripts.
- [ ] **Step 4: Run `npm run typecheck && npm test`** and require PASS.
- [ ] **Step 5: Commit** `chore: bootstrap dof update monorepo`.

### Task 2: Shared contracts and runtime schemas

**Files:**
- Create: `packages/contracts/src/lead.ts`
- Create: `packages/contracts/src/events.ts`
- Create: `packages/contracts/src/config.ts`
- Test: `packages/contracts/src/*.test.ts`

**Interfaces:**
- Produces `LeadCaptureRequest`, `LeadCaptureResponse`, `Attribution`, `PublicConfig`, `InternalAutomationEvent`, CTA-origin enum and lead-status enum.

- [ ] **Step 1: Write schema tests** for valid/invalid name, email, phone, consent and CTA origin.
- [ ] **Step 2: Run tests and verify failure.**
- [ ] **Step 3: Implement schemas/types** with exact field names from `docs/architecture/api-contracts.md`.
- [ ] **Step 4: Run contract tests and typecheck.**
- [ ] **Step 5: Commit** `feat: define shared funnel contracts`.

### Task 3: PostgreSQL schema and repository layer

**Files:**
- Create: `apps/api/src/db/migrations/001_initial.sql`
- Create: `apps/api/src/db/client.ts`
- Create: `apps/api/src/modules/leads/lead-repository.ts`
- Create: `apps/api/src/modules/even3/webhook-repository.ts`
- Test: repository integration tests against test Postgres.

**Interfaces:**
- Produces lead upsert/find/update APIs and unique Even3 delivery persistence.

- [ ] **Step 1: Write integration tests** for email upsert, phone fallback, webhook unique delivery and event append.
- [ ] **Step 2: Run tests and verify failure.**
- [ ] **Step 3: Implement migration** matching `docs/architecture/data-model.md` plus `lead_events`, `even3_webhook_deliveries`, `automation_dispatches`.
- [ ] **Step 4: Implement repositories** using parameterized SQL only.
- [ ] **Step 5: Run DB tests.**
- [ ] **Step 6: Commit** `feat: add funnel persistence model`.

### Task 4: Fastify app, health and public config

**Files:**
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/config.ts`
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/routes/public-config.ts`
- Test: `apps/api/tests/health.test.ts`, `public-config.test.ts`

**Interfaces:**
- Produces `GET /health` and `GET /api/config/public`.

- [ ] **Step 1: Write Fastify injection tests** for healthy/DB-down behavior and public config excluding secrets.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement typed config parsing and routes.**
- [ ] **Step 4: Run tests/typecheck.**
- [ ] **Step 5: Commit** `feat: add api health and public config`.

### Task 5: Lead capture service and endpoint

**Files:**
- Create: `apps/api/src/modules/leads/lead-service.ts`
- Create: `apps/api/src/modules/leads/lead-routes.ts`
- Create: phone/email normalization helpers.
- Test: `apps/api/tests/leads.test.ts`

**Interfaces:**
- Consumes shared `LeadCaptureRequest`.
- Produces `POST /api/leads` response with `leadId`, status and checkout URL.

- [ ] **Step 1: Write tests** for validation, normalization, upsert, preserving purchased state, attribution persistence and response checkout URL.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement minimal service/route.**
- [ ] **Step 4: Add rate limit and safe log masking tests.**
- [ ] **Step 5: Run tests/typecheck.**
- [ ] **Step 6: Commit** `feat: capture attributed checkout leads`.

### Task 6: Automation dispatch outbox

**Files:**
- Create: `apps/api/src/modules/automation/automation-service.ts`
- Create: `apps/api/src/modules/automation/automation-worker.ts` or bounded dispatch mechanism.
- Test: dispatch/idempotency tests.

**Interfaces:**
- Produces `enqueueAutomationEvent(eventType, lead, source)` with idempotency key.

- [ ] **Step 1: Write tests** proving DB business state survives n8n outage and duplicate enqueue is suppressed.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement persistent dispatch record and bounded retry worker.**
- [ ] **Step 4: Run tests.**
- [ ] **Step 5: Commit** `feat: add reliable n8n event dispatch`.

### Task 7: Even3 webhook ingestion and state machine

**Files:**
- Create: `apps/api/src/modules/even3/even3-schema.ts`
- Create: `apps/api/src/modules/even3/even3-service.ts`
- Create: `apps/api/src/modules/even3/even3-routes.ts`
- Test: `apps/api/tests/even3-webhook.test.ts`

**Interfaces:**
- Consumes Even3 POST payload with unique dispatch ID and action type.
- Produces idempotent lead status transitions and normalized automation events.

- [ ] **Step 1: Write tests** for bad secret, malformed payload, supported types, duplicate ID, approval, failure, delayed pending after purchase, cancellation and correlation.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement URL-secret validation and payload normalization.**
- [ ] **Step 4: Implement monotonic state rules from `data-model.md`.**
- [ ] **Step 5: Persist delivery before downstream work and return 2xx quickly.**
- [ ] **Step 6: Run full API integration tests.**
- [ ] **Step 7: Commit** `feat: reconcile even3 webhook events`.

### Task 8: Attribution module in React

**Files:**
- Create: `apps/web/src/features/attribution/attribution.ts`
- Create: `apps/web/src/features/attribution/session.ts`
- Test: `apps/web/src/features/attribution/*.test.ts`

**Interfaces:**
- Produces `getAttributionSnapshot(ctaOrigin)` and stable session ID.

- [ ] **Step 1: Write tests** for UTM parsing, click IDs, direct traffic, first/latest touch and device class.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement storage/parsing without fingerprinting.**
- [ ] **Step 4: Run tests.**
- [ ] **Step 5: Commit** `feat: capture campaign attribution`.

### Task 9: Analytics abstraction

**Files:**
- Create: `apps/web/src/features/analytics/analytics.ts`
- Create provider adapters for GA4 and Meta.
- Test adapter contract.

**Interfaces:**
- Produces functions `trackPageView`, `trackCtaClick`, `trackLead`, `trackBeginCheckout`, `trackCheckoutRedirectFailed`.

- [ ] **Step 1: Write tests** verifying event names/params and safe no-op when IDs are absent.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement provider-neutral facade.**
- [ ] **Step 4: Run tests.**
- [ ] **Step 5: Commit** `feat: add funnel analytics abstraction`.

### Task 10: Landing content model and visual shell

**Files:**
- Create: `apps/web/src/content/event.ts`
- Create section components under `apps/web/src/sections/`.
- Create shared visual components.
- Test: content smoke/render tests.

**Interfaces:**
- Consumes structured event content; produces full page sections in approved order.

- [ ] **Step 1: Write a render test** asserting all required section headings and current event facts.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement content data** from `docs/content/landing-copy-map.md` with speaker/program placeholders.
- [ ] **Step 4: Implement responsive visual shell** with DOF neutral/red/high-contrast direction.
- [ ] **Step 5: Run tests and production build.**
- [ ] **Step 6: Commit** `feat: build dof update landing content`.

### Task 11: Checkout CTA controller and mini-capture modal

**Files:**
- Create: `apps/web/src/features/checkout/CheckoutProvider.tsx`
- Create: `CheckoutCaptureModal.tsx`
- Create: typed API client.
- Test: component tests.

**Interfaces:**
- Produces `openCheckoutCapture(ctaOrigin)` available to all CTAs.

- [ ] **Step 1: Write tests** for opening from multiple CTA origins, validation, keyboard behavior and submit state.
- [ ] **Step 2: Run and verify failure.**
- [ ] **Step 3: Implement accessible modal and form.**
- [ ] **Step 4: On accepted lead, emit `lead` and `begin_checkout`, then redirect once.**
- [ ] **Step 5: Implement controlled fallback on API failure using configured safe URL.**
- [ ] **Step 6: Run tests.**
- [ ] **Step 7: Commit** `feat: add pre-checkout lead capture`.

### Task 12: Wire every CTA, location and FAQ

**Files:**
- Modify landing sections.
- Add location map component and FAQ accordion.
- Test interactions.

**Interfaces:**
- All sales CTA buttons call shared checkout controller with explicit origin.

- [ ] **Step 1: Write tests** mapping each CTA to expected `cta_origin`.
- [ ] **Step 2: Implement CTA wiring, lazy map, route link, group form and FAQ.**
- [ ] **Step 3: Verify sticky mobile CTA does not obstruct content.**
- [ ] **Step 4: Run web tests/build.**
- [ ] **Step 5: Commit** `feat: complete landing conversion interactions`.

### Task 13: End-to-end funnel tests

**Files:**
- Create: `e2e/funnel.spec.ts`
- Create: API/mock fixtures only where external Even3 cannot be safely called.

**Interfaces:**
- Verifies browser -> lead API -> redirect behavior and fallback.

- [ ] **Step 1: Write Playwright happy-path test** from campaign URL to capture modal to expected checkout redirect.
- [ ] **Step 2: Write API-outage fallback test.**
- [ ] **Step 3: Write responsive/mobile CTA test.**
- [ ] **Step 4: Run e2e in CI/local container.**
- [ ] **Step 5: Commit** `test: cover critical sales funnel end to end`.

### Task 14: Docker Compose, Nginx and migrations deployment

**Files:**
- Create: `infra/docker-compose.yml`
- Create: `infra/nginx/default.conf`
- Create Dockerfiles for web/api.
- Create backup/restore scripts.
- Test: container smoke test.

**Interfaces:**
- Produces reproducible VPS deployment.

- [ ] **Step 1: Write a smoke script** that fails unless landing and `/health` are reachable.
- [ ] **Step 2: Build production images.**
- [ ] **Step 3: Configure Nginx routes and caching/TLS-ready config.**
- [ ] **Step 4: Add PostgreSQL backup script and document cron/systemd timer usage.**
- [ ] **Step 5: Bring stack up in staging/local and run smoke test.**
- [ ] **Step 6: Commit** `ops: add reproducible vps deployment`.

### Task 15: n8n production workflows

**Files:**
- Export workflow JSON under `automation/n8n/` once built.
- Add `automation/n8n/README.md` documenting credentials and activation order.

**Interfaces:**
- Consumes normalized internal event envelope.
- Produces idempotent WhatsApp/support actions.

- [ ] **Step 1: Build test webhook workflow** validating internal token and event envelope.
- [ ] **Step 2: Build purchase-confirmed suppression path first.**
- [ ] **Step 3: Build lead/sale-start/payment-failed flows with idempotency keys.**
- [ ] **Step 4: Test duplicate event delivery.**
- [ ] **Step 5: Test n8n provider failure and retry behavior.**
- [ ] **Step 6: Export/version workflow JSON and commit** `feat: add launch whatsapp automations`.

### Task 16: Privacy, headers and abuse controls

**Files:**
- Add privacy route/page and policy link.
- Update Nginx security headers.
- Add backend rate-limit config.
- Test security behavior.

**Interfaces:**
- Provides privacy notice and hardened public endpoints.

- [ ] **Step 1: Write tests** for rate-limit behavior and secret exclusion from public config.
- [ ] **Step 2: Implement privacy/legal surface with approved text placeholders only where controller details are not yet supplied.**
- [ ] **Step 3: Add headers compatible with analytics and Google Maps embed.**
- [ ] **Step 4: Run security-focused tests.**
- [ ] **Step 5: Commit** `feat: harden launch privacy and security`.

### Task 17: Production launch verification

**Files:**
- Update `docs/operations/runbook.md` with actual domain/commands.
- Record release notes.

**Interfaces:**
- Produces a verified production release.

- [ ] **Step 1: Replace all production input placeholders listed in spec section 25.**
- [ ] **Step 2: Run `lint`, `typecheck`, unit/integration, e2e and production build.**
- [ ] **Step 3: Deploy to VPS and verify HTTPS + `/health`.**
- [ ] **Step 4: Run a real lead with known UTM values.**
- [ ] **Step 5: Verify GA4 and Meta test events.**
- [ ] **Step 6: Verify Even3 webhook with controlled transaction/event if feasible.**
- [ ] **Step 7: Verify a confirmed purchase suppresses recovery.**
- [ ] **Step 8: Confirm backup and rollback.**
- [ ] **Step 9: Tag release and commit launch documentation** `docs: record production launch verification`.

## Plan self-review
- Spec coverage: landing, lead capture, attribution, API, database, Even3, n8n, WhatsApp, analytics, security, VPS, testing and launch operations are mapped to tasks.
- Placeholder policy: only business-owned production inputs remain placeholders; implementation behavior is specified.
- Type consistency: status names, CTA origins and API field names match the design and contract documents.
