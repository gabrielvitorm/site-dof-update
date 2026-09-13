# DOF Update 2026 — Implementation Documentation

This folder is a repo-ready documentation pack for Codex or another engineering agent implementing the DOF Update 2026 launch platform.

## What is being built
A high-conversion official event landing page with:
- React/Vite sales page;
- mini-capture modal before checkout;
- lead attribution and persistence;
- Even3 redirect and webhook reconciliation;
- n8n + WhatsApp automation hooks;
- Meta/GA4 tracking;
- Docker Compose deployment on a VPS;
- observability, backups and rollback procedures.

## Read order for Codex
1. `AGENTS.md`
2. `docs/superpowers/specs/2026-09-13-dof-update-launch-platform-design.md`
3. `docs/superpowers/plans/2026-09-13-dof-update-launch-platform.md`
4. Architecture and integration docs under `docs/`
5. `docs/qa/acceptance-tests.md`

## Main architecture
`Ads / Organic -> React Landing -> CTA -> Mini-capture -> Lead API -> PostgreSQL -> Even3 Checkout`

`Even3 Webhook -> Backend -> PostgreSQL -> Internal event -> n8n -> WhatsApp / operations`

## MVP boundary
The MVP does not include:
- custom payment processing;
- custom participant dashboard;
- custom CMS;
- organizer admin interface;
- marketing automation editor;
- replacement of Even3.

## External references
- Even3 webhook documentation: https://ajuda.even3.com.br/hc/pt-br/articles/37014614126107-Como-funciona-o-Webhook-Even3
- Even3 direct registration/payment links: https://ajuda.even3.com.br/hc/pt-br/articles/19702766275739-Disponibilizar-link-de-inscri%C3%A7%C3%A3o-no-meu-evento
- Even3 API docs: https://docs.even3.com.br/
