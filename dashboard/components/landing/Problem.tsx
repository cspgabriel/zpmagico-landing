'use client'

export default function Problem() {
  const problems = [
    {
      icon: '🔴',
      title: 'Múltiplas plataformas',
      description: 'Perder tempo alternando entre Evolution, Dify, Typebot e Chatwoot',
    },
    {
      icon: '⚠️',
      title: 'Falta de integração',
      description: 'APIs desconectadas, dados fragmentados, falta de automação',
    },
    {
      icon: '💰',
      title: 'Custos elevados',
      description: 'Pagar por múltiplas subscriptions quando podia ser uma solução',
    },
    {
      icon: '🐌',
      title: 'Configuração complexa',
      description: 'Horas perdidas em setup, documentação confusa, suporte lento',
    },
    {
      icon: '📉',
      title: 'Sem visibilidade',
      description: 'Impossível acompanhar métricas consolidadas em tempo real',
    },
    {
      icon: '🚫',
      title: 'Escalabilidade limitada',
      description: 'Sistema trava quando volume de mensagens cresce',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Você enfrenta esses <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">problemas</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A maioria das empresas que usam Evolution API desperdiça tempo e dinheiro com ferramentas desconectadas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <div
              key={i}
              className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:shadow-lg hover:border-orange-300 transition"
            >
              <p className="text-3xl mb-3">{problem.icon}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-8 rounded-xl">
          <p className="text-xl font-semibold text-gray-900">
            💡 <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Resultado:</span> Você perde produtividade, gasta mais do que deveria e não consegue crescer.
          </p>
        </div>
      </div>
    </section>
  )
}
