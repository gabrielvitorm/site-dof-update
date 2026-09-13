# Prompt — Deploy

Leia `.context/RULES.md`, `ARCHITECTURE.md`, `EVEN3.md`, `TRACKING.md` e `OPEN_ITEMS.md` antes de qualquer ação.

Prepare e valide deploy em VPS com Docker Compose + Nginx + HTTPS.

Checklist obrigatório:
- variáveis de ambiente presentes;
- segredos fora do repositório;
- banco com backup;
- health checks;
- migrations aplicadas;
- frontend servido com cache apropriado;
- API acessível apenas nas rotas necessárias;
- HTTPS válido;
- modal de captura funcionando;
- redirect Even3 correto;
- webhook testado;
- GA4/Meta validados;
- compra não gerada por redirect local;
- n8n não bloqueia checkout;
- smoke test mobile;
- rollback definido.

Não declare deploy concluído sem evidência dos checks executados.
