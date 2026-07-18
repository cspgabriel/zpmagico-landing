const fs = require('fs');
const path = require('path');

const DOWNLOAD_URL = 'https://github.com/cspgabriel/zap-magico-atendimento-agosto-2026/releases/download/v1.4.0/Zap.Magico.WPP.Web.QR.Setup.1.4.0.exe';
const SITE_URL = 'https://zapmagico.agenciarmktdigital.com.br';

function loadTemplate(fileName) {
  const p = path.join(process.cwd(), fileName);
  return fs.readFileSync(p, 'utf8');
}

function render(html, vars) {
  return Object.entries(vars).reduce(
    (out, [key, value]) => out.replace(new RegExp(`{{${key}}}`, 'g'), String(value || '')),
    html,
  );
}

async function sendBrevoEmail({ to, name, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY_NOT_CONFIGURED');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.SENDER_NAME || 'WhatsZap Mágico',
        email: process.env.SENDER_EMAIL || 'contato@agenciarmktdigital.com.br',
      },
      to: [{ email: to, name: name || to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

module.exports = {
  DOWNLOAD_URL,
  SITE_URL,
  loadTemplate,
  render,
  sendBrevoEmail,
};
