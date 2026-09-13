# Tracking e atribuição

## Objetivos
Medir desde a origem do tráfego até a compra confirmada e permitir otimização de mídia.

## Eventos browser
### page_view
Landing carregada.

### view_content
Primeira renderização significativa da oferta.

### cta_click
Parâmetro obrigatório: `cta_origin`.

### lead_form_open
Modal de minicaptura aberto.

### lead_form_submit
Tentativa de envio.

### lead
Emitir apenas quando API aceitar a captura. Incluir `lead_id`.

### begin_checkout
Emitir imediatamente antes do redirecionamento para Even3 após captura válida.
Parâmetros: lead_id, currency BRL, price 320 apenas quando o ingresso direcionado for efetivamente o de R$320.

### checkout_redirect_failed
Falha ao obter/abrir o checkout.

### map_open
Clique para rota/localização.

### group_interest
Clique em condição para grupos.

### whatsapp_support_click
Clique em suporte.

## Evento server-side
### purchase
Somente após confirmação autoritativa da Even3.
Incluir:
- lead_id;
- external correlation IDs seguros;
- valor real aprovado;
- moeda;
- UTMs conhecidas;
- click IDs conhecidos;
- timestamp.

## Meta
Browser:
- PageView
- ViewContent
- Lead
- InitiateCheckout

Server/CAPI recomendado:
- Purchase

Usar event_id para deduplicação quando o mesmo evento for emitido browser/server.

## GA4
- generate_lead
- begin_checkout
- purchase
- eventos customizados de engajamento.

## Persistência
Ao abrir landing:
- capturar UTMs/click IDs;
- salvar first touch se inexistente;
- atualizar latest touch;
- enviar ambos na minicaptura.
