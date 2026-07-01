const { DOWNLOAD_URL, SITE_URL, loadTemplate, render, sendBrevoEmail } = require('./_email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const to = req.body?.to || req.query?.to;
  const name = req.body?.name || 'Gabriel';
  if (!to) return res.status(400).json({ error: 'Missing recipient' });

  const allowed = String(process.env.ALLOWED_LAUNCH_EMAILS || 'cspgabriel@outlook.com.br')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(String(to).toLowerCase())) {
    return res.status(403).json({ error: 'Recipient not allowed' });
  }

  try {
    const html = render(loadTemplate('email-lancamento.html'), {
      site_url: SITE_URL,
      download_url: DOWNLOAD_URL,
    });

    const result = await sendBrevoEmail({
      to,
      name,
      subject: 'Lançamento: WhatsZap Mágico já está no ar',
      htmlContent: html,
    });

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('send launch email error:', err);
    return res.status(500).json({ error: err.message || 'EMAIL_SEND_FAILED' });
  }
};
