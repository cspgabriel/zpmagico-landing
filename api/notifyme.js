const { DOWNLOAD_URL, SITE_URL, loadTemplate, render, sendBrevoEmail } = require('./_email');

async function getPayment(paymentId) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error('MP_TOKEN_NOT_CONFIGURED');

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', endpoint: 'mercadopago-webhook' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paymentId = req.body?.data?.id || req.body?.id || req.query?.id;
    if (!paymentId) return res.status(200).json({ received: true, ignored: 'missing_payment_id' });

    const payment = await getPayment(paymentId);
    if (payment.status !== 'approved') {
      return res.status(200).json({ received: true, status: payment.status });
    }

    const payerEmail = payment.payer?.email?.toLowerCase()?.trim();
    if (!payerEmail) return res.status(200).json({ received: true, ignored: 'missing_payer_email' });

    const name = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(' ') || 'Cliente Zap Mágico';
    const html = render(loadTemplate('email-confirmacao.html'), {
      nome: name,
      email_login: payerEmail,
      senha_temporaria: 'Use os dados exibidos na página de confirmação',
      link_login: `${SITE_URL}/portal-do-cliente`,
      download_url: DOWNLOAD_URL,
      site_url: SITE_URL,
    });

    await sendBrevoEmail({
      to: payerEmail,
      name,
      subject: 'Seu acesso ao WhatsZap Mágico está liberado',
      htmlContent: html,
    });

    return res.status(200).json({ received: true, emailed: true });
  } catch (err) {
    console.error('notifyme error:', err);
    return res.status(500).json({ error: err.message || 'WEBHOOK_FAILED' });
  }
};
