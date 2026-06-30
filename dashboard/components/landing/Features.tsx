'use client'

export default function Features() {
  const features = [
    {
      icon: '📱',
      title: 'Múltiplas Instâncias',
      description: 'Crie e gerencie quantas contas WhatsApp precisar em um único painel',
      color: 'emerald',
    },
    {
      icon: '🔗',
      title: 'Integrações Nativas',
      description: 'Dify, Typebot, Chatwoot, OpenAI - tudo conectado e sincronizado',
      color: 'blue',
    },
    {
      icon: '⚡',
      title: 'Automação Completa',
      description: 'Fluxos automáticos de mensagens, respostas e encaminhamentos',
      color: 'purple',
    },
    {
      icon: '📊',
      title: 'Dashboard em Tempo Real',
      description: 'Visualize métricas, conexões e performance instantaneamente',
      color: 'orange',
    },
    {
      icon: '🔒',
      title: 'Segurança Enterprise',
      description: 'Criptografia, backup automático, compliance LGPD',
      color: 'red',
    },
    {
      icon: '🚀',
      title: 'Escalabilidade Infinita',
      description: 'Suporta milhões de mensagens sem queda de performance',
      color: 'cyan',
    },
  ]

  const colorClasses = {
    emerald: 'from-orange-500 to-yellow-400',
    blue: 'from-blue-600 to-indigo-600',
    purple: 'from-purple-600 to-indigo-600',
    orange: 'from-orange-500 to-red-500',
    red: 'from-pink-500 to-rose-500',
    cyan: 'from-cyan-500 to-blue-500',
  }

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recursos poderosos, design intuitivo, suporte excepcional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`inline-block p-3 rounded-lg bg-gradient-to-br ${
                  colorClasses[feature.color as keyof typeof colorClasses]
                } text-white text-3xl mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Por que Evolution Dashboard é diferente?</h3>
            <ul className="space-y-4">
              {[
                '✅ Setup em 5 minutos (não em horas)',
                '✅ Suporte técnico 24/7 em português',
                '✅ API documentada e pronta para integrações',
                '✅ Atualizações constantes e gratuitas',
                '✅ Comunidade ativa de 10k+ usuários',
                '✅ 100% open-source ou enterprise',
              ].map((item, i) => (
                <li key={i} className="text-lg text-gray-700 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white h-96 flex items-center justify-center border border-emerald-500/30">
            <div className="text-center">
              <p className="text-5xl mb-4">⚡</p>
              <p className="text-2xl font-bold mb-2">10x Mais Rápido</p>
              <p className="text-gray-300">Que gerenciar tudo manualmente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
