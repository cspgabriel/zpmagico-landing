'use client'

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Registre-se em 2 minutos',
      description: 'Crie sua conta e acesse o dashboard instantaneamente',
      icon: '📧',
    },
    {
      number: '2',
      title: 'Configure suas integrações',
      description: 'Conecte Evolution, Dify, Typebot, Chatwoot em poucos cliques',
      icon: '🔌',
    },
    {
      number: '3',
      title: 'Crie suas instâncias',
      description: 'Adicione suas contas WhatsApp e configure webhooks',
      icon: '📱',
    },
    {
      number: '4',
      title: 'Automatize e escale',
      description: 'Use fluxos, IA e automação para crescer sem limites',
      icon: '🚀',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Começar é simples
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Do zero ao herói em 4 passos
          </p>
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[calc(50%+2rem)] right-[calc(-50%-2rem)] h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
              )}

              <div className="relative">
                {/* Number Circle */}
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-yellow-400 text-gray-900 text-2xl font-bold rounded-full flex items-center justify-center mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg hover:border-orange-300 transition">
                  <p className="text-4xl mb-3">{step.icon}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video CTA */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-12 text-white text-center border border-orange-400/30">
          <p className="text-4xl mb-4">🎬</p>
          <h3 className="text-2xl font-bold mb-3">Veja uma Demo ao Vivo</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Assista como criamos uma automação completa WhatsApp + Dify + Chatwoot em menos de 10 minutos
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-gray-900 font-bold rounded-lg transition">
            ▶️ Assistir Demo Gratuita
          </button>
        </div>
      </div>
    </section>
  )
}
