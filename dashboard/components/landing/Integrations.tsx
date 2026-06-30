'use client'

export default function Integrations() {
  const integrations = [
    {
      name: 'Dify',
      type: 'IA / Chatbot Builder',
      icon: '🤖',
      description: 'Crie chatbots com IA sem código',
      benefits: ['Workflows IA', 'Prompt engineering', 'Training de dados'],
    },
    {
      name: 'Typebot',
      type: 'Visual Chat Designer',
      icon: '🎨',
      description: 'Construa fluxos conversacionais visualmente',
      benefits: ['Drag & drop', 'Sem código', 'Condicional'],
    },
    {
      name: 'Chatwoot',
      type: 'CRM / Support',
      icon: '💬',
      description: 'Gerencie conversas e suporte ao cliente',
      benefits: ['Inbox unificada', 'CRM integrado', 'Automação'],
    },
    {
      name: 'OpenAI',
      type: 'AI / Transcription',
      icon: '✨',
      description: 'Poder de GPT-4 e transcription',
      benefits: ['GPT-4', 'Audio transcription', 'Embeddings'],
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Integrado com suas ferramentas favoritas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evolution Dashboard é compatível com os principais players do mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {integrations.map((integration, i) => (
            <div
              key={i}
              className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl hover:shadow-lg hover:border-orange-300 transition"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{integration.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{integration.type}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{integration.description}</p>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Benefícios</p>
                <div className="flex flex-wrap gap-2">
                  {integration.benefits.map((benefit, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-white border border-purple-300 rounded-full text-sm font-medium text-gray-700"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-gray-900 font-semibold rounded-lg transition">
                Conectar {integration.name}
              </button>
            </div>
          ))}
        </div>

        {/* More Integrations Coming */}
        <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl text-center">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            🚀 Mais integrações em breve
          </p>
          <p className="text-gray-600 mb-4">
            Zapier, Make, N8N, Flowise e mais 50+ ferramentas
          </p>
          <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition">
            Ver Roadmap Completo
          </button>
        </div>
      </div>
    </section>
  )
}
