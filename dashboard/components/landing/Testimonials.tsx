'use client'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Roberto Silva',
      role: 'CEO, TechCorp',
      image: '👨‍💼',
      text: 'Evolution Dashboard aumentou nossa produtividade em 300%. Antes usávamos 5 ferramentas diferentes, agora só uma. ROI comprovado em 30 dias.',
      rating: 5,
    },
    {
      name: 'Marina Costa',
      role: 'Head of Marketing, StartupXYZ',
      image: '👩‍💼',
      text: 'O suporte em português e documentação clara fizeram toda a diferença. Começamos a usar em uma segunda-feira, enviamos primeira campanha na quarta.',
      rating: 5,
    },
    {
      name: 'Carlos Mendes',
      role: 'Founder, AgencyPro',
      image: '👨‍💻',
      text: 'Monetizamos melhor com Evolution Dashboard. Agora oferecemos esse serviço para nossos clientes. Gerou uma nova fonte de receita mensal.',
      rating: 5,
    },
    {
      name: 'Ana Paula',
      role: 'Operations Manager, E-Commerce Co.',
      image: '👩‍🔬',
      text: 'Implementamos automação com Dify + Evolution em uma semana. Tempo de resposta ao cliente caiu 80%. Clientes muito mais satisfeitos.',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O que dizem nossos clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mais de 500 empresas já transformaram suas operações
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 hover:shadow-lg hover:border-orange-300 transition"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <p className="text-3xl">{testimonial.image}</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">4.9/5</p>
            <p className="text-sm text-gray-600 mt-2">Satisfação média</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">95%</p>
            <p className="text-sm text-gray-600 mt-2">Retenção</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">2.5x</p>
            <p className="text-sm text-gray-600 mt-2">Aumento produtividade</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">30 dias</p>
            <p className="text-sm text-gray-600 mt-2">ROI</p>
          </div>
        </div>
      </div>
    </section>
  )
}
