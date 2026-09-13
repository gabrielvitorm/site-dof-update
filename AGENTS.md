# AGENTS.md - DOF Update 2026

## Mission
Build and operate the official DOF Update 2026 sales landing page and conversion layer. The platform must present the event clearly, capture high-intent leads before checkout, preserve attribution, redirect to Even3, process Even3 status updates and trigger n8n/WhatsApp automations without blocking purchase.

## Source Of Truth
Read these documents before changing product behavior:
1. `dofupdate-codex-spec/dofupdate-codex-spec/docs/superpowers/specs/2026-09-13-dof-update-launch-platform-design.md`
2. `dofupdate-codex-spec/dofupdate-codex-spec/docs/superpowers/plans/2026-09-13-dof-update-launch-platform.md`
3. `dofupdate-codex-spec/dofupdate-codex-spec/docs/architecture/api-contracts.md`
4. `dofupdate-codex-spec/dofupdate-codex-spec/docs/architecture/data-model.md`
5. `dofupdate-codex-spec/dofupdate-codex-spec/docs/integrations/even3.md`
6. `dofupdate-codex-spec/dofupdate-codex-spec/docs/analytics/tracking-plan.md`
7. `dofupdate-codex-spec/dofupdate-codex-spec/docs/qa/acceptance-tests.md`

If documents conflict, the design spec wins unless a newer architecture decision explicitly supersedes it.

## Product Rules
- Event main date: 03/10/2026, presencial, Auditorio da FAESA, Vitoria/ES.
- Pre-event workshop: 02/10/2026, separate registration.
- Current event ticket display price: R$ 320, labeled `Ultimo lote`.
- All sales CTAs open the same mini-capture modal before redirecting to checkout.
- Mini-capture requires name, WhatsApp, email and consent.
- API or automation failure must not permanently block purchase.
- Preserve UTM fields, `fbclid`, `gclid`, referrer, landing URL, session ID and `cta_origin`.
- Even3 remains the payment and registration system of record.
- Confirmed buyers must leave checkout-recovery automations immediately.
- Never put private API keys, webhook secrets, database passwords or n8n credentials in the React bundle.
- Do not fabricate speaker names, credentials, photos, schedule details, production URLs or analytics IDs.

## Technical Direction
- Frontend: React + Vite + TypeScript strict.
- Backend: Node.js + Fastify + TypeScript strict.
- Shared contracts: TypeScript package under `packages/contracts`.
- Database: PostgreSQL.
- Deployment: Docker Compose + Nginx on a VPS.
- Tests: Vitest for unit/integration, Playwright for end-to-end.

## Engineering Rules
- Use TDD for business rules and integration behavior.
- Validate every external payload with schemas.
- Use idempotency for lead upserts, Even3 webhooks and automation dispatch.
- Mask email/phone in logs.
- Keep modules small and focused.
- Avoid unrelated refactors and avoid adding dependencies unless they clearly reduce complexity.
- A task is complete only when relevant tests, typecheck and build/lint checks pass.

