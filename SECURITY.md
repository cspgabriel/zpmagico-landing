# 🔐 SECURITY — Versionamento de Segredos

> ⚠️ **ATENÇÃO**: Este repositório privado versiona arquivos `.env` por decisão
> explícita do owner para fins de **backup pessoal único**. Antes de qualquer
> publicação (mesmo sendo privado), leia esta nota.

## Arquivos `.env` versionados neste repositório

| Arquivo | Risco | Contém |
|---|---|---|
| `saas/.env` | 🔴 ALTO | `EVOLUTION_API_KEY`, `AUTH_SECRET`, `DATABASE_URL` (com senha local), seed admin |
| `docker/.env` | 🔴 ALTO | `EVOLUTION_API_KEY`, `POSTGRES_PASSWORD` local |

## Por que está assim

- Repositório é **PRIVADO** e usado só pelo owner (`@cspgabriel`) em suas máquinas pessoais
- Owner precisa de **backup centralizado** das variáveis para restaurar em qualquer máquina com `git pull`
- Chaves são de **ambiente LOCAL/SANDBOX** (Evolution API rodando em Docker local, Postgres sem exposição externa)

## Quando você NÃO deve copiar isso cegamente

- ❌ Antes de abrir o repo publicamente → **remover todos os `.env` antes**
- ❌ Antes de compartilhar com terceiros → **`git filter-repo` para remover histórico**
- ❌ Antes de deploy em produção → **gerar NOVAS chaves** (`EVOLUTION_API_KEY` da Evolution oficial, `AUTH_SECRET` novo via `openssl rand -base64 32`, `POSTGRES_PASSWORD` forte)

## Como restaurar `.env` em outra máquina

```bash
git clone <repo>
# .env já vem via git, só precisa:
cd saas && npm install
npx prisma migrate deploy   # aplica migrations no Postgres local
npm run seed               # cria admin + 2 tenants
npm run dev                # sobe dashboard em :3001
```

## Em caso de vazamento

1. **Revogar imediatamente**: trocar `EVOLUTION_API_KEY` no painel Evolution → `docker compose restart evolution-api`
2. **Trocar `AUTH_SECRET`** no `.env` → invalida todos os JWTs em circulação (todos deslogam)
3. **Trocar senha do Postgres** local (`docker/.env`) e recriar banco se necessário
4. **Limpar histórico do git** com `git filter-repo --path saas/.env --invert-paths`

---
*Última atualização: 2026-06-30 — owner @cspgabriel*
