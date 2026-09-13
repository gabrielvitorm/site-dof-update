# Analytics and Attribution Plan

## Naming principles
Use one canonical event name per action. Keep parameters consistent across GA4 and Meta where practical.

## Browser events
| Event | Trigger | Important params |
|---|---|---|
| `page_view` | landing load | URL, referrer, UTMs |
| `view_content` | first meaningful render | page/event id |
| `cta_click` | sales CTA click | `cta_origin` |
| `lead_form_open` | modal opened | `cta_origin` |
| `lead_form_submit` | form submit attempt | `cta_origin` |
| `lead` | lead accepted by API | `lead_id`, campaign fields |
| `begin_checkout` | immediately before Even3 redirect | `lead_id`, price=320, currency=BRL |
| `checkout_redirect_failed` | redirect could not proceed | error category |
| `map_open` | route/maps CTA | section |
| `group_interest` | group CTA | group section |
| `whatsapp_support_click` | support CTA | section |

## Server event
### `purchase`
Trigger only after Even3 authoritative sale approval.
Parameters:
- internal lead ID;
- Even3 sale/registration correlation ID if safe;
- value 320 only if the approved transaction corresponds to the R$320 event ticket; otherwise use actual authoritative value if available;
- currency `BRL`;
- attribution copied from lead;
- event timestamp.

## Meta
Browser:
- PageView
- ViewContent
- Lead
- InitiateCheckout

Server/CAPI recommended:
- Purchase

Deduplicate browser/server event pairs with `event_id` if the same event is intentionally emitted both ways.

## GA4
Recommended mappings:
- `generate_lead`
- `begin_checkout`
- `purchase`
- custom engagement events listed above.

## Attribution persistence
At landing load:
1. read UTM + click IDs;
2. persist first touch and latest touch in local/session storage as appropriate;
3. submit attribution with lead;
4. backend becomes source of truth for that lead’s known attribution.

## QA
Before launch validate with:
- GA4 DebugView;
- Meta Pixel Helper/test events;
- a full test lead with known UTM values;
- a real sandbox/test purchase flow if Even3 supports a safe test method, otherwise controlled low-risk production verification coordinated with organizer.
