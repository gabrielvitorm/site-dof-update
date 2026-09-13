# n8n — automações

## Boundary
O backend é dono do estado de negócio. n8n é dono da orquestração.

## Evento interno padrão
Estrutura sugerida:
```json
{
  "eventId": "uuid",
  "eventType": "lead.captured",
  "occurredAt": "ISO-8601",
  "lead": {
    "id": "uuid",
    "name": "Maria",
    "email": "maria@example.com",
    "phone": "+5527999999999",
    "status": "LEAD_CAPTURED"
  },
  "attribution": {
    "utmSource": "meta",
    "utmCampaign": "ultimo-lote",
    "ctaOrigin": "hero"
  }
}
```

## WF-01 Lead captured
Trigger: `lead.captured`.
- upsert contato;
- registrar origem;
- opcionalmente enviar mensagem informativa aprovada;
- idempotência.

## WF-02 Checkout recovery
Trigger: lead elegível / venda iniciada sem aprovação.
Antes de enviar:
- consultar status atual;
- abortar se PURCHASED;
- abortar se comunicação não for permitida;
- abortar se janela/template já enviado;
- registrar envio.

## WF-03 Payment failed
Mensagem útil com rota oficial para nova tentativa ou suporte.

## WF-04 Purchase confirmed
- cancelar recuperação;
- marcar comprador;
- confirmação/boas-vindas;
- preparar lembretes logísticos.

## WF-05 Cancellation/refund
- interromper comunicações exclusivas de comprador quando necessário;
- sinalizar suporte/operação;
- não reativar aquisição automaticamente.

## Observabilidade
Monitorar:
- execução;
- falhas;
- retries;
- mensagens;
- duplicatas suprimidas;
- compradores suprimidos de recuperação.
