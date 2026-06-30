module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    mp_token: process.env.MERCADOPAGO_ACCESS_TOKEN ? '✓ configurado' : '✗ faltando',
    timestamp: new Date().toISOString(),
  });
};
