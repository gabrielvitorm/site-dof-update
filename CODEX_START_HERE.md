# Codex — Start Here

Você vai implementar a plataforma de lançamento do DOF Update 2026.

## Antes de alterar qualquer arquivo
Leia, nesta ordem:
1. `AGENTS.md`
2. `docs/superpowers/specs/2026-09-13-dof-update-launch-platform-design.md`
3. `docs/superpowers/plans/2026-09-13-dof-update-launch-platform.md`
4. `docs/architecture/api-contracts.md`
5. `docs/architecture/data-model.md`
6. `docs/integrations/even3.md`
7. `docs/analytics/tracking-plan.md`
8. `docs/qa/acceptance-tests.md`

## Modo de execução
Execute o plano tarefa por tarefa. Não tente implementar tudo em um único patch.

Para cada tarefa:
1. escreva o teste primeiro;
2. rode e confirme que falha pelo motivo esperado;
3. implemente o mínimo necessário;
4. rode teste, typecheck e lint relevantes;
5. revise o diff;
6. faça um commit pequeno e descritivo;
7. só então avance.

Se o plugin Superpowers estiver disponível, use `subagent-driven-development` para executar o plano e `verification-before-completion` antes de afirmar que terminou.

## Decisões que você NÃO deve rediscutir sem evidência nova
- React + Vite + TypeScript no frontend.
- Fastify + TypeScript no backend.
- PostgreSQL para estado do funil.
- Even3 continua sendo checkout e sistema de inscrição.
- Todos os CTAs de compra abrem minicaptura antes do checkout em operação normal.
- Falha da API não pode bloquear definitivamente a compra.
- Purchase é confirmado apenas por evento server-side da Even3.
- n8n recebe eventos normalizados do backend; o browser não chama webhook protegido diretamente.
- Comprador confirmado sai imediatamente da recuperação de checkout.

## Dados de negócio ainda aguardando substituição
Não invente estes valores. Mantenha-os centralizados em configuração/conteúdo até serem fornecidos:
- palestrantes, fotos, credenciais e bios finais;
- agenda detalhada final;
- endereço/mapa exato;
- link direto do último lote na Even3;
- link/condição final do workshop;
- número/provedor oficial do WhatsApp;
- domínio de produção;
- IDs GA4/Meta e credenciais CAPI;
- informações finais de privacidade/controlador;
- assets oficiais da marca.

## Definição de pronto
Não considere o projeto pronto apenas porque compila. A definição de pronto está em `docs/qa/acceptance-tests.md` e inclui o funil completo, idempotência Even3, fallback de checkout, analytics, suppression de comprador, HTTPS, backup e rollback.
