# WhatsApp Gabriel Pessoal — Evolution API + Postgres

Stack Docker para operar o **WhatsApp pessoal do Gabriel** via API e **arquivar todas as conversas** em banco SQL próprio.

Não usa OpenClaw. Stack enxuto e isolado:

| Serviço | Imagem | Papel |
|---|---|---|
| **evolution-api** | `atendai/evolution-api:v2.2.3` | Conecta o WhatsApp (Baileys), expõe API REST, envia/recebe mensagens |
| **postgres** | `postgres:16-alpine` | Banco dedicado — persiste **todas** as conversas, contatos e chats |
| **redis** | `redis:7-alpine` | Cache de sessão/estado (performance) |

---

## Arquitetura

```
   WhatsApp (celular)
        │  QR Code (Aparelhos conectados)
        ▼
┌─────────────────┐     ┌──────────────┐
│  evolution-api  │────▶│   postgres   │  ← histórico completo
│   :8080 (REST)  │     │    :5432     │
└────────┬────────┘     └──────────────┘
         │
         ▼
   ┌──────────┐
   │  redis   │  ← cache
   └──────────┘
```

Portas expostas no host:
- `8080` → Evolution API + Manager web
- `5432` → Postgres (consulta direta das conversas)

---

## Pré-requisitos

- **Docker Desktop** instalado e **rodando** (o daemon precisa estar ativo).
- Celular com WhatsApp pra escanear o QR Code.

---

## Subir o stack

Dentro de `evolution-stack/`:

```bash
docker compose up -d
docker compose logs -f evolution-api   # acompanhar boot (cria tabelas via Prisma)
```

Na primeira subida o Postgres inicializa o banco e a Evolution cria automaticamente as tabelas (`Message`, `Chat`, `Contact`, etc.) via Prisma. Não há schema manual.

---

## Conectar o WhatsApp

A API key fica no `.env` (`EVOLUTION_API_KEY`) e vai no header `apikey`.

```bash
# 1. Criar a instância
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: <EVOLUTION_API_KEY>" -H "Content-Type: application/json" \
  -d '{"instanceName":"gabriel","integration":"WHATSAPP-BAILEYS","qrcode":true}'

# 2. Pegar o QR Code e escanear em: WhatsApp > Aparelhos conectados
curl http://localhost:8080/instance/connect/gabriel -H "apikey: <EVOLUTION_API_KEY>"
```

Ou use o **Manager web**: http://localhost:8080/manager (cole a API key).

---

## Enviar mensagem

```bash
curl -X POST http://localhost:8080/message/sendText/gabriel \
  -H "apikey: <EVOLUTION_API_KEY>" -H "Content-Type: application/json" \
  -d '{"number":"5521999999999","text":"Olá!"}'
```

---

## Consultar as conversas no Postgres

```bash
docker exec -it evolution_postgres psql -U evolution -d evolution
```

```sql
\dt                                  -- listar tabelas

-- últimas 50 mensagens
SELECT "key", "pushName", "messageType", "message", "messageTimestamp"
FROM "Message" ORDER BY "messageTimestamp" DESC LIMIT 50;

SELECT * FROM "Chat" LIMIT 50;       -- conversas
SELECT * FROM "Contact" LIMIT 50;    -- contatos
```

Backup do banco:

```bash
docker exec evolution_postgres pg_dump -U evolution evolution > backup.sql
```

---

## Parar / resetar

```bash
docker compose stop            # pausa (mantém tudo)
docker compose down            # remove containers (mantém dados nos volumes)
docker compose down -v         # APAGA TUDO — banco + sessão do WhatsApp
```

---

## Configuração

Variáveis em `.env` (**não versionado** — está no `.gitignore`):

| Variável | Descrição |
|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credenciais do banco dedicado |
| `EVOLUTION_API_KEY` | Chave de autenticação da API (header `apikey`) |

Veja `.env.example` para o modelo. Todas as flags `DATABASE_SAVE_*` no compose estão ligadas, garantindo histórico completo (mensagens novas, updates, contatos, chats, labels, histórico).

---

## Troubleshooting

| Problema | Causa / solução |
|---|---|
| `failed to connect to the docker API` | Docker Desktop não está rodando. Abra o app e espere o daemon. |
| Porta 8080 ocupada | Outro serviço usando a porta. Altere o mapeamento em `docker-compose.yml`. |
| QR Code expira | A Evolution gera novo QR; chame `/instance/connect/<instância>` de novo. |
| Tabelas não aparecem | Veja os logs (`docker compose logs evolution-api`); o Prisma cria no primeiro boot. |
| Sessão caiu | WhatsApp desconecta após inatividade longa; reconecte via QR. |

---

## Estrutura

```
evolution-stack/
├── docker-compose.yml   # definição dos 3 serviços
├── .env                 # segredos (gitignored)
├── .env.example         # modelo das variáveis
├── .gitignore
└── README.md
```

## Notas
- Imagem fixada em `atendai/evolution-api:v2.2.3` para evitar breaking changes.
- Stack 100% local — nada exposto à internet sem você configurar.
- Objetivo atual: **receber/enviar + arquivar**. Resposta automática por IA (webhook) fica para uma fase futura.
