# AGENTS.md — DOF Update 2026

## Mission
Build and operate the official DOF Update 2026 sales landing page and conversion layer. The application must present the event clearly, capture high-intent leads before checkout, preserve attribution data, redirect to Even3, process Even3 status updates, and trigger n8n/WhatsApp automations without blocking the purchase flow.

## Source of truth
Read these documents before changing code:
1. `docs/superpowers/specs/2026-09-13-dof-update-launch-platform-design.md`
2. `docs/superpowers/plans/2026-09-13-dof-update-launch-platform.md`
3. `docs/architecture/api-contracts.md`
4. `docs/architecture/data-model.md`
5. `docs/integrations/even3.md`
6. `docs/analytics/tracking-plan.md`
7. `docs/qa/acceptance-tests.md`

If documents conflict, the design spec wins unless a newer ADR explicitly supersedes it.

## Non-negotiable product rules
- Event main date: 03/10/2026, presencial, Auditório da FAESA, Vitória/ES.
- Pre-event workshop: 02/10/2026, separate registration.
- Current event ticket display price: R$ 320, labeled `Último lote`.
- All sales CTAs open the same mini-capture modal before redirecting to checkout.
- Mini-capture requires name, WhatsApp, email and consent.
- The purchase path must never be permanently blocked because the lead API or automation layer is unavailable.
- Preserve `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, referrer, landing URL and `cta_origin`.
- Even3 remains the payment and registration system of record. Do not build a custom checkout.
- Confirmed buyers must be removed from checkout-recovery automations immediately.
- Never put private API keys, webhook secrets, database passwords or n8n credentials in the React bundle.
- No fabricated speaker names, credentials or schedule details. Keep structured placeholders until real data is supplied.

## Architecture constraints
- Frontend: React + Vite + TypeScript.
- Backend: Node.js + Fastify + TypeScript.
- Database: PostgreSQL.
- Reverse proxy/TLS: Nginx on VPS.
- Deployment: Docker Compose.
- Automation: n8n receives internal events from backend; browser must not call protected n8n webhooks directly.
- Checkout: Even3 direct payment link per ticket when available; list-of-tickets link only as fallback.
- Public configuration may be served by backend if required to change checkout URL/price without a frontend rebuild.

## Engineering rules
- TypeScript strict mode.
- Prefer small modules with one responsibility.
- Validate every external payload with schemas.
- Use idempotency for lead upserts, Even3 webhooks and automation dispatch.
- Log correlation IDs, never raw sensitive payloads unless explicitly required for secure audit storage.
- Mask email/phone in application logs.
- Webhook endpoint must acknowledge valid payloads quickly; slow follow-up work must be asynchronous or decoupled.
- Avoid adding dependencies unless they reduce complexity materially.
- Avoid premature admin panels, authentication systems or CMS features for MVP.

## Testing rules
- Use TDD for business rules and integration behavior.
- Unit tests: Vitest.
- Backend integration tests: Vitest + Fastify injection or equivalent.
- End-to-end: Playwright.
- Every critical funnel step must have automated coverage.
- Run lint, typecheck, unit/integration tests and production build before completion.

## UX rules
- Mobile-first.
- Primary CTA text: `Garantir minha vaga` or equivalent approved copy.
- Mobile sticky CTA appears only after first scroll and must not cover modal, FAQ controls or legal text.
- Modal must be keyboard accessible, focus-trapped and dismissible.
- Do not show fake countdowns or artificial scarcity.
- Use the DOF visual system: high contrast, neutral base, red accent, concentric/target motif where appropriate.

## Git discipline
- Work in small commits aligned with the implementation plan.
- Conventional commit examples: `feat: add lead capture modal`, `feat: process even3 sale webhooks`, `test: cover checkout fallback`.
- Do not mix refactors unrelated to the current task.

## Completion gate
A task is not complete until its tests pass and documentation impacted by the change has been updated.
