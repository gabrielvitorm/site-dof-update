# Acceptance and Test Matrix

## Frontend
### Hero and navigation
- [ ] Event name, last lot, R$320, 03/10/2026 and Vitória/ES are visible.
- [ ] CTA opens capture modal.
- [ ] no sales CTA bypasses modal in normal mode.

### Capture modal
- [ ] keyboard focus enters modal.
- [ ] ESC/close works.
- [ ] invalid name rejected.
- [ ] invalid email rejected.
- [ ] invalid phone rejected.
- [ ] unchecked consent rejected.
- [ ] double-click submit cannot create duplicate visible flow.
- [ ] successful submit redirects once.

### Attribution
Test URL:
`/?utm_source=meta&utm_medium=paid_social&utm_campaign=test&utm_content=video1&fbclid=test123`
- [ ] values appear in POST `/api/leads` payload.
- [ ] `cta_origin` matches actual CTA.
- [ ] direct traffic works with null attribution.

### Failure fallback
- [ ] simulate API 503.
- [ ] visitor receives concise message.
- [ ] visitor can continue to fallback checkout.

### Responsive/accessibility
- [ ] 360px width usable.
- [ ] 768px width usable.
- [ ] desktop usable.
- [ ] sticky mobile CTA does not cover controls.
- [ ] modal is keyboard accessible.
- [ ] contrast and heading hierarchy checked.

## Backend
### Lead upsert
- [ ] new email creates lead.
- [ ] same normalized email updates existing lead.
- [ ] same phone fallback matches when email cannot.
- [ ] purchased lead is not downgraded by repeated capture.

### Even3 webhook
- [ ] unknown secret rejected.
- [ ] malformed body rejected.
- [ ] supported event persisted.
- [ ] duplicate delivery ID does not duplicate business effects.
- [ ] sale approved sets `PURCHASED`.
- [ ] sale failed cannot overwrite later `PURCHASED`.
- [ ] delayed pending event cannot downgrade `PURCHASED`.
- [ ] cancellation after purchase sets `CANCELLED_REFUNDED`.

### n8n dispatch
- [ ] normalized envelope generated.
- [ ] duplicate business transition does not duplicate dispatch.
- [ ] n8n outage does not lose authoritative purchase state.

## Analytics
- [ ] PageView/ViewContent.
- [ ] Lead after accepted API response.
- [ ] InitiateCheckout before redirect.
- [ ] Purchase only after server-side Even3 approval.
- [ ] test UTM appears with lead/purchase correlation.

## Operations
- [ ] `/health` returns 200 healthy.
- [ ] HTTPS redirect works.
- [ ] DB backup job creates valid dump.
- [ ] restore procedure tested once before launch.
- [ ] rollback tested on staging or controlled production release.
