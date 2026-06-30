'use client'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'R$ 99',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        '✓ 1 instância WhatsApp',
        '✓ 10k mensagens/mês',
        '✓ 2 integrações',
        '✓ Suporte por email',
        '✓ Dashboard básico',
      ],
      cta: 'Começar Grátis',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 'R$ 299',
      period: '/mês',
      description: 'Para agências e empresas',
      features: [
        '✓ Até 5 instâncias',
        '✓ 100k mensagens/mês',
        '✓ Todas as integrações',
        '✓ Suporte prioritário',
        '✓ API completa',
        '✓ Webhooks customizados',
        '✓ SSO/SAML',
      ],
      cta: 'Começar Teste Grátis',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Customizado',
      period: '',
      description: 'Para grandes operações',
      features: [
        '✓ Instâncias ilimitadas',
        '✓ Mensagens ilimitadas',
        '✓ Todas integrações',
        '✓ Suporte 24/7 dedicado',
        '✓ On-premise option',
        '✓ SLA 99.99%',
        '✓ Consultoria incluída',
      ],
      cta: 'Contatar Vendas',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planos para todos os tamanhos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece grátis, escale conforme cresce. Sem surpresas.
          </p>
        </div>

        {/* Toggle Annual/Monthly */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className="text-gray-700 font-medium">Mensal</span>
          <button className="relative inline-flex h-8 w-14 bg-gray-300 rounded-full">
            <div className="w-7 h-7 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform"></div>
          </button>
          <span className="text-gray-500">Anual</span>
          <span className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
            Economize 20%
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-2 border-orange-400 shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-yellow-300 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ MAIS ESCOLHIDO
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={plan.highlighted ? 'text-gray-300' : 'text-gray-600'}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className={`text-sm font-medium ${
                      plan.highlighted ? 'text-gray-100' : 'text-gray-700'
                    }`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 px-4 font-bold rounded-lg transition-all ${
                  plan.highlighted
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </button>

              {/* Footnote */}
              <p className={`text-xs mt-4 text-center ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                Sem cartão de crédito. 14 dias grátis.
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Dúvidas sobre preço?{' '}
            <a href="#faq" className="text-emerald-600 font-semibold hover:underline">
              Veja nosso FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
