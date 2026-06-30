# Sistema Pronto — Roadmap do Motor Interno do ZapMágico

**Data:** 2026-06-30
**Princípio:** **Motor antes de vitrine.** LP, signup público e onboarding wizard SÓ depois que o sistema interno estiver sólido, auditado e funcionando. Vitrine bonita em produto quebrado = queima de dinheiro.

> Este documento complementa `AUDITORIA-E-ROADMAP-SAAS-2026.md` (que foca em gaps técnicos) e define **o que precisa existir internamente antes de qualquer página pública de aquisição**.

---

## 1. O que significa "Sistema Pronto"

"istema pronto" = um SaaS multi-tenant que:

1. **Autentica** usuários (admin e cliente) sem expor credenciais
2. **Isola tenants de verdade** (servidor decide, nunca o cliente)
3. **Roda produção** (Postgres, HTTPS, observabilidade, backup)
4. **Cobra** (billing real com Asaas/Stripe)
6. **Funciona end-to-end** (cliente conecta WhatsApp, recebe/envia mensagens, gerencia contatos, dispara campanhas, paga)
7. **Expõe API** (REST + webhooks out autenticados por API Key)
8. **Tem admin** da Agenciar (você) pra gerenciar todos os clientes

**NÃO inclui (Fase 2 — vitrine):**
- Landing page pública
- Signup público
- Onboarding wizard
- OAuth Google
- Blog / Docs públicos
- SEO / marketing analytics

---

## 2. Estrutura de Rotas (Next.js App Router)

```
app/
├── (auth)/                     ← Login (admin + cliente via convite)
│   └── login/page.tsx
│
├── (app)/                      ← Portal do CLIENTE (autenticado)
│   ├── dashboard/page.tsx      # métricas DELE
│   ├── whatsapp/page.tsx       # QR codes DELE pra parear
│   ├── contacts/page.tsx       # CRM DELE
│   ├── chat/page.tsx           # inbox DELE
│   ├── campaigns/page.tsx      # disparos DELE
│   ├── billing/page.tsx        # plano, faturas, cartão/PIX
│   ├── settings/page.tsx       # equipe, perfil, API keys DELE, webhooks out
│   └── support/page.tsx        # tickets DELE
│
├── (admin)/                    ← Painel ADMIN da Agenciar (você)
│   ├── admin/
│   │   ├── tenants/page.tsx    # lista clientes, plano, status
│   │   ├── billing/page.tsx    # MRR, churn, faturas globais
│   │   ├── support/page.tsx    # fila de tickets
│   │   └── metrics/page.tsx    # uso da plataforma
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── public/                 ← REST API pro CLIENTE (auth via API Key DELE)
    │   ├── instances/route.ts
    │   ├── messages/route.ts
    │   ├── contacts/route.ts
    │   └── webhooks/route.ts
    └── webhooks/
        ├── evolution/route.ts  # IN: webhook da Evolution
        └── asaas/route.ts      # IN: webhook de pagamento
```

**Separação de layouts:**
- `(auth)` — sem sidebar, layout minimalista
- `(app)` — sidebar do cliente, header com nome/plano/logout
- `(admin)` — sidebar diferente, marca "Admin", acesso restrito por role

---

## 3. Schema Prisma — Tabelas Novas

Estender `saas/prisma/schema.prisma`:

```prisma
// ─── Auth (NextAuth) ────────────────────────────────────────
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  emailVerified   DateTime?
  name            String?
  image           String?
  passwordHash    String?  // bcrypt; null se veio de OAuth
  role            UserRole @default(CLIENT)  // ADMIN | CLIENT
  tenantId        String   // 1 user pertence a 1 tenant (cliente); admin tem tenantId próprio
  tenant          Tenant   @relation(fields: [tenantId], references: [id])

  accounts        Account[]
  sessions        Session[]
  apiKeys         CustomerApiKey[]
  tickets         SupportTicket[]
  auditLogs       AuditLog[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([tenantId])
}

enum UserRole { ADMIN CLIENT }

model Account { /* NextAuth OAuth provider account */ }
model Session { /* NextAuth session */ }
model VerificationToken { /* NextAuth reset password */ }

// ─── Billing ────────────────────────────────────────────────
model Plan {
  id              String   @id @default(cuid())
  slug            String   @unique  // starter | pro | enterprise
  name            String
  priceCents      Int      // em centavos (evitar float)
  interval        PlanInterval  // MONTHLY | YEARLY
  maxInstances    Int      // limite de instâncias WhatsApp
  maxMessagesPerMonth Int
  features        String   // JSON: array de flags (campaigns, api_access, etc)
  isActive        Boolean  @default(true)
  subscriptions   Subscription[]
  createdAt       DateTime @default(now())
}

enum PlanInterval { MONTHLY YEARLY }

model Subscription {
  id                  String   @id @default(cuid())
  tenantId            String   @unique  // 1 assinatura ativa por tenant
  tenant              Tenant   @relation(fields: [tenantId], references: [id])
  planId              String
  plan                Plan     @relation(fields: [planId], references: [id])
  status              SubscriptionStatus  // ACTIVE | PAST_DUE | CANCELED | TRIALING
  asaasSubscriptionId String?  @unique  // ID no gateway
  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime
  cancelAtPeriodEnd   Boolean  @default(false)
  invoices            Invoice[]
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

enum SubscriptionStatus { ACTIVE PAST_DUE CANCELED TRIALING PENDING }

model Invoice {
  id              String   @id @default(cuid())
  subscriptionId  String
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
  tenantId        String
  amountCents     Int
  status          InvoiceStatus  // PENDING | PAID | OVERDUE | REFUNDED
  asaasInvoiceId  String?  @unique
  dueDate         DateTime
  paidAt          DateTime?
  pdfUrl          String?
  createdAt       DateTime @default(now())
}

enum InvoiceStatus { PENDING PAID OVERDUE REFUNDED CANCELED }

// ─── API do Cliente ─────────────────────────────────────────
model CustomerApiKey {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  userId      String   // quem criou
  user        User     @relation(fields: [userId], references: [id])
  name        String   // ex: "Integração CRM Pipedrive"
  keyHash     String   @unique  // SHA-256 da chave (nunca a chave em plain)
  prefix      String   // primeiros 8 chars pra exibir "zap_xxx..."
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  revokedAt   DateTime?
  createdAt   DateTime @default(now())

  @@index([tenantId])
}

model WebhookSubscription {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  url         String
  events      String   // CSV: "message.received,instance.connected"
  secretHash  String   // HMAC secret pra assinar
  isActive    Boolean  @default(true)
  lastDeliveryAt DateTime?
  failureCount   Int    @default(0)
  createdAt   DateTime @default(now())

  @@index([tenantId])
}

// ─── Suporte ────────────────────────────────────────────────
model SupportTicket {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  userId      String   // quem abriu
  user        User     @relation(fields: [userId], references: [id])
  subject     String
  status      TicketStatus  // OPEN | WAITING_CUSTOMER | WAITING_AGENT | CLOSED
  priority    TicketPriority  // LOW | NORMAL | HIGH | URGENT
  messages    TicketMessage[]
  createdAt   DateTime @default(now())
  closedAt    DateTime?
}

enum TicketStatus { OPEN WAITING_CUSTOMER WAITING_AGENT CLOSED }
enum TicketPriority { LOW NORMAL HIGH URGENT }

model TicketMessage {
  id        String   @id @default(cuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  authorType AuthorType  // CUSTOMER | AGENT | SYSTEM
  authorId  String   // userId
  content   String
  createdAt DateTime @default(now())
}

enum AuthorType { CUSTOMER AGENT SYSTEM }

// ─── Observabilidade / Compliance ──────────────────────────
model UsageMetric {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  metric      String   // "messages_sent", "messages_received", "instance_connected"
  value       Int      @default(1)
  metadata    String?  // JSON opcional
  periodStart DateTime  // início do bucket (hora, dia, mês)
  createdAt   DateTime @default(now())

  @@index([tenantId, metric, periodStart])
}

model AuditLog {
  id          String   @id @default(cuid())
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id])
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  action      String   // "instance.created", "billing.subscription.canceled"
  targetType  String?  // "WhatsAppInstance", "Subscription"
  targetId    String?
  metadata    String?  // JSON
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([tenantId, createdAt])
  @@index([userId, createdAt])
}
```

**Migrações necessárias:**
1. Adicionar `User` com `tenantId` como FK
2. Adicionar `Tenant.ownerId` referenciando `User` (nullable para tenants legados)
3. Adicionar todas as tabelas novas
4. Backfill: criar 1 `User` admin pra cada `Tenant` existente (seed)

---

## 4. Camadas Críticas

### 4.1 Autenticação

**Stack:** NextAuth v5 (Auth.js) + Credentials Provider + bcrypt + JWT session

**Regras:**
- Senha: bcrypt cost 12, mínimo 10 caracteres (validar no signup)
- Session: JWT com expiração 7 dias, refresh sliding
- **Sem signup público** (por enquanto): cliente é criado pelo admin via convite (`POST /admin/tenants/[id]/invite` gera link de ativação)
- Admin: `User.role = ADMIN`, tenant dedicado "agenciar-internal"
- Cliente: `User.role = CLIENT`, vinculado ao `tenantId` real

**Arquivos novos:**
- `saas/src/lib/auth.ts` — config NextAuth
- `saas/src/lib/password.ts` — bcrypt helpers
- `saas/src/app/api/auth/[...nextauth]/route.ts`
- `saas/src/app/(auth)/login/page.tsx`
- `saas/src/middleware.ts` — protege rotas `(app)` e `(admin)`

### 4.2 Tenant Isolation (não confiar no cliente)

**REGRA DE OURO:** em TODA rota `/api/*` ou page em `(app)` ou `(admin)`, o `tenantId` vem **sempre** de `session.user.tenantId`. O frontend nunca manda tenantId — se mandar, é ignorado.

**Helper central** (`saas/src/lib/tenant-context.ts`):

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

export async function requireTenant() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');
  return {
    user: session.user,
    tenantId: session.user.tenantId,
    isAdmin: session.user.role === 'ADMIN',
  };
}
```

**Refatorar todas as rotas existentes** pra usar `requireTenant()` em vez de aceitar `tenantId` no body/query.

### 4.3 Billing (Asaas)

**Por que Asaas primeiro:** PIX nativo, BR, sem海外 cartão de crédito obrigatório.

**Fluxo:**
1. Admin cria `Plan` no banco (Starter R$99/mês, Pro R$299/mês, Enterprise sob consulta)
2. Cliente (no painel billing) clica "Assinar Pro"
3. Backend chama Asaas: `POST /v3/customers` (cria customer), depois `POST /v3/subscriptions` (cria assinatura)
4. Webhook Asaas (`/api/webhooks/asaas`) recebe `PAYMENT_RECEIVED` / `PAYMENT_OVERDUE` / `SUBSCRIPTION_DELETED` e atualiza `Subscription` e `Invoice`
5. Cliente pode cancelar: `POST /v3/subscriptions/{id}/cancel` + `cancelAtPeriodEnd = true`

**Variáveis de ambiente:**
```bash
ASAAS_API_KEY=...
ASAAS_WEBHOOK_TOKEN=...  # pra validar assinatura do webhook
ASAAS_ENVIRONMENT=sandbox  # sandbox | production
```

**Arquivos novos:**
- `saas/src/lib/asaas.ts` — client SDK wrapper
- `saas/src/app/api/webhooks/asaas/route.ts`
- `saas/src/app/(app)/billing/page.tsx`
- `saas/src/app/admin/billing/page.tsx`

### 4.4 Portal do Cliente

Reaproveitar componentes visuais que já existem (Sidebar, Tailwind, etc.) e adicionar:

| Rota | Conteúdo | API |
|---|---|---|
| `/dashboard` | KPIs: msgs hoje, instâncias conectadas, contatos novos, próxima cobrança | `GET /api/public/metrics` |
| `/whatsapp` | Lista instâncias do tenant + QR Code pra parear | `GET /api/public/instances` `POST /api/public/instances` |
| `/contacts` | Lista paginada + busca + tags | `GET/POST/PATCH/DELETE /api/public/contacts` |
| `/chat` | Inbox estilo WhatsApp Web | `GET /api/public/chats` `GET /api/public/messages/[contactId]` `POST /api/public/messages` |
| `/campaigns` | Criar disparo, ver histórico | `GET/POST /api/public/campaigns` |
| `/billing` | Plano atual, faturas, botão "Mudar plano", botão "Cancelar" | `GET /api/public/billing` `POST /api/public/billing/change-plan` `POST /api/public/billing/cancel` |
| `/settings` | Perfil, equipe (convidar membros), API keys (gerar/revogar), Webhooks out (configurar URL) | `GET/POST/DELETE /api/public/api-keys` `GET/POST/DELETE /api/public/webhook-subscriptions` |
| `/support` | Abrir ticket, ver tickets anteriores | `GET/POST /api/public/tickets` `POST /api/public/tickets/[id]/messages` |

### 4.5 Admin da Agenciar

| Rota | Conteúdo |
|---|---|
| `/admin/tenants` | Tabela com todos os tenants: nome, plano, status, MRR, último acesso. Ações: criar tenant, suspender, convidar user |
| `/admin/billing` | MRR total, churn rate, novas assinaturas/mês, faturas pendentes globais |
| `/admin/support` | Fila de tickets (ordenada por prioridade), responder ticket |
| `/admin/metrics` | msgs/min globais, instâncias ativas totais, uso de storage, custos Evolution |

### 4.6 API Pública do Cliente

**Base path:** `/api/public/*`
**Auth:** header `Authorization: Bearer zap_xxxxxxxxxxxx` (API Key do `CustomerApiKey`)
**Rate limit:** 100 req/min por key (depois ajustar por plano)

**Endpoints principais:**

```
GET    /api/public/instances
POST   /api/public/instances                  { name, webhookUrl? }
DELETE /api/public/instances/:name
GET    /api/public/instances/:name/qr         (retorna base64)

POST   /api/public/messages                   { instanceName, to, message }
GET    /api/public/messages?instanceName=...&limit=50

GET    /api/public/contacts?search=...
POST   /api/public/contacts
PATCH  /api/public/contacts/:id
DELETE /api/public/contacts/:id

POST   /api/public/campaigns                  { name, instanceName, contacts[], template }
GET    /api/public/campaigns
GET    /api/public/campaigns/:id               (com progresso)
```

**Webhook OUT do cliente:**
- Cliente cadastra URL em `/settings` → eventos: `message.received`, `message.sent`, `instance.connected`, `instance.disconnected`
- Backend dispara POST pra URL do cliente com payload JSON + header `X-ZapMagico-Signature: sha256=...` (HMAC do body usando `WebhookSubscription.secretHash`)
- Retry: 3 tentativas com backoff exponencial (1min, 5min, 30min). Após 3 falhas, marca `failureCount++` e desativa se chegar em 10.

### 4.7 Migração SQLite → Postgres

**Por quê:** SQLite não aguenta multi-instance, não tem tipos avançados, backup é copiar arquivo.

**Como:**
1. Criar DB no Postgres que já roda (porta 5435): `zapmagico_saas`
2. Trocar `provider = "postgresql"` no `schema.prisma`
3. Trocar `DATABASE_URL` no `.env`: `postgresql://evolution:565d3b31fb50ce4f2ca6af00abd54e8b@localhost:5435/zapmagico_saas`
4. Rodar `npx prisma migrate dev --name init-postgres`
5. Script de backfill: ler SQLite antigo e inserir no Postgres (rodar 1x)

### 4.8 Segurança

- **API Key Evolution** vai pro `.env` do servidor. Nunca mais no frontend. Remover do `page.tsx` hardcoded.
- **HTTPS obrigatório** em produção (Caddy com auto-TLS via Let's Encrypt)
- **Helmet** / CSP headers
- **Rate limiting** por tenant (Upstash Ratelimit ou Redis direto)
- **Audit log** em toda ação sensível (criar/deletar instância, mudar plano, login)
- **Criptografia em repouso** dos secrets (variáveis de ambiente + considerar Vault/SOPS depois)

### 4.9 Observabilidade mínima

- **Sentry** (errors + performance)
- **Logs estruturados** com `pino` (não `console.log`)
- **Health check endpoint** `/api/health` (verifica DB, Redis, Evolution)
- **Uptime monitoring** (UptimeRobot ou similar)

---

## 5. Ordem de Implementação (passo a passo)

**Sprint 1 — Fundação (3-4 dias)**
1. Adicionar todas as tabelas novas no Prisma schema
2. Migrar SQLite → Postgres
3. NextAuth funcional: login admin + login cliente (sem signup público)
4. Middleware protegendo `(app)` e `(admin)`
5. Refatorar todas as rotas pra usar `requireTenant()` (tenant isolation real)
6. Mover API key Evolution pro `.env`
7. Health check endpoint

**Sprint 2 — Portal do Cliente (4-5 dias)**
1. Layout `(app)` com sidebar do cliente + header
2. `/whatsapp` (QR Code do cliente) — reaproveita lógica que já existe, só troca fonte do `tenantId`
3. `/dashboard` (métricas via `UsageMetric`)
4. `/contacts` (CRM completo com paginação/busca)
5. `/chat` (inbox estilo WhatsApp Web)
6. `/settings` (perfil + equipe)
7. `/support` (abrir/listar tickets)

**Sprint 3 — Billing (3-4 dias)**
1. Tabelas Plan/Subscription/Invoice
2. Seed de planos iniciais (Starter, Pro, Enterprise)
3. Integração Asaas (criar customer, criar subscription, webhook de pagamento)
4. `/billing` do cliente (ver plano, faturas, mudar plano, cancelar)
5. `/admin/billing` (MRR, churn, faturas globais)

**Sprint 4 — Admin + API Pública (4-5 dias)**
1. Layout `(admin)` com sidebar admin
2. `/admin/tenants` (criar, suspender, convidar user)
3. `/admin/support` (fila de tickets, responder)
4. `/admin/metrics` (uso da plataforma)
5. API REST `/api/public/*` (instances, messages, contacts, campaigns)
6. Customer API Keys (gerar/revogar com prefix visível)
7. Webhook Subscriptions (cadastrar URL, assinar com HMAC, retry com backoff)

**Sprint 5 — Campanhas + Produção (3-4 dias)**
1. `/campaigns` do cliente (criar disparo, acompanhar progresso)
2. BullMQ + Redis pra fila de campanhas
3. Caddy reverse proxy + HTTPS
4. Sentry + logs estruturados
5. CI/CD (GitHub Actions: lint, typecheck, build, deploy)
6. Backup automatizado do Postgres
7. LGPD banner + página de export/delete de dados

**Total estimado: 18-22 dias úteis (1 dev solo)**

---

## 6. Critérios de Pronto

O "Sistema Pronto" tá pronto quando:

- [ ] Admin consegue criar tenant, convidar cliente, ver na lista
- [ ] Cliente recebe convite, define senha, entra no portal
- [ ] Cliente vê APENAS as próprias instâncias/contatos/mensagens (tenant isolation validado com 2 tenants de teste)
- [ ] Cliente conecta WhatsApp via QR Code (pareamento funciona)
- [ ] Cliente envia e recebe mensagens reais
- [ ] Cliente cria campanha e disparo acontece via fila
- [ ] Cliente assina plano Starter via Asaas (sandbox), webhook atualiza `Subscription.status = ACTIVE`
- [ ] Cliente cancela assinatura, próxima fatura não é gerada
- [ ] Cliente gera API Key, usa `curl` pra listar instâncias via `/api/public/instances`
- [ ] Cliente cadastra webhook out, recebe POST quando mensagem chega
- [ ] Admin vê MRR, churn, tickets em `/admin/*`
- [ ] HTTPS funcionando (Caddy)
- [ ] Logs em Sentry, sem erros 500
- [ ] CI verde, build de produção sem warnings
- [ ] Backup diário do Postgres rodando

**Quando tudo isso estiver ✅, AÍ SIM começa a vitrine (LP, signup público, onboarding wizard).**

---

## 7. Próximos Passos Imediatos

1. **Aprovar este roadmap**
2. **Eu começo pelo Sprint 1 (Fundação)** — schema + auth + tenant isolation + migração Postgres
3. A cada sprint, commit + push + você valida no GitHub
4. Quando Sprint 5 fechar, sistema tá pronto e vitrine entra na fila

Quer que eu já comece pelo Sprint 1 agora?