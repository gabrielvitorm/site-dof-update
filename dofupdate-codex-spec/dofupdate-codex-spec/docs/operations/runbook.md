# Launch Runbook

## Pre-launch checklist
- [ ] Domain/DNS points to VPS.
- [ ] TLS valid.
- [ ] Final Even3 direct checkout URL configured.
- [ ] Fallback Even3 URL configured.
- [ ] Group form URL verified.
- [ ] Google Maps URL/address verified.
- [ ] Speaker/program placeholders reviewed; no accidental fake content.
- [ ] Privacy policy/contact approved.
- [ ] WhatsApp provider credentials configured in n8n/backend only.
- [ ] GA4 test events received.
- [ ] Meta test events received.
- [ ] Lead submit tested from mobile and desktop.
- [ ] API outage fallback tested.
- [ ] Even3 webhook events tested/validated where possible.
- [ ] Purchased-lead suppression tested.
- [ ] DB backup confirmed.
- [ ] Rollback command/process documented for actual VPS.

## Incident: landing unavailable
1. Check Nginx/container status.
2. Check disk and memory.
3. Roll back to previous known-good image if new release caused outage.
4. Keep Even3 direct link available as emergency traffic destination.

## Incident: lead API unavailable
1. Confirm frontend fallback still sends visitors to Even3.
2. Restore API/database.
3. Review `checkout_redirect_failed` and server logs.
4. Do not ask users to repeat payment attempts unless Even3 indicates failure.

## Incident: Even3 webhook failures
1. Verify public webhook route/TLS.
2. Inspect delivery IDs and processing errors.
3. Fix endpoint and rely on Even3 retry window where still active.
4. Reconcile missed approved purchases via Even3 export/API if required.
5. Ensure no duplicate buyer messages after replay.

## Incident: WhatsApp duplicate sends
1. Disable affected n8n workflow.
2. Inspect idempotency keys and purchase suppression.
3. Fix before re-enabling.
4. Do not replay whole workflow indiscriminately.

## Post-event
- export final funnel metrics;
- archive campaign configuration;
- retain/delete PII according to approved policy;
- disable obsolete recovery workflows;
- preserve necessary accounting/registration records in the systems of record.
