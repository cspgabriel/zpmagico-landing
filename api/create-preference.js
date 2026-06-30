const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ error: 'MP_TOKEN_NOT_CONFIGURED' });

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: 'zpmagico-license',
          title: 'WhatsZap Mágico — Licença Vitalícia',
          description: 'Automação inteligente para WhatsApp com disparo em massa, IA 24h, extratores e proteção anti-ban.',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 97,
        },
      ],
      payment_methods: {
        installments: 12,
        default_installments: 1,
      },
      auto_return: 'approved',
      back_urls: {
        success: 'https://zapmagico.agenciarmktdigital.com.br/obrigado',
        failure: 'https://zapmagico.agenciarmktdigital.com.br/',
        pending: 'https://zapmagico.agenciarmktdigital.com.br/',
      },
      statement_descriptor: 'WHATSZAP MAGICO',
      notification_url: 'https://zapmagico.agenciarmktdigital.com.br/api/notifyme',
    };

    const result = await preference.create({ body });
    return res.status(200).json({ init_point: result.init_point, preference_id: result.id });
  } catch (err) {
    console.error('MP error:', err);
    return res.status(500).json({ error: err.message || 'MP_CREATE_FAILED' });
  }
};
