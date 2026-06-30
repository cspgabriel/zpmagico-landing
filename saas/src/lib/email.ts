import * as fs from 'fs';
import * as path from 'path';

interface SendEmailParams {
  to: string;
  name: string;
  loginEmail: string;
  plainPassword?: string;
  loginUrl: string;
}

/**
 * Helper para envio do e-mail de boas-vindas pós-compra do WhatsZap Mágico.
 * Lê o modelo HTML email-confirmacao.html e injeta as credenciais.
 */
export async function sendConfirmationEmail({
  to,
  name,
  loginEmail,
  plainPassword,
  loginUrl,
}: SendEmailParams): Promise<boolean> {
  try {
    // 1. Localizar e ler o arquivo de template HTML de e-mail na raiz do repositório
    // process.cwd() aponta para a pasta /saas/ no runtime Next.js; o template está na raiz (../)
    const templatePaths = [
      path.join(process.cwd(), '../email-confirmacao.html'),
      path.join(process.cwd(), 'email-confirmacao.html'), // fallback local
    ];

    let htmlTemplate = '';
    for (const p of templatePaths) {
      if (fs.existsSync(p)) {
        htmlTemplate = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!htmlTemplate) {
      console.warn("⚠️  Aviso: Template 'email-confirmacao.html' não localizado. Usando template minimalista inline.");
      htmlTemplate = `
        <h2>Acesso Liberado — WhatsZap Mágico</h2>
        <p>Olá, {{nome}}! Seu pagamento foi confirmado.</p>
        <p><strong>Seus dados de acesso:</strong></p>
        <ul>
          <li>Email: {{email_login}}</li>
          <li>Senha Temporária: {{senha_temporaria}}</li>
        </ul>
        <p>Acesse o portal e baixe o instalador.</p>
      `;
    }

    // 2. Injetar as variáveis dinamicamente no HTML do e-mail
    let htmlContent = htmlTemplate
      .replace(/{{nome}}/g, name)
      .replace(/{{email_login}}/g, loginEmail)
      .replace(/{{senha_temporaria}}/g, plainPassword || 'Sua senha cadastrada')
      .replace(/{{link_login}}/g, loginUrl);

    // Substituir também links absolutos dos bônus no domínio se necessário (caso venham via env)
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://zapmagico.agenciarmktdigital.com.br';
    htmlContent = htmlContent
      .replace(/https:\/\/zapmagico.agenciarmktdigital.com.br/g, domain);

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'contato@agenciarmktdigital.com.br';
    const senderName = process.env.SENDER_NAME || 'WhatsZap Mágico';

    // 3. Enviar e-mail de fato via API HTTP do Brevo se configurado
    if (brevoApiKey) {
      console.log(`✉️ Disparando e-mail real via Brevo API para ${to}...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to, name }],
          subject: 'Seu acesso ao WhatsZap Mágico está liberado! ⚡',
          htmlContent: htmlContent,
        }),
      });

      if (response.ok) {
        console.log(`✅ E-mail enviado com sucesso via Brevo para ${to}.`);
        return true;
      } else {
        const errText = await response.text();
        console.error(`❌ Erro no envio via Brevo API:`, errText);
      }
    }

    // 4. Caso contrário, simula no console em ambiente de desenvolvimento
    console.log('\n==================================================');
    console.log('✉️  SIMULAÇÃO DE ENVIO DE E-MAIL PÓS-PAGAMENTO');
    console.log(`Para: ${to} (${name})`);
    console.log(`Assunto: Seu acesso ao WhatsZap Mágico está liberado! ⚡`);
    console.log(`Login Email: ${loginEmail}`);
    console.log(`Senha Temporária: ${plainPassword}`);
    console.log(`URL de Acesso: ${loginUrl}`);
    console.log('==================================================\n');

    return true;
  } catch (error) {
    console.error('❌ Erro no helper de e-mail:', error);
    return false;
  }
}
