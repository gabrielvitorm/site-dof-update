# Even3 Integration

## Decision
Even3 is the payment and participant-registration system of record. The custom platform never handles card/Pix/boleto payment details.

## Checkout link
Even3 currently supports:
- a link to the list of available registration entries;
- a direct payment/registration link generated for each entry;
- a registration widget/button option.

For this project, prefer the direct payment link for the active last-lot entry because it removes a selection step. Use the list link only when multiple tickets must be chosen by the visitor.

Official reference: https://ajuda.even3.com.br/hc/pt-br/articles/19702766275739-Disponibilizar-link-de-inscri%C3%A7%C3%A3o-no-meu-evento

## Webhook events required
Configure at minimum:
- Venda iniciada;
- Venda aprovada;
- Venda reprovada;
- Venda cancelada/reembolsada;
- Participante com inscrição pendente no evento;
- Participante com inscrição confirmada no evento;
- Participante com inscrição cancelada no evento.

Official reference: https://ajuda.even3.com.br/hc/pt-br/articles/37014614126107-Como-funciona-o-Webhook-Even3

## Delivery semantics that affect implementation
The official help article documents:
- HTTP POST delivery;
- a unique identifier per dispatch;
- 2xx as successful response;
- retries after failed/timeout deliveries;
- delayed pending-registration webhooks in some scenarios;
- purchase and registration events as separate concepts;
- registration/ticket code available to relate event records.

Therefore:
1. store the unique delivery ID;
2. make the handler idempotent;
3. do not assume chronological delivery;
4. never downgrade `PURCHASED` because a delayed pending event arrives;
5. correlate by registration/ticket code where available, then email/phone;
6. return quickly after persistence.

## Authentication strategy
Public documentation reviewed does not establish a universal cryptographic signature header. Use:
- an unguessable URL secret;
- strict schema validation;
- rate limiting;
- HTTPS;
- accepted-event allowlist;
- optional additional auth if Even3 account configuration supports it.

Do not invent a signature verification algorithm.

## API
Even3 also publishes an authenticated REST API at https://docs.even3.com.br/. API usage is optional for MVP; do not add it unless webhook reconciliation or operational needs require it.
