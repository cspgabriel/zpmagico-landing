'use client'

export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-gray-400 py-12 border-t border-purple-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">Evolution</span> Dashboard
            </h3>
            <p className="text-sm text-gray-500">
              Gestão centralizada de Evolution API + Integrações
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-orange-400 transition">
                Twitter
              </a>
              <a href="#" className="hover:text-orange-400 transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-orange-400 transition">
                GitHub
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-orange-400 transition">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-orange-400 transition">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Compliance LGPD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Segurança
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-y border-purple-900 py-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-white font-semibold mb-2">Fique atualizado</h4>
            <p className="text-sm text-gray-500 mb-4">
              Receba novidades sobre Evolution Dashboard
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-4 py-2 bg-indigo-900 border border-purple-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-gray-900 font-semibold rounded-lg transition">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 Evolution Dashboard. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Feito com ❤️ em Brasil</span>
            <span>•</span>
            <a href="#" className="hover:text-orange-400 transition">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
