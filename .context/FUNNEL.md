# Funil de conversão

## Fluxo principal
Tráfego pago/orgânico → Landing → CTA de compra → Modal de minicaptura → API → Persistência → Evento para n8n → Redirect Even3 → Webhook Even3 → Atualização do lead → Automação pós-evento do funil.

## Estados conceituais
1. `VISITOR`
2. `HIGH_INTENT` quando abre minicaptura
3. `LEAD_CAPTURED`
4. `CHECKOUT_REDIRECTED`
5. `SALE_STARTED` quando confirmado pela Even3, se disponível
6. `PURCHASED`
7. `SALE_FAILED`
8. `CANCELLED_REFUNDED`

## Regras
- Um visitante pode gerar vários cliques, mas deve haver uma identidade interna de lead após captura.
- E-mail e telefone normalizados ajudam deduplicação.
- Compra confirmada suprime imediatamente recuperação.
- Eventos Even3 fora de ordem não podem regredir estado terminal mais forte sem regra explícita.

## CTA origins mínimos
- `hero`
- `why_participate`
- `audience`
- `scientific_pillars`
- `program`
- `speakers`
- `differentiators`
- `workshop`
- `offer`
- `location`
- `faq`
- `final_cta`

## Recuperação
Elegibilidade deve ser recalculada antes de cada envio.
Nunca assumir que alguém ainda não comprou com base apenas em ausência de redirect local.

## Grupos
CTA de grupos não usa o mesmo checkout individual. Registrar interesse e direcionar ao formulário oficial.

## Workshop
É funil complementar. Se houver link próprio, tratar como produto/rota de conversão distinta do ingresso principal.
