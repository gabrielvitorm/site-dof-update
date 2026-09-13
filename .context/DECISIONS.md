# Decisões aprovadas

## D-001 — Página oficial ampla
A landing page é oficial do evento e deve comunicar com todo o público, não ser uma página segmentada apenas para Fono/Audiologia.

## D-002 — Eixo de mensagem
Mensagem central aprovada: **“Uma imersão interprofissional para transformar evidência científica em decisões clínicas mais seguras.”**

## D-003 — Checkout permanece na Even3
Não construir checkout próprio. A aplicação captura lead e redireciona para Even3.

## D-004 — Minicaptura antes do checkout
Todo CTA principal de compra abre modal de captura com nome, WhatsApp e e-mail. O envio cria/atualiza o lead antes do redirecionamento.

## D-005 — Captura de atribuição
Armazenar UTMs, fbclid, gclid, referrer, URL, timestamp e `cta_origin`.

## D-006 — Backend próprio antes do n8n
Frontend nunca chama diretamente o n8n para registrar o estado principal do funil. O backend valida, persiste e depois despacha evento normalizado.

## D-007 — PostgreSQL como fonte de verdade
Leads, timeline, webhooks e estados críticos ficam persistidos no PostgreSQL.

## D-008 — Compra confirmada apenas server-side
Retorno do checkout não confirma venda. Confirmação vem de webhook/integração oficial Even3.

## D-009 — React/Vite para MVP
A landing é uma SPA estática de marketing em React/Vite/TypeScript, priorizando velocidade de desenvolvimento e operação simples em VPS.

## D-010 — n8n como orquestrador
n8n recebe eventos internos normalizados e dispara automações de WhatsApp, recuperação, confirmação e alertas.

## D-011 — Localização visual
A landing terá seção de localização com endereço, mapa incorporado lazy-loaded e botão de rota.

## D-012 — Copy científica e comercial equilibrada
Priorizar valor, autoridade, prática clínica e integração. Urgência entra como reforço factual, não como promessa agressiva.

## D-013 — Conteúdo sem invenção
Palestrantes, credenciais e agenda detalhada permanecem placeholders até a organização enviar dados oficiais.
