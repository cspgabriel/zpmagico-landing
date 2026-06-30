# Evolution Dashboard

Dashboard centralizado para gerenciar Evolution API com integrações nativas:
- **Dify** - IA/Chatbot
- **Typebot** - Chat Builder
- **Chatwoot** - CRM/Customer Support
- **OpenAI** - Transcription & AI

## Quick Start

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Features

✅ **Dashboard** - Visão geral com estatísticas em tempo real
✅ **Instâncias WhatsApp** - Criar, gerenciar e monitorar conexões
✅ **Integrações** - Ativar/desativar e configurar serviços
✅ **Configurações** - API URL, webhooks, banco de dados

## Arquitetura

```
components/
├── Sidebar.tsx       - Menu de navegação
├── Dashboard.tsx     - Visão geral
├── Instances.tsx     - Gerenciamento de instâncias
├── Integrations.tsx  - Configuração de integrações
└── Settings.tsx      - Configurações globais

app/
├── page.tsx          - Home com roteamento
├── layout.tsx        - Layout principal
└── globals.css       - Estilos Tailwind
```

## Configuração

1. Defina a URL da Evolution API em **Configurações**
2. Configure suas integrações (Dify, Typebot, Chatwoot, OpenAI)
3. Crie e gerencie suas instâncias WhatsApp

## Build

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)

---

**Versão:** 1.0.0  
**Status:** Production Ready
