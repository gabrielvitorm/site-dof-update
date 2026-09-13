# Regras obrigatórias do projeto

## 1. Produto e oferta
- O produto principal é o ingresso para o DOF Update 2026.
- O evento principal acontece em 03/10/2026, presencialmente, no Auditório da FAESA, em Vitória/ES.
- O pré-evento/workshop acontece em 02/10/2026.
- O valor informado para o último lote do evento principal é R$ 320.
- A landing page é oficial e fala com todo o público profissional do evento, não apenas uma especialidade.
- O workshop é oferta complementar e possui inscrição própria. Nunca sugerir que esteja incluído automaticamente no ingresso principal.

## 2. Comunicação
- Tom: científico, premium, informativo, clínico, seguro e profissional.
- Evitar linguagem sensacionalista, promessas clínicas absolutas e gatilhos artificiais.
- A urgência deve vir de fatos reais: último lote, evento presencial, data fixa, vagas disponíveis e ausência de gravação.
- Nunca inventar palestrantes, titulações, endereços, hotéis, agenda, certificados, benefícios, parcelamento ou quantidade de vagas.
- Todo conteúdo não confirmado deve aparecer explicitamente como placeholder.

## 3. Conversão
- Todo CTA principal de compra abre minicaptura antes do checkout.
- Campos mínimos: nome, WhatsApp e e-mail.
- Após captura bem-sucedida, direcionar para checkout oficial Even3.
- Falha temporária da captura não pode bloquear indefinidamente a compra; deve existir fallback seguro.
- Não processar pagamento na aplicação própria.

## 4. Even3
- Even3 é sistema oficial de checkout/inscrição.
- Preferir link direto do ingresso do último lote quando houver um único ingresso principal ativo.
- Compra só é considerada confirmada com evento server-side confiável da Even3.
- Redirect do navegador nunca confirma pagamento.
- Webhooks devem ser idempotentes e tolerar eventos fora de ordem.

## 5. Dados e privacidade
- Capturar apenas dados necessários ao funil.
- Não armazenar dados de cartão, Pix ou credenciais de pagamento.
- Segredos nunca devem ir para frontend ou repositório.
- Respeitar consentimento/base legal aplicável às comunicações.
- Não enviar WhatsApp promocional para contato sem base adequada.

## 6. Tracking
- Persistir UTMs e click IDs quando presentes.
- Registrar `cta_origin` em todos os CTAs de conversão.
- Purchase só pode ser emitido após confirmação server-side.
- Valor de purchase deve vir do evento aprovado, não ser presumido quando houver múltiplos produtos.

## 7. Arquitetura
- Frontend React/Vite/TypeScript.
- Backend Fastify/Node/TypeScript.
- PostgreSQL como fonte de estado do funil.
- n8n orquestra automações; não é fonte primária de estado de negócio.
- Deploy em VPS via Docker Compose + Nginx.

## 8. Qualidade
- Mobile-first.
- Performance é requisito de conversão.
- Componentes e conteúdo devem ser data-driven quando fizer sentido.
- TDD para regras de negócio e integrações críticas.
- Nenhum deploy sem smoke test do funil completo.
