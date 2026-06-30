# Auditoria & Roadmap para SaaS Real — ZapMágico Oficial 2026

**Data:** 2026-06-30
**Autor:** Mavis (auditoria técnica assistida)
**Status:** Protótipo multi-tenant funcional — **ainda NÃO é SaaS de produção**

---

## 1. Sumário Executivo

O ZapMágico tem a **base arquitetural correta** para um SaaS multi-tenant de WhatsApp (isolamento por `tenantId`, modelagem Prisma sólida, integração com Evolution API funcionando ponta-a-ponta). Dois bugs críticos recentes — *"servidor não conecta"* e *"não gera nova instância"* — foram **identificados, corrigidos e validados em ambiente real**.

Contudo, o produto atual é um **protótipo** que roda na máquina do desenvolvedor. Para virar um SaaS comercializável de verdade, há **17 gaps** distribuídos em 3 níveis de criticidade. Este documento lista cada gap, justifica o risco e propõe um roadmap de 3 fases.

---

## 2. Estado Atual (Validado em 2026-06-30)

| Componente | Estado | Como foi validado |
|---|---|---|
| Docker (Evolution API + Postgres + Redis) | ✅ UP — porta 8083 | `docker ps` + `curl localhost:8083/instance/fetchInstances` |
| saas/ (Next.js 16.2.9) | ✅ UP — porta 3001 | `curl localhost:3001/whatsapp` retorna HTML 200 |
| API key entre `.env` (Docker) e app | ✅ Consistente | `c575447a...c7ec` presente em ambos |
| Geração de QR Code | ✅ Funciona | `POST /api/instances` → `GET /connect/{name}` retorna `base64` válido |
| Webhook Evolution → SaaS | ✅ Registrado automaticamente | `GET /webhook/find/{name}` retorna `enabled: true` |
| Reconciliação de status | ✅ Implementada | `GET /api/instances` mescla status real da Evolution com SQLite |
| Persistência SQLite | ✅ Schema multi-tenant | `prisma/schema.prisma` com `Tenant`, `WhatsAppInstance`, `Contact`, `ChatMessage` |
| Isolamento de tenant | ❌ **Cosmético apenas** | `tenantId` vem do `<select>` do frontend — back-end aceita o que o cliente manda |

---

## 3. Causa Raiz dos Bugs Recentes

### 3.1 — *"Servidor não conecta / não gera nova instância"*

**Sintoma:** ao acessar `http://localhost:3001/whatsapp`, a UI carrega mas a lista de conexões fica vazia e o botão "Nova Conexão" nunca cria instância.

**Diagnóstico:**

1. **Porta 3001 sequestrada** — o processo que ocupava a porta 3001 era `@modelcontextprotocol/server-pdf` (servidor MCP de PDF), não o Next.js do `saas/`. O dev server do `saas/` estava morto. **Matar o processo MCP liberou a porta e o painel voltou.**
2. **Webhook nunca era registrado na Evolution** — `POST /instance/create` no `route.ts` mandava o payload do webhook **sem o campo `enabled: true`**, obrigatório na Evolution API 2.3.7. Resultado: webhook silenciosamente desativado, `connection.update` nunca chegava ao SaaS, status da instância ficava eternamente "Desconectado".
3. **Status dessincronizado** — `GET /api/instances` lia apenas do SQLite. Se o webhook caísse, o status ficava congelado até reiniciar tudo.

### 3.2 — *"Falha ao gerar QR Code"*

**Sintoma:** alert "Falha ao gerar QR Code" sempre que clicava em "Mostrar QR Code".

**Causa raiz:** o frontend lia `data.qrcode.base64`, mas a Evolution 2.3.7 retorna o QR **na raiz do objeto** (`{ base64, code, pairingCode }`).

### 3.3 — Fixes Aplicados

| Arquivo | Mudança | Commit |
|---|---|---|
| `saas/src/app/whatsapp/page.tsx` | Normaliza leitura do QR: `data.base64 \|\| data.qrcode?.base64 \|\| data.qrcode` | pendente |
| `saas/src/app/api/instances/route.ts` | Adiciona `enabled: true` no payload do webhook + reconcilia status com `fetchInstances` da Evolution | pendente |

**Validação end-to-end executada:**

```bash
# 1. Criar instância via SaaS
POST /api/instances {instanceName: "saas_tenant_alfa_smoke", ...}
→ 200 {"instanceName":"saas_tenant_alfa_smoke", ...}

# 2. Confirmar que webhook foi registrado na Evolution
GET /webhook/find/saas_tenant_alfa_smoke
→ {"enabled":true, "url":"http://host.docker.internal:3001/api/webhook", "events":[...]}

# 3. Buscar QR Code
GET /instance/connect/saas_tenant_alfa_smoke
→ {"base64":"data:image/png;base64,iVBORw0KGgo...", "code":"2@HmFk...", "pairingCode":null}
```

---

## 4. Auditoria: O que Falta para ser SaaS de Verdade

### 🔴 CRÍTICO — Vaza dinheiro, dados ou credenciais

| # | Gap | Impacto | Onde |
|---|---|---|---|
| 1 | **API key da Evolution hardcoded no `page.tsx`** | Vazou no Git. Qualquer pessoa com acesso ao repo controla TODAS as instâncias de todos os clientes. | `saas/src/app/whatsapp/page.tsx:14` |
| 2 | **API key também em `localStorage`** | Exposta a qualquer XSS. Atacante lê o storage e ganha acesso à Evolution. | `saas/src/app/whatsapp/page.tsx:42-46` |
| 3 | **Sem autenticação de usuário** | Qualquer pessoa com a URL acessa o painel. "Gabriel (Admin)" é HTML estático no `Sidebar.tsx`. | `saas/src/components/Sidebar.tsx` |
| 4 | **Isolamento de tenant é cosmético** | `tenantId` vem do `<select>` do frontend. Cliente A troca pra "beta" e vê **todas** as conexões, contatos e mensagens do Cliente B. **Vazamento total entre clientes.** | `saas/src/app/api/instances/route.ts:7`, `route.ts:38` |
| 5 | **Sem billing/cobrança** | Não tem como cobrar. Plano "Enterprise" é apenas um badge HTML. Stripe/Asaas/Pagar.me — nenhum integrado. | Global |
| 6 | **Sem HTTPS/TLS** | Em produção, credenciais trafegam em texto puro. Qualquer MITM captura a API key. | Deploy |

### 🟠 IMPORTANTE — Quebra em escala

| # | Gap | Impacto |
|---|---|---|
| 7 | **SQLite local** | 1 arquivo por deploy. Não escala horizontal. Não funciona com múltiplas réplicas. |
| 8 | **Sem rate limiting** | Cliente (ou atacante) dispara 1000 requests e derruba o servidor e a Evolution. |
| 9 | **Sem fila de mensagens** | Disparo em massa trava o processo. `POST /messages` precisa de BullMQ + Redis. |
| 10 | **Sem retry/idempotência** | Webhook perdido = status trava. Mensagem reenviada = duplica no banco. |
| 11 | **Sem reconexão automática** | Quando o WhatsApp cai (ban, internet), o SaaS não detecta nem tenta reconectar. |
| 12 | **Sem logs estruturados/observabilidade** | Só `console.log`. Quando der bug em produção, fica no escuro. Sem Sentry, sem APM. |

### 🟡 MELHORIAS — Importante mas não bloqueia lançamento

| # | Gap | Impacto |
|---|---|---|
| 13 | **Zero testes automatizados** | Refatorar = rezar. |
| 14 | **Sem CI/CD** | Deploy manual. Qualquer um merge sem review quebra produção. |
| 15 | **Sem LGPD/Terms/DPA** | Risco jurídico sério vendendo SaaS B2B no Brasil. |
| 16 | **Schema Prisma com gaps** | Faltam `User`, `Plan`, `Subscription`, `Invoice`, `ApiKey`, `AuditLog`. |
| 17 | **Sem backup automatizado** | Se o SQLite corromper, perde tudo. |

---

## 5. Roadmap Priorizado

### 🟢 FASE 1 — Blindagem (1-2 dias)
*Objetivo: parar de vazar dados e credenciais.*

- [ ] Mover API key da Evolution para `.env` do servidor (Next.js) — nunca mais no frontend
- [ ] `.env.example` documentado, `.env` no `.gitignore` (✅ já está)
- [ ] Autenticação real: NextAuth (credentials provider) com email/senha + bcrypt
- [ ] Adicionar `User` ao schema Prisma, vincular `Tenant` a `ownerId`
- [ ] **Tenant isolation no servidor**: ignorar `tenantId` do request, buscar do `session.user.tenantId`
- [ ] Validar em todas as rotas (`/api/instances`, `/api/contacts`, `/api/messages`, `/api/webhook`)
- [ ] Middleware Next.js para redirecionar não-autenticado para `/login`

### 🟡 FASE 2 — Produto Cobrável (1 semana)
*Objetivo: poder vender e cobrar.*

- [ ] Integração de pagamento: **Asaas** (BR, PIX + cartão + boleto) ou **Stripe** (cartão internacional)
- [ ] Adicionar ao schema: `Plan`, `Subscription`, `Invoice`, `PaymentMethod`
- [ ] Planos: Starter (1 instância, 500 msgs/mês), Pro (5 instâncias, 5k msgs), Enterprise (ilimitado)
- [ ] Enforcement: bloquear criação de instância se exceder limite do plano
- [ ] Dashboard de uso por tenant (instâncias ativas, msgs/mês, próximas cobranças)
- [ ] **Migrar SQLite → Postgres** (já tem Postgres rodando pra Evolution, é só apontar Prisma pra `5435`)
- [ ] Tela de billing no painel (`/billing`) com histórico de faturas

### 🔵 FASE 3 — Produção Séria (2-3 semanas)
*Objetivo: aguentar clientes pagantes sem cair.*

- [ ] **HTTPS obrigatório** (Caddy ou Traefik com Let's Encrypt automático)
- [ ] **Domínio próprio** + DNS configurado
- [ ] **Rate limiting por tenant** (Upstash Ratelimit ou middleware próprio com Redis)
- [ ] **Fila de mensagens** (BullMQ + Redis que já existe)
- [ ] **Retry exponencial + idempotência** em webhooks e envios
- [ ] **Observabilidade**: Sentry (errors), OpenTelemetry/APM (latência), logs estruturados (pino)
- [ ] **CI/CD**: GitHub Actions — lint, type-check, build, deploy automático
- [ ] **Testes**: Vitest (unit), Playwright (E2E), cobertura mínima 60%
- [ ] **LGPD**: banner de cookies, página de Terms, Privacy Policy, DPA, exportação/eliminação de dados do usuário
- [ ] **Backup automatizado** diário do Postgres (criptografado, off-site)
- [ ] **Audit log**: registrar toda ação sensível (criar/deletar instância, mudar plano, login)

---

## 6. Stack Técnica Atual vs Recomendada

| Camada | Atual | Recomendado (Fase 3) |
|---|---|---|
| Frontend | Next.js 16.2.9 + Tailwind 4 | ✅ Manter |
| Backend | Next.js API Routes | ✅ Manter (mover lógica pesada pra Route Handlers nomeados) |
| Banco | SQLite local | Postgres 16 (já rodando em Docker, porta 5435) |
| ORM | Prisma 5 | ✅ Manter |
| Auth | Nenhum | NextAuth.js + bcrypt + JWT session |
| Billing | Nenhum | Asaas (BR) ou Stripe (internacional) |
| Fila | Nenhuma | BullMQ + Redis (já rodando em Docker) |
| Observabilidade | console.log | Sentry + pino + OpenTelemetry |
| CI/CD | Nenhum | GitHub Actions |
| Reverse proxy / TLS | Nenhum | Caddy (auto-TLS) ou Traefik |
| Testes | Nenhum | Vitest + Playwright |

---

## 7. Próximos Passos Imediatos

1. **Hoje:** revisar e aprovar este documento
2. **Amanhã:** implementar Fase 1 completa (eu mesmo, em ~2-3h de trabalho)
3. **Esta semana:** implementar Fase 2 (billing + Postgres migration)
4. **Próximas 2-3 semanas:** Fase 3 (produção séria)

> **Recomendação do auditor:** não tente lançar com clientes pagantes antes de completar pelo menos a Fase 1. Os gaps #1, #2 e #4 representam risco de **vazamento de dados entre clientes** — uma falha dessas destrói a empresa antes de ela começar.

---

## Anexo A — Comandos Úteis

```bash
# Subir tudo do zero (ordem importa)
iniciar_docker.bat    # Evolution API + Postgres + Redis (porta 8083)
iniciar_saas.bat      # Next.js (porta 3001)
iniciar_dashboard.bat # Dashboard Evolution (porta 8080)

# Verificar saúde dos serviços
docker ps
curl http://localhost:8083/instance/fetchInstances -H "apikey: $EVOLUTION_API_KEY"
curl http://localhost:3001/whatsapp

# Criar instância de teste
curl -X POST http://localhost:3001/api/instances \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"saas_tenant_alfa_smoke","tenantId":"alfa","apiUrl":"http://localhost:8083","apiKey":"..."}'

# Buscar QR Code
curl "http://localhost:3001/api/whatsapp?route=/instance/connect/saas_tenant_alfa_smoke" \
  -H "x-api-url: http://localhost:8083" \
  -H "x-api-key: ..."
```

## Anexo B — Documentos Relacionados

- [Sistema Pronto — Roadmap do Motor Interno](./SISTEMA-PRONTO-ROADMAP.md) — **LEIA PRIMEIRO**: define o que falta do motor antes da vitrine (LP/auth público/onboarding). Estrutura de rotas, schema Prisma completo, ordem de implementação em sprints.
- [Architecture Multi-Tenant](./architecture_multi_tenant_saas.md) — documento original com modelagem de dados e fluxo de webhooks
- [Evolution API Docs](https://doc.evolution-api.com/) — referência da API
- [NextAuth.js](https://next-auth.js.org/) — autenticação recomendada para Next.js
- [Asaas](https://docs.asaas.com/) — gateway de pagamento brasileiro
- [LGPD](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd) — Lei Geral de Proteção de Dados

---

## Princípio de Ordem: Motor Antes de Vitrine

Este roadmap de 3 fases foca no **motor técnico** (auth, billing, multi-tenant, observabilidade). Vitrine (LP, signup público, onboarding wizard, OAuth Google) **só vem depois** que o motor estiver sólido. Detalhes completos em [SISTEMA-PRONTO-ROADMAP.md](./SISTEMA-PRONTO-ROADMAP.md).