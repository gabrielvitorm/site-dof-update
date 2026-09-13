# Even3

## Papel
Checkout oficial e sistema de inscrição. A aplicação própria não manipula pagamento.

## Estratégia de link
Preferir link direto do ingresso ativo do último lote. Se houver múltiplas entradas relevantes, usar rota de seleção/lista da Even3 ou estrutura de ingressos na landing que direcione cada opção ao link oficial correto.

## Webhooks mínimos
Configurar eventos equivalentes a:
- venda iniciada;
- venda aprovada;
- venda reprovada;
- venda cancelada/reembolsada;
- inscrição pendente;
- inscrição confirmada;
- inscrição cancelada.

## Regras do handler
- POST HTTPS.
- Validar schema.
- Allowlist de tipos.
- Identificar delivery externo quando fornecido.
- Idempotência por delivery/event ID.
- Persistir payload antes do processamento pesado.
- Responder 2xx rapidamente.
- Processamento posterior pode disparar evento interno para n8n.
- Tolerar retries.
- Tolerar eventos fora de ordem.
- Nunca rebaixar `PURCHASED` por evento pendente atrasado.

## Correlação
Prioridade:
1. ID/código de inscrição/venda da Even3;
2. e-mail normalizado;
3. telefone normalizado;
4. revisão manual quando ambígua.

## Segurança
- URL de webhook com segredo não previsível.
- Rate limit.
- HTTPS.
- Não inventar assinatura criptográfica se não estiver documentada/configurada.
- Logar tentativas inválidas sem expor dados sensíveis.
