# VPS Deployment Specification

## Target topology
Internet -> DNS -> reverse proxy :443 -> fullstack app (React + Fastify)
Fastify -> PostgreSQL
Fastify -> n8n internal webhook  
Even3 -> public Fastify webhook endpoint

## Docker Compose services
Recommended:
- `app` (React static files plus Fastify API on port 3001)
- `postgres`
- optional `n8n` if not already hosted elsewhere

The small-project deployment uses one application container. Fastify serves the compiled React files and the `/api` and `/webhooks` routes from the same process. PostgreSQL remains a separate service with its persistent volume.

## Required environment variables
See root `.env.example`. Meta CAPI variables are backend-only: set
`META_CAPI_ENABLED=true`, `META_PIXEL_ID`, and
`META_CAPI_ACCESS_TOKEN` in the production runtime environment. Never expose
the access token through a `VITE_*` variable or the React bundle.

## Reverse proxy requirements
- redirect port 80 to 443;
- TLS certificate via Let’s Encrypt or equivalent;
- route the public domain to the fullstack app on port `3001`;
- preserve client IP headers safely;
- allow `/api/`, `/webhooks/`, and SPA browser routes;
- preserve client IP headers safely;
- gzip/brotli if available;
- security headers appropriate for embedded Google Maps and analytics domains;
- request body limits.

## Deployment sequence
1. Backup DB.
2. Pull/build versioned images.
3. Run DB migrations as one controlled step.
4. Start the `app` service on port `3001`; it runs migrations before listening and serves both React and Fastify.
5. Update the reverse proxy route to the `app` service.
6. Run smoke test against public domain.
7. Submit a controlled lead test and verify a row in `leads`, a `LEAD_CAPTURED` row in `lead_events`, and one Meta CAPI event using the same `event_id` as the browser Pixel event.
8. Verify Even3 webhook endpoint with a controlled event when possible.
9. Tag release.

## Rollback
- keep previous image tags;
- application rollback must not blindly roll back irreversible DB migrations;
- migrations should be backward-compatible during launch window when feasible;
- document DB restore separately.

## Backup
At least daily during launch:
- `pg_dump` compressed;
- timestamped filename;
- retention covering the campaign/event window;
- periodic restore test.

## Monitoring
At minimum:
- uptime check on `/health` or landing;
- SSL expiration alert;
- disk usage;
- container restarts;
- API 5xx rate;
- failed webhook processing;
- n8n workflow failures;
- PostgreSQL backup success.
