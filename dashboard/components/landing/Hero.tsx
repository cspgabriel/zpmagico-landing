'use client'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Background Elements - Agenciar Style */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <nav className="relative z-20 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Evolution Dashboard
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-emerald-400 transition">Recursos</a>
          <a href="#pricing" className="hover:text-emerald-400 transition">Preços</a>
          <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
        </div>
        <a
          href="/app"
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
        >
          Acessar Dashboard
        </a>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-40 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Multiplique suas conexões WhatsApp
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mt-4">
            Gerencie Evolution API + Dify + Typebot + Chatwoot em um painel intuitivo. Automação inteligente, zero complexidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-300 hover:from-orange-500 hover:to-yellow-400 text-gray-900 font-bold text-lg rounded-xl transition transform hover:scale-105 shadow-xl">
              🚀 Comece Grátis
            </button>
            <button className="px-8 py-4 border-2 border-white hover:bg-white/10 text-white font-bold text-lg rounded-xl transition">
              ▶️ Ver Demo Live
            </button>
          </div>

          <p className="text-sm text-gray-400 pt-4">
            ✓ Sem cartão de crédito  ✓ 14 dias grátis  ✓ Suporte 24/7
          </p>
        </div>

        {/* Right - Dashboard Preview */}
        <div className="flex-1 relative">
          <div className="relative bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-emerald-500/30 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-t-2xl"></div>

            {/* Fake Dashboard */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded p-4">
                  <p className="text-xs text-gray-400">Instâncias Ativas</p>
                  <p className="text-2xl font-bold mt-2">5</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded p-4">
                  <p className="text-xs text-gray-400">Conexões</p>
                  <p className="text-2xl font-bold mt-2">3</p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Mensagens/Dia</span>
                  <span className="text-sm font-bold">1.250</span>
                </div>
                <div className="w-full bg-gray-600 rounded h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-400 uppercase font-semibold">Integrações</p>
                <div className="flex gap-2">
                  {['🤖', '💬', '✨', '🔗'].map((icon, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-600/50 rounded flex items-center justify-center text-lg">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="absolute -bottom-10 -right-10 bg-gradient-to-br from-orange-400 to-yellow-300 text-gray-900 p-4 rounded-xl shadow-lg max-w-xs hidden lg:block">
            <p className="font-semibold">📊 Controle Total</p>
            <p className="text-sm mt-2 text-gray-800">Integre, automatize e escale sem limites técnicos</p>
          </div>
        </div>
      </div>
    </section>
  )
}
