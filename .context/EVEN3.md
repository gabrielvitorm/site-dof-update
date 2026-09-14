# Even3

## Dev local
1. `npm run db:up` — Postgres Docker em `127.0.0.1:5432`
2. Copiar `apps/api/.env.example` → `apps/api/.env` (já versionado o exemplo)
3. `npm run db:migrate` ou subir a API (ela migra sozinha)
4. `npm run dev:api` — Fastify em `http://127.0.0.1:3001`
5. `npm run dev` — Vite com proxy `/api` → API

## Papel
Checkout oficial e sistema de inscrição. A aplicação própria não manipula pagamento.

## Estratégia de link
Cada categoria do carrossel tem URL Even3 com `idIngresso` próprio:

| Categoria | idIngresso |
|---|---|
| Profissionais | `820401` |
| Aluno de graduação | `820404` |
| Sócios ABRAFITO | `840321` |
| Profissionais evento + pré-evento | `850856` |
| Alunos evento + pré-evento | `850858` |
| Sócios ABRAFITO evento + pré-evento | `850860` |

Padrão: `https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso={id}&lang=pt`

Fluxo: CTA → minicaptura → redirect para o `checkoutUrl` do ingresso selecionado. CTAs sem categoria usam Profissionais.

Se a API de lead falhar após formulário válido, o frontend redireciona automaticamente para o `checkoutUrl` do ingresso (compra não fica bloqueada). O botão **Continuar mesmo assim** permanece como fallback manual se o redirect automático não puder ocorrer.

## Pré-preenchimento do checkout Even3
Não suportado via query string pública. O `auxcheckout/redirect` gera uma sessão (`/checkout/{uuid}?i=...`) e o formulário Angular lê do `viewModel`, não de `nome`/`email`/`telefone` na URL. Não inventar parâmetros. Se a organização quiser isso, validar com suporte Even3 ou API autenticada.

Widget Even3 (`even3-widget-ticket`) é só referência/teste; não embutir como checkout principal.

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
