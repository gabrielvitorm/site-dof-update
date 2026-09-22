# VPS Deployment Specification

## Target topology
Internet -> DNS -> Nginx :443 -> static frontend / Fastify API  
Fastify -> PostgreSQL  
Fastify -> n8n internal webhook  
Even3 -> public Fastify webhook endpoint

## Docker Compose services
Recommended:
- `nginx`
- `api`
- `postgres`
- optional `n8n` if not already hosted elsewhere

Frontend may be built in CI and served as static files by Nginx, or built by a dedicated image stage.

## Required environment variables
See root `.env.example`. Meta CAPI variables are backend-only: set
`META_CAPI_ENABLED=true`, `META_PIXEL_ID`, and
`META_CAPI_ACCESS_TOKEN` in the production runtime environment. Never expose
the access token through a `VITE_*` variable or the React bundle.

## Nginx requirements
- redirect port 80 to 443;
- TLS certificate via Let’s Encrypt or equivalent;
- serve SPA static assets with immutable caching for hashed assets;
- `index.html` no-cache or short cache;
- proxy `/api/` and `/webhooks/` to backend;
- preserve client IP headers safely;
- gzip/brotli if available;
- security headers appropriate for embedded Google Maps and analytics domains;
- request body limits.

## Deployment sequence
1. Backup DB.
2. Pull/build versioned images.
3. Run DB migrations as one controlled step.
4. Start the `api` service on port `3001` and verify `/health` internally.
5. Start/update Nginx/frontend.
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
