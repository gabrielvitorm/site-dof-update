# Lead API and Meta Tracking Design

**Date:** 2026-09-22
**Scope:** Production lead capture for DOF Update 2026

## Goal

Provide a production-ready API that accepts lead DTOs from the landing page, validates and normalizes them, persists leads and append-only capture events in PostgreSQL, returns HTTP 201 for a newly created lead, and reports the conversion to Meta without exposing private credentials or blocking checkout when Meta is unavailable.

## Architecture

The public boundary is `POST /api/leads`. The request is parsed as a shared Zod DTO from `packages/contracts`; the database entity is never accepted from or returned to the frontend. `LeadCaptureService` maps the DTO to an internal input, normalizes email and Brazilian phone values, and delegates persistence to `LeadRepository`.

The repository upserts by normalized email or normalized phone, appends a `LEAD_CAPTURED` event, and returns a public response DTO containing only the lead id, funnel status, checkout URL, and redirect permission. New records return `201`; repeat captures return `200` while preserving a `PURCHASED` status.

Meta tracking has two coordinated paths: the browser Pixel records `Lead` after a successful API response, while the API sends a server-side Conversions API event with the same generated event id. Server-side user data is SHA-256 hashed, and access tokens remain backend-only. Meta failures are logged as operational errors and do not roll back or block the lead capture.

## DTO and validation rules

- `name`: trim, 2–100 characters.
- `email`: trim, lowercase, valid email syntax; invalid values return `400 VALIDATION_ERROR`.
- `phone`: 8–20 digits after punctuation removal; normalize Brazilian 10/11 digit values to E.164 when possible.
- `consent`: must be `true`.
- Attribution fields remain bounded and are persisted as part of the lead record.
- The response never returns database rows or private configuration.

## Meta Conversions API

The backend receives or derives the browser event context needed for deduplication (`eventId`, `eventSourceUrl`, and available Meta click/browser identifiers). It sends `Lead` to the configured Meta Graph endpoint using backend-only `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, and API version settings. The request is isolated behind a `MetaConversionsClient` interface so it can be tested without network access.

The lead transaction remains authoritative: persistence completes first, then Meta dispatch is attempted. A failed dispatch is observable and retryable, but it cannot change a successful `201` into a purchase-blocking error.

## Production wiring

The Docker deployment must run the API service on port `3001`, connect it to the production PostgreSQL service, run deterministic migrations on startup, and expose it to the Nginx `/api` proxy under the service name `api`. Production configuration supplies the database URL and Meta secrets through the deployment secret/environment mechanism, never through the React bundle.

## Test strategy

- Contract tests for valid DTOs and invalid email responses.
- Service tests proving normalization and DTO-to-entity mapping.
- Repository integration tests proving persistence and capture events.
- Route tests proving `201` for a new lead and `200` for an existing lead.
- Meta client tests proving hashing, event id propagation, and non-blocking failure behavior.
- Build, typecheck, lint, and deployment configuration checks.
