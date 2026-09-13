# Architecture Decision Records — Summary

## ADR-001 — Keep Even3 as checkout
**Decision:** Do not build payment/registration checkout. Redirect to Even3 direct payment link.  
**Reason:** speed, lower compliance risk, existing event operations, webhooks available.

## ADR-002 — Mini-capture before checkout
**Decision:** every sales CTA opens a short capture modal.  
**Reason:** recover high-intent leads and preserve attribution before leaving owned domain.  
**Constraint:** failure must not block purchase indefinitely.

## ADR-003 — Backend between browser and n8n
**Decision:** browser posts lead to Fastify; backend dispatches to n8n.  
**Reason:** validation, persistence, secrets, idempotency, reliable business state.

## ADR-004 — PostgreSQL as funnel state source
**Decision:** persist leads, timeline, webhook deliveries and automation dispatches.  
**Reason:** reconciliation and duplicate protection are difficult if all state lives only inside n8n executions.

## ADR-005 — Server-authoritative purchase
**Decision:** purchase is recorded only from Even3 server-side confirmation.  
**Reason:** redirects and browser return pages are not trustworthy payment confirmation.

## ADR-006 — React/Vite instead of SSR framework for MVP
**Decision:** static React/Vite SPA.  
**Reason:** page is primarily a single marketing experience; faster deployment and simpler VPS operations.  
**Trade-off:** SSR SEO advantages are not used. Mitigate with strong static metadata and performance. Revisit only if organic search becomes a major acquisition channel.
