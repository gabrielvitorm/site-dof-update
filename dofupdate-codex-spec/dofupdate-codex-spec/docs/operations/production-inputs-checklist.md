# Production Inputs Checklist

Preencher antes da ativação de tráfego:

| Input | Owner | Where configured | Required for launch |
|---|---|---|---|
| Production domain | Infra | DNS / `APP_BASE_URL` | Yes |
| Even3 last-lot direct payment URL | Event organization | `EVEN3_CHECKOUT_URL` | Yes |
| Even3 fallback/event URL | Event organization | `EVEN3_FALLBACK_URL` | Yes |
| Exact FAESA address | Event organization | content/config | Yes |
| Google Maps route/embed URL | Marketing | `MAPS_URL` + content | Yes |
| Final speakers + bios + photos | Event organization | `src/content/event.ts` | Content launch gate |
| Final agenda | Event organization | `src/content/event.ts` | Content launch gate |
| Workshop final rules/link | Event organization | content/config | If workshop CTA active |
| WhatsApp number/provider | Operations | n8n secret/config | For WhatsApp automation |
| GA4 measurement ID | Marketing | frontend public env | Yes for analytics |
| Meta Pixel ID | Marketing | frontend public env | Yes for Meta campaigns |
| Meta CAPI token | Marketing | server secret | Recommended |
| n8n internal URL/token | Tech | backend secret | Yes for automations |
| Even3 webhook secret path | Tech | backend secret + Even3 | Yes for reconciliation |
| Privacy contact/controller data | Organization | legal/privacy page | Yes |
| Final logo/brand assets | Marketing | frontend assets | Yes |

Do not block engineering tasks that do not depend on these values. Keep them replaceable through structured content/configuration.
