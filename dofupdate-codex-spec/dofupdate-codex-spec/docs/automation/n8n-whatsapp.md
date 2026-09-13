# n8n + WhatsApp Automation Specification

## Boundary
The backend owns business state. n8n owns orchestration and message delivery. n8n must consume normalized internal events, not raw browser form submissions.

## Required workflows
### WF-01 — Lead captured
Trigger: `lead.captured`
Actions:
1. upsert contact in chosen CRM/table;
2. store source/campaign/CTA origin;
3. optionally send a non-intrusive informational WhatsApp message only if approved;
4. mark workflow execution with idempotency key `leadId:eventType:campaignVersion`.

### WF-02 — Checkout recovery
Trigger: `sale.started` or scheduled check of eligible leads.
Eligibility before each message:
- status is not `PURCHASED`;
- status is not `CANCELLED_REFUNDED` if policy says stop;
- consent/communication basis is valid;
- message window has not already been sent.

Suggested cadence is a business decision and must be configured, not hard-coded. Start conservatively.

### WF-03 — Payment failed
Trigger: `sale.failed`
Action: send a helpful retry/support message, not aggressive pressure. Include official checkout/support route.

### WF-04 — Purchase confirmed
Trigger: `sale.approved`
Actions:
1. immediately invalidate/cancel recovery state;
2. mark contact as buyer;
3. send confirmation/welcome only if appropriate;
4. prepare future reminder sequence for event logistics.

### WF-05 — Cancellation/refund
Trigger: `sale.cancelled`
Actions:
- stop buyer-only reminders when applicable;
- flag for operations/support;
- do not automatically re-enter generic acquisition flow.

## Message-state table recommended in n8n DB or application DB
Key fields:
- lead_id
- template_key
- campaign_version
- scheduled_at
- sent_at
- status
- provider_message_id
- idempotency_key unique

## Failure policy
- n8n failure must not roll back a purchase state.
- failed sends may retry with bounded attempts.
- alert operations after retry exhaustion.
- never send duplicate confirmation because a webhook is retried.

## Provider abstraction
Keep WhatsApp provider-specific details in one workflow/subflow. Required input:
```json
{
  "to": "+5527999999999",
  "templateKey": "checkout_recovery_1",
  "variables": {
    "name": "Maria",
    "checkoutUrl": "https://..."
  },
  "idempotencyKey": "uuid:checkout_recovery_1:v1"
}
```

## Operational dashboard minimum
Track:
- workflow executions;
- failed executions;
- messages sent;
- provider failures;
- suppression because purchase already confirmed;
- duplicate events discarded.
