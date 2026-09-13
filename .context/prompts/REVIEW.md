# Prompt — Code Review

Faça uma revisão completa do trabalho atual contra `.context/`.

Prioridades:
1. bugs que quebram conversão;
2. inconsistências com regras/decisões;
3. falhas de tracking;
4. problemas de idempotência/webhook;
5. riscos de segurança/privacidade;
6. regressões mobile/performance;
7. copy divergente ou inventada;
8. ausência de testes.

Não faça elogios genéricos. Liste achados por severidade com arquivo/trecho, impacto e correção recomendada. Se não houver achados críticos, diga explicitamente o que foi validado.
