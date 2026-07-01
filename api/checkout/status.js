module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const paymentId = req.query.payment_id;
  if (!paymentId) return res.status(400).json({ error: 'Missing payment_id' });

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ error: 'MP_TOKEN_NOT_CONFIGURED' });

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'MP_STATUS_FAILED' });
    }

    const payment = await response.json();
    const payerEmail = payment.payer?.email?.toLowerCase()?.trim() || null;

    return res.status(200).json({
      status: payment.status,
      email: payerEmail,
      name: [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(' ') || null,
      tempPassword: null,
      message: payment.status === 'approved'
        ? 'Pagamento confirmado. O link do instalador foi liberado.'
        : 'O pagamento ainda não foi aprovado.',
    });
  } catch (err) {
    console.error('checkout status error:', err);
    return res.status(500).json({ error: err.message || 'STATUS_FAILED' });
  }
};
