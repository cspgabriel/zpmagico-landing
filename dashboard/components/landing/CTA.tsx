'use client'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Pronto para escalar suas operações WhatsApp?
        </h2>

        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Comece agora com 14 dias grátis. Sem cartão de crédito. Suporte em português.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-gray-900 font-bold text-lg rounded-lg transition transform hover:scale-105 shadow-lg">
            🚀 Começar Grátis Agora
          </button>
          <button className="px-8 py-4 border-2 border-white hover:bg-white/10 text-white font-bold text-lg rounded-lg transition">
            📞 Falar com Vendedor
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>14 dias grátis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Suporte 24/7</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 pt-12 border-t border-orange-400/30 space-y-4">
          <p className="text-gray-300 mb-6">Incluído em todos os planos:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-1">⚡ Rápido</p>
              <p className="text-gray-300">Setup em 5 minutos</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🔒 Seguro</p>
              <p className="text-gray-300">Criptografia enterprise</p>
            </div>
            <div>
              <p className="font-semibold mb-1">📈 Escalável</p>
              <p className="text-gray-300">Crescer sem limites</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
