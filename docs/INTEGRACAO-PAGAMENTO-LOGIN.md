# Documentação de Integração — Fluxo de Pagamento ➜ Login Automático ➜ Onboarding

Este documento descreve o fluxo técnico integrado de ponta-a-ponta para a aquisição da licença do **WhatsZap Mágico**:
1. O cliente realiza o pagamento na Landing Page via Mercado Pago.
2. O webhook cria a empresa (`Tenant`), a conta do cliente (`User`), a assinatura (`Subscription`) vitalícia no banco de dados **MySQL (Hostinger)** de forma assíncrona.
3. O e-mail transacional (`email-confirmacao.html`) é disparado automaticamente com a senha gerada.
4. A página de obrigado (`obrigado.html`) expõe as credenciais de acesso de forma imediata na tela do navegador, garantindo um onboarding com fricção zero.

---

## 1. Diagrama do Fluxo de Dados

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente (Navegador)
    participant LP as Landing Page (index.html)
    participant MP as Mercado Pago Checkout
    participant Webhook as API Webhook (/api/mercadopago/webhook)
    participant DB as Banco MySQL (Hostinger)
    participant Brevo as Brevo API (SMTP)
    participant Obrigado as Obrigado Page (obrigado.html)
    participant StatusAPI as API Status (/api/checkout/status)

    Cliente->>LP: Clica em "Quero meu acesso"
    LP->>MP: Inicia Preferência de Compra (R$ 97)
    MP-->>Cliente: Redireciona para tela de Pagamento
    Cliente->>MP: Realiza Pagamento (Pix / Cartão)
    MP-->>Cliente: Redireciona para obrigado.html?payment_id={id}
    
    Note over MP, Webhook: Processamento assíncrono do Webhook
    MP->>Webhook: Dispara Notificação POST (payment.approved)
    Webhook->>DB: Cria Tenant + User (com senha ZAP-XXXXXX) + Subscription
    Webhook->>Brevo: Dispara email-confirmacao.html com credenciais
    
    Note over Cliente, Obrigado: Entrada imediata na página de obrigado
    Obrigado->>StatusAPI: Consulta GET /api/checkout/status?payment_id={id}
    StatusAPI->>DB: Verifica status do usuário
    DB-->>StatusAPI: Retorna Usuário e Senha Temporária
    StatusAPI-->>Obrigado: Exibe dados de acesso na tela do cliente
    Cliente->>Obrigado: Copia Usuário/Senha e clica em "Entrar no Portal"
```

---

## 2. Configurações de Variáveis de Ambiente (`.env`)

Para colocar esse fluxo em produção (por exemplo, na Vercel), você deve cadastrar as seguintes variáveis de ambiente:

| Variável | Descrição | Valor Exemplo / Produção |
|---|---|---|
| `DATABASE_URL` | String de conexão MySQL com a Hostinger | `mysql://u306535956_zapmagicoo:senha@srv1432.hstgr.io:3306/u306535956_zapmagicoo` |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de API de produção do Mercado Pago | `APP_USR-xxxxxxxxx` |
| `BREVO_API_KEY` | Chave de API da plataforma Brevo para envio de e-mails | `xkeysib-xxxxxxxxx` |
| `SENDER_EMAIL` | Remetente dos e-mails de transação | `contato@agenciarmktdigital.com.br` |
| `SENDER_NAME` | Nome do remetente exibido na caixa de entrada | `WhatsZap Mágico` |
| `AUTH_URL` | URL raiz da aplicação SaaS/Portal | `https://zapmagico.agenciarmktdigital.com.br` |

---

## 3. Funcionamento Interno das Peças

### A. Geração de Login e Senha (`/api/checkout/status` e `/api/mercadopago/webhook`)
As rotas de API possuem inteligência para garantir a **idempotência** (não duplicar contas caso o cliente atualize a página de obrigado ou o webhook rode duas vezes):
* Se a conta já existe: A API de status apenas retorna o e-mail cadastrado e oculta a senha temporária por motivos de segurança, orientando o cliente a usar a senha que já possui.
* Se a conta não existe: O banco MySQL registra a conta instantaneamente encriptada via `bcrypt` e gera uma senha temporária legível (exemplo: `ZAP-294719`).

### B. Distribuição por E-mail (`saas/src/lib/email.ts`)
* O helper lê o template estático `email-confirmacao.html` na raiz do projeto Next.js.
* Utiliza expressões regulares para injetar os dados dinâmicos do cliente.
* Envia o e-mail via Brevo SMTP API (`https://api.brevo.com/v3/smtp/email`) se a `BREVO_API_KEY` estiver configurada.
* Se estiver rodando localmente sem a chave de e-mail, ele simulará todo o corpo do e-mail no console do terminal (`stdout`), permitindo que você veja exatamente o que seria enviado.

### C. Exibição Direta no Navegador (`obrigado.html`)
* A página de obrigado captura o ID de pagamento na URL de redirecionamento do Mercado Pago.
* Executa uma chamada `fetch` assíncrona ao servidor para descobrir as credenciais.
* Exibe a caixa de credenciais com botões de cópia rápida utilizando a Clipboard API nativa dos navegadores modernos.

---

## 4. Como Testar Localmente

1. **Subir o ambiente local:**
   Na pasta `/saas/`, rode:
   ```bash
   npm run dev
   ```
2. **Simular o fluxo de Obrigado com credenciais:**
   Acesse a URL de obrigado local passando um `payment_id` fictício (ex: `123456`):
   ```
   http://localhost:3000/obrigado.html?status=approved&payment_id=123456
   ```
3. **Validar no console:**
   Veja o console do terminal onde o Next.js está rodando. Ele exibirá a simulação do e-mail pós-pagamento com as credenciais criadas para o usuário de teste e salvará os dados no banco de dados MySQL da Hostinger.
