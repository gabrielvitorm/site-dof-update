# Modelo de dados conceitual

## Lead
Campos mínimos:
- `id` UUID
- `name`
- `email`
- `phone_e164`
- `status`
- `created_at`
- `updated_at`
- `first_touch_*`
- `last_touch_*`
- `cta_origin`
- `page_url`
- `referrer`
- `fbclid`
- `gclid`
- `consent_at` quando aplicável

## Attribution
Persistir, quando presentes:
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- fbclid
- gclid
- referrer
- landing URL
- timestamp

Idealmente manter first touch e latest touch.

## FunnelEvent
- id
- lead_id
- type
- source (`browser`, `backend`, `even3`, `n8n`, `operator`)
- external_id
- payload_json
- occurred_at
- received_at

## WebhookDelivery
- id
- provider
- external_delivery_id UNIQUE
- event_type
- payload_hash
- payload_json
- processing_status
- received_at
- processed_at
- error

## Purchase
- id
- lead_id nullable até correlação
- provider = even3
- external_sale_id
- external_registration_id
- status
- amount
- currency
- approved_at
- updated_at

## AutomationDispatch
- id
- lead_id
- event_type
- template_key
- campaign_version
- idempotency_key UNIQUE
- status
- scheduled_at
- sent_at
- provider_message_id
- error
