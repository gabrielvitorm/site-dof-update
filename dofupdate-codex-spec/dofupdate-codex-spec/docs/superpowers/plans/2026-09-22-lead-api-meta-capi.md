# Lead API and Meta CAPI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a tested lead-capture API contract that validates and normalizes leads, persists them in PostgreSQL with HTTP 201 semantics, and sends deduplicated Meta Conversions API events without blocking checkout.

**Architecture:** Keep the existing Fastify route as the public boundary and keep database rows behind service/repository interfaces. Extend the shared DTO with a browser-generated event id and optional Meta browser identifiers; the frontend uses that event id for Pixel `Lead`, while the API sends the same id to Meta CAPI after persistence. Add a small injectable Meta client and production environment wiring; do not put CAPI credentials in Vite variables.

**Tech Stack:** React, Vite, TypeScript strict, Fastify, Zod, PostgreSQL, Vitest, Docker Compose.

**Spec:** `dofupdate-codex-spec/dofupdate-codex-spec/docs/superpowers/specs/2026-09-22-lead-api-meta-capi-design.md`

## Global Constraints

- The frontend communicates with the backend through DTOs and never receives database entities.
- Invalid email syntax returns `400` with `VALIDATION_ERROR` and field details.
- A newly inserted lead returns `201`; a repeated capture may return `200` while preserving `PURCHASED`.
- API or Meta failures must not permanently block the Even3 checkout fallback.
- Private API keys, Meta access tokens, webhook secrets, database passwords, and n8n credentials never enter the React bundle.
- Email and phone sent to Meta server-side are SHA-256 normalized hashes.
- Even3 remains the registration/payment system of record.
- Migrations are deterministic and idempotent; persistence and tracking are observable separately.

## Review Focus

- Two simultaneous captures for the same normalized email must not create duplicate leads; Task 2 adds a database uniqueness/idempotency test.
- A Meta API timeout after a successful insert must still return `201`; Task 3 adds a non-blocking failure test.
- Pixel and CAPI must share one event id; Task 4 adds a frontend request/analytics test.
- Missing or malformed Meta configuration must not expose a token or make local tests require network access; Task 3 adds config/client tests.
- The production container must actually expose `api:3001` to Nginx; Task 5 adds deployment configuration and health checks.

---

### Task 1: Extend the shared lead DTO for deduplicated tracking

**Files:**
- Modify: `packages/contracts/src/lead.ts`
- Modify: `apps/web/src/features/attribution/attribution.ts`
- Modify: `apps/web/src/features/analytics/analytics.ts`
- Modify: `apps/web/src/App.tsx`
- Test: `packages/contracts/src/lead.test.ts`
- Test: `apps/web/src/features/attribution/attribution.test.ts`
- Test: `apps/web/src/features/analytics/analytics.test.ts`
- Test: `apps/web/src/App.test.tsx`

**Interfaces:**
- Produces `LeadCaptureRequest.eventId: string` as a UUID and optional `meta.fbp`/`meta.fbc` bounded strings.
- Produces `LeadCaptureResponse.eventId: string`.
- Produces `Analytics.trackLead({ leadId, eventId, attribution })` and passes `eventID` to the browser Meta Pixel call.

- [ ] **Step 1: Write failing contract and frontend tests**

  Add assertions that a request requires a UUID event id, accepts optional Meta browser ids, and that a successful submit sends the same event id to both the API body and the browser `Lead` event.

- [ ] **Step 2: Run the focused tests and verify RED**

  Run `npm test -- packages/contracts/src/lead.test.ts apps/web/src/features/analytics/analytics.test.ts apps/web/src/App.test.tsx`.
  Expected: FAIL because the DTO and analytics signatures do not yet contain the event id.

- [ ] **Step 3: Implement the minimal DTO and browser changes**

  Generate one UUID per submit, capture `_fbp`/`_fbc` cookies without inventing values, include them in the DTO-only `meta` object, and pass the API response event id to `trackLead` and `fbq('track', 'Lead', ..., { eventID })`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run the same command and expect all focused tests to pass.

- [ ] **Step 5: Commit**

  Run `git add packages/contracts/src/lead.ts packages/contracts/src/lead.test.ts apps/web/src/features/attribution/attribution.ts apps/web/src/features/attribution/attribution.test.ts apps/web/src/features/analytics/analytics.ts apps/web/src/features/analytics/analytics.test.ts apps/web/src/App.tsx apps/web/src/App.test.tsx && git commit -m "feat: add lead tracking event DTO"`.

### Task 2: Make lead persistence atomic and explicitly DTO-to-entity

**Files:**
- Modify: `apps/api/src/db/migrations/001_initial.sql`
- Modify: `apps/api/src/modules/leads/lead-repository.ts`
- Modify: `apps/api/src/modules/leads/lead-service.ts`
- Test: `apps/api/src/modules/leads/lead-repository.test.ts`
- Test: `apps/api/src/modules/leads/lead-routes.test.ts`

**Interfaces:**
- Consumes `LeadCaptureRequest` from Task 1.
- Produces `LeadCaptureService.capture(rawPayload: unknown): Promise<LeadCaptureResponse>` with no database row in its public return value.
- Produces repository upsert behavior that uses normalized email/phone uniqueness and appends `LEAD_CAPTURED` in the same database operation boundary.

- [ ] **Step 1: Write failing persistence tests**

  Add a test for the normalized duplicate path and a test asserting that the service response contains only `leadId`, `status`, `checkoutUrl`, `redirectAllowed`, and `eventId`, never `email`, `phone`, or raw attribution.

- [ ] **Step 2: Run the focused repository/route tests and verify RED**

  Run `npm test -- apps/api/src/modules/leads/lead-repository.test.ts apps/api/src/modules/leads/lead-routes.test.ts`.
  Expected: FAIL on the new response shape/atomic duplicate assertions.

- [ ] **Step 3: Implement the minimal persistence changes**

  Add safe unique indexes for normalized email and non-null E.164 phone, map only the DTO fields into `CapturedLeadInput`, carry the event id into the capture event payload, and preserve the existing purchased-status protection. Keep raw PII out of event payloads.

- [ ] **Step 4: Run the focused tests and verify GREEN**

  Run the same command and expect all lead tests to pass.

- [ ] **Step 5: Commit**

  Run `git add apps/api/src/db/migrations/001_initial.sql apps/api/src/modules/leads/lead-repository.ts apps/api/src/modules/leads/lead-service.ts apps/api/src/modules/leads/lead-repository.test.ts apps/api/src/modules/leads/lead-routes.test.ts && git commit -m "feat: harden lead persistence contract"`.

### Task 3: Add non-blocking Meta Conversions API client

**Files:**
- Modify: `apps/api/src/config.ts`
- Modify: `apps/api/src/app.ts`
- Modify: `apps/api/src/modules/leads/lead-service.ts`
- Create: `apps/api/src/modules/meta/meta-conversions-client.ts`
- Test: `apps/api/src/modules/meta/meta-conversions-client.test.ts`
- Test: `apps/api/src/modules/leads/lead-routes.test.ts`
- Test: `apps/api/src/config.test.ts`

**Interfaces:**
- Produces `MetaConversionsClient.sendLead(input: MetaLeadEvent): Promise<void>`.
- `MetaLeadEvent` contains `eventId`, `eventSourceUrl`, `actionSource`, hashed email/phone, and optional `fbp`/`fbc`.
- The service persists first and invokes the client through an injectable interface; client errors are logged and swallowed for the HTTP request.

- [ ] **Step 1: Write failing client and route tests**

  Add tests for SHA-256 hashing, Graph payload shape, event id propagation, no network call when CAPI is disabled, and `201` when the injected client rejects after persistence.

- [ ] **Step 2: Run focused tests and verify RED**

  Run `npm test -- apps/api/src/modules/meta/meta-conversions-client.test.ts apps/api/src/modules/leads/lead-routes.test.ts apps/api/src/config.test.ts`.
  Expected: FAIL because the client/config/injection path does not exist.

- [ ] **Step 3: Implement the client and configuration**

  Add backend-only `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, optional `META_CAPI_API_VERSION`, and `META_CAPI_ENABLED` configuration. Use Node `fetch`, a bounded timeout, SHA-256 normalization, and structured error logging without PII or tokens. Keep the default test configuration disabled.

- [ ] **Step 4: Run focused tests and verify GREEN**

  Run the same command and expect all focused tests to pass.

- [ ] **Step 5: Commit**

  Run `git add apps/api/src/config.ts apps/api/src/config.test.ts apps/api/src/app.ts apps/api/src/modules/meta apps/api/src/modules/leads/lead-service.ts apps/api/src/modules/leads/lead-routes.test.ts && git commit -m "feat: add non-blocking Meta conversions tracking"`.

### Task 4: Wire production frontend/API behavior and error fallback

**Files:**
- Modify: `apps/api/src/modules/leads/lead-routes.ts`
- Modify: `apps/web/src/App.tsx`
- Modify: `.env.example`
- Modify: `apps/api/.env.example`
- Test: `apps/api/src/modules/leads/lead-routes.test.ts`
- Test: `apps/web/src/App.test.tsx`

**Interfaces:**
- Consumes the DTO and Meta client contract from Tasks 1–3.
- Produces `POST /api/leads` with `201` for a newly created lead, `400` for invalid email, and checkout fallback on API/Meta failure.

- [ ] **Step 1: Write failing end-to-end boundary tests**

  Add route assertions for exact status/body shape, invalid email, normalized persistence, event id equality, and frontend fallback preserving the selected Even3 URL.

- [ ] **Step 2: Run focused tests and verify RED**

  Run `npm test -- apps/api/src/modules/leads/lead-routes.test.ts apps/web/src/App.test.tsx`.
  Expected: FAIL on the new event id and production fallback assertions.

- [ ] **Step 3: Implement route/frontend wiring**

  Return the DTO response with `eventId`, use the request event id in the service, keep the browser success tracking after `201`, and retain the safe checkout fallback when the API cannot respond.

- [ ] **Step 4: Run focused tests and verify GREEN**

  Run the same command and expect all focused tests to pass.

- [ ] **Step 5: Commit**

  Run `git add apps/api/src/modules/leads/lead-routes.ts apps/web/src/App.tsx .env.example apps/api/.env.example apps/api/src/modules/leads/lead-routes.test.ts apps/web/src/App.test.tsx && git commit -m "feat: wire lead capture and checkout fallback"`.

### Task 5: Ensure the production container graph includes the API

**Files:**
- Modify: `infra/docker-compose.deploy.yml`
- Modify: `infra/nginx/default.conf`
- Modify: `dofupdate-codex-spec/dofupdate-codex-spec/docs/operations/deployment-vps.md`
- Test: `apps/api/src/deployment-config.test.ts`

**Interfaces:**
- Consumes the API port/configuration from Tasks 3–4.
- Produces a deployment graph with `postgres`, `api`, and `web`, shared service DNS `api`, startup migrations, and `/api` proxying to port `3001`.

- [ ] **Step 1: Write a deployment configuration test**

  Read the deployment files with Node `fs` and assert that the deployment compose file contains `api`, `HOST=0.0.0.0`, `PORT=3001`, `DATABASE_URL`, Meta backend variables, and that Nginx proxies `/api/` to `api:3001`.

- [ ] **Step 2: Run the config test and verify RED**

  Run `npm test -- apps/api/src/deployment-config.test.ts`.
  Expected: FAIL if any required production wiring is absent.

- [ ] **Step 3: Implement deployment wiring and runbook instructions**

  Add only backend environment names for Meta secrets, preserve the existing Nginx proxy, document migration/startup/health verification, and explicitly state that Easypanel must create the missing API service from the image/build configuration.

- [ ] **Step 4: Run the config test and verify GREEN**

  Run `npm test -- apps/api/src/deployment-config.test.ts` and expect PASS.

- [ ] **Step 5: Commit**

  Run `git add infra/docker-compose.deploy.yml infra/nginx/default.conf dofupdate-codex-spec/dofupdate-codex-spec/docs/operations/deployment-vps.md apps/api/src/deployment-config.test.ts && git commit -m "ops: wire production lead api service"`.

### Task 6: Full verification and deployment handoff

- [ ] **Step 1:** Run `npm test` and record the complete result.
- [ ] **Step 2:** Run `npm run typecheck` and record the complete result.
- [ ] **Step 3:** Run `npm run lint` and record the complete result.
- [ ] **Step 4:** Run `npm run build` and record the complete result.
- [ ] **Step 5:** Review the diff for secrets, entity leakage, unbounded input, and network calls without timeouts.
- [ ] **Step 6:** Provide the exact production deployment commands and required secret names; do not push or mutate the VPS without explicit deployment authorization.
