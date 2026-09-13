# Arquitetura técnica

## Stack aprovada
### Frontend
- React
- Vite
- TypeScript
- CSS/Tailwind conforme decisão de implementação
- SPA estática

### Backend
- Node.js
- TypeScript
- Fastify
- validação de schema
- camada de persistência PostgreSQL

### Infra
- VPS Linux
- Docker Compose
- Nginx reverse proxy
- TLS/HTTPS
- PostgreSQL
- backups regulares

### Automação
- n8n
- provedor WhatsApp desacoplado por workflow/subflow

## Componentes
### Web app
Responsável por:
- renderizar landing;
- carregar conteúdo;
- capturar atribuição;
- abrir modal;
- validar formulário no cliente;
- chamar API;
- emitir eventos browser;
- redirecionar para Even3.

### API
Responsável por:
- validar lead;
- normalizar telefone/e-mail;
- persistir atribuição;
- gerar ID interno;
- retornar checkout URL autorizado;
- receber webhooks Even3;
- garantir idempotência;
- publicar eventos internos para n8n;
- endpoints de health.

### PostgreSQL
Responsável por estado persistente:
- lead;
- atribuição;
- timeline;
- webhook deliveries;
- status de compra;
- automações/dispatches quando necessário.

### n8n
Responsável por:
- WhatsApp;
- CRM/tabelas auxiliares;
- follow-ups;
- recuperação;
- mensagens de confirmação;
- alertas operacionais.

## Princípios
- navegador nunca possui segredos;
- webhook responde rápido após persistência;
- automações assíncronas não bloqueiam checkout;
- integração externa deve tolerar retry;
- observabilidade mínima desde o primeiro deploy.
