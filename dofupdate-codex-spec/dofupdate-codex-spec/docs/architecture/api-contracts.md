# API Contracts

Base path examples assume same-origin reverse proxy.

## GET /health
Purpose: liveness/readiness signal for reverse proxy and monitoring.

Response `200`:
```json
{"status":"ok","database":"ok","timestamp":"2026-09-13T22:00:00.000Z"}
```

If DB is unavailable, return `503` with no credentials or stack trace.

## GET /api/config/public
Response:
```json
{
  "eventPrice": 320,
  "salesPhase": "Último lote",
  "checkoutUrl": "https://www.even3.com.br/...",
  "checkoutFallbackUrl": "https://www.even3.com.br/...",
  "groupFormUrl": "https://forms.gle/aSKo8XbHoPgSzHXn9",
  "mapsUrl": "https://maps.google.com/...",
  "salesEnabled": true
}
```

Only public information may appear here.

## POST /api/leads
### Request
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "(27) 99999-9999",
  "consent": true,
  "attribution": {
    "utmSource": "meta",
    "utmMedium": "paid_social",
    "utmCampaign": "dof_last_lot",
    "utmContent": "video_01",
    "utmTerm": null,
    "fbclid": "...",
    "gclid": null,
    "referrer": "https://instagram.com/",
    "landingUrl": "https://dofupdate.com.br/?utm_source=meta",
    "ctaOrigin": "hero",
    "sessionId": "uuid",
    "deviceClass": "mobile"
  }
}
```

### Validation
- `name`: trim; 2–100 chars.
- `email`: valid syntax; lowercase/trim normalized copy.
- `phone`: 8–20 digits after punctuation removal; attempt BR E.164 normalization.
- `consent`: must be `true`.
- all attribution strings max 500 chars; query IDs max 1000 chars.
- `ctaOrigin`: enum defined in spec.

### Success 200/201
```json
{
  "leadId": "uuid",
  "status": "CAPTURED",
  "checkoutUrl": "https://www.even3.com.br/...",
  "redirectAllowed": true
}
```

### Invalid 400
```json
{
  "code": "VALIDATION_ERROR",
  "fields": {
    "email": "Informe um e-mail válido."
  }
}
```

### Server failure 500/503
Frontend must allow checkout fallback after informing the user that registration can continue.

## POST /webhooks/even3/:secret
### Security
- `:secret` is a high-entropy server secret configured in Even3 and environment.
- Apply rate limiting appropriate for webhook traffic.
- Reject unknown payload structures.
- Persist the Even3 unique delivery `id` with a unique constraint.
- Never trigger downstream automation twice for the same delivery/business transition.

### Expected conceptual payload
Even3 payload varies by action. It includes a unique dispatch ID, timestamp/type and action-specific participant/registration/sale data.

Normalized internal mapping:
| Even3 action | Lead status | Internal event |
|---|---|---|
| Participante pendente | `SALE_STARTED` when applicable | `sale.started` |
| Venda iniciada | `SALE_STARTED` | `sale.started` |
| Venda aprovada | `PURCHASED` | `sale.approved` |
| Venda reprovada | `PAYMENT_FAILED` | `sale.failed` |
| Venda cancelada/reembolsada | `CANCELLED_REFUNDED` | `sale.cancelled` |
| Participante confirmado | do not downgrade `PURCHASED`; confirm registration metadata | optional `registration.confirmed` |
| Participante cancelado | cancellation metadata | optional `registration.cancelled` |

### Response
Return `204` or `200` after the delivery is safely persisted. Avoid waiting for WhatsApp/n8n work.

## Internal n8n dispatch
Backend -> n8n:
```json
{
  "eventId": "uuid",
  "eventType": "sale.approved",
  "occurredAt": "2026-09-13T22:00:00Z",
  "lead": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "+5527999999999",
    "status": "PURCHASED"
  },
  "source": {
    "provider": "even3",
    "providerDeliveryId": "..."
  },
  "attribution": {
    "utmSource": "meta",
    "utmMedium": "paid_social",
    "utmCampaign": "dof_last_lot",
    "utmContent": "video_01",
    "ctaOrigin": "hero"
  }
}
```

Use an internal bearer token or other secret header between backend and n8n.
