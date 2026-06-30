# ZAP MÁGICO OFICIAL 2026 — Evolution API Multi-Tenant SaaS

Este repositório contém a stack completa de serviços para rodar o seu próprio SaaS Multi-Conta integrado à **Evolution WhatsApp API**.

A arquitetura foi projetada para permitir o deploy simplificado diretamente no seu servidor (VPS).

---

## Estrutura do Repositório

* **/docker**: Contém o arquivo `docker-compose.yml` para subir o ecossistema da Evolution API (Evolution API + Postgres + Redis).
* **/dashboard**: Painel oficial da Evolution API para gerenciar instâncias e configurações globais de forma administrativa.
* **/saas**: O código-fonte da aplicação SaaS (Next.js 15, Tailwind CSS, TypeScript), contendo a lógica de isolamento de contas (tenants), geração de instâncias dinâmicas e disparo de mensagens.
* **/docs**: Documentos arquiteturais detalhando o funcionamento multi-tenant e roteamento de webhooks.

---

## Como Rodar no Servidor (VPS)

### Passo 1: Subir a Evolution API (Docker)

1. Certifique-se de que o Docker e Docker Compose estão instalados no servidor.
2. Acesse o diretório docker:
   ```bash
   cd docker
   ```
3. Crie e ajuste o arquivo de variáveis de ambiente `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Suba os containers em segundo plano:
   ```bash
   docker compose up -d
   ```
5. A Evolution API estará disponível na porta `8083`.

### Passo 2: Rodar o Dashboard Administrativo

O dashboard serve para você, como administrador do SaaS, gerenciar o status global da Evolution.

1. Acesse o diretório dashboard:
   ```bash
   cd ../dashboard
   ```
2. Instale as dependências e inicie o projeto:
   ```bash
   npm install
   npm run build
   npm start
   ```
3. O painel estará disponível por padrão na porta `3000`. Acesse e aponte para `http://localhost:8083` usando a API Key Master configurada no `.env` do Docker.

### Passo 3: Rodar a Aplicação SaaS

Este é o software final que os seus clientes acessarão.

1. Acesse o diretório saas:
   ```bash
   cd ../saas
   ```
2. Instale as dependências e rode em modo de desenvolvimento ou produção:
   ```bash
   npm install
   
   # Para rodar em produção:
   npm run build
   PORT=3001 npm start
   
   # Para rodar em desenvolvimento:
   PORT=3001 npm run dev
   ```
3. O SaaS estará disponível na porta `3001`.
4. Os clientes poderão selecionar suas contas (simuladas na tela por tenants), criar suas instâncias WhatsApp dedicadas e disparar mensagens de teste diretamente do navegador.

---

## Lógica de Isolamento Multi-Conta (Multi-Tenant)

Toda a arquitetura de banco de dados e controle de rotas de API está detalhadamente planejada em:
[docs/architecture_multi_tenant_saas.md](docs/architecture_multi_tenant_saas.md)

Cada Tenant do SaaS cria uma instância WhatsApp com o prefixo `saas_tenant_{id_da_conta}` na Evolution API. Os webhooks de recebimento de mensagens e atualizações de status são roteados de forma inteligente fazendo o parse desse prefixo no backend da aplicação Next.js.
