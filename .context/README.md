# .context — DOF Update 2026

Este diretório é a fonte de verdade operacional do projeto DOF Update 2026.

## Ordem obrigatória de leitura para IAs/agentes
1. `RULES.md`
2. `PROJECT.md`
3. `DECISIONS.md`
4. `COPY.md`
5. `FUNNEL.md`
6. `ARCHITECTURE.md`
7. `DATA_MODEL.md`
8. `TRACKING.md`
9. `EVEN3.md`
10. `N8N.md`
11. `WHATSAPP.md`
12. `BRAND.md`
13. `CONTENT.md`
14. `OPEN_ITEMS.md`

## Regra central
Antes de alterar produto, copy, arquitetura, integrações ou tracking, leia este diretório e trate `RULES.md` + `DECISIONS.md` como restrições obrigatórias.

## Objetivo
Construir e operar a landing page oficial do DOF Update 2026, com foco em conversão para o último lote, minicaptura antes do checkout, atribuição de tráfego, checkout via Even3, recuperação de leads via n8n/WhatsApp e rastreamento ponta a ponta.

## Hierarquia de fontes
1. Informações oficiais fornecidas pela organização do evento.
2. `DECISIONS.md`.
3. `PROJECT.md` e `CONTENT.md`.
4. Demais arquivos deste diretório.
5. Implementação existente no repositório.

Se houver conflito, não inventar. Registrar o conflito em `OPEN_ITEMS.md` e preservar o comportamento mais seguro.

## Prompts operacionais
A pasta `prompts/` contém instruções prontas para Codex/agentes:
- `IMPLEMENT.md`
- `REVIEW.md`
- `DEPLOY.md`
- `COPY_REVIEW.md`

## Atualização deste contexto
Sempre que uma decisão importante mudar:
- atualizar `DECISIONS.md`;
- atualizar o arquivo temático correspondente;
- registrar a data e o motivo;
- remover instruções antigas conflitantes.
