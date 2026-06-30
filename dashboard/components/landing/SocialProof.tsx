'use client'

export default function SocialProof() {
  const companies = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'StartupXYZ', logo: '🚀' },
    { name: 'AgencyPro', logo: '🎨' },
    { name: 'E-Commerce', logo: '🛍️' },
    { name: 'CloudService', logo: '☁️' },
    { name: 'RetailHub', logo: '🏪' },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 border-y border-purple-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-700 font-semibold mb-8 text-lg">
          Confiado por <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">500+ empresas</span> em todo Brasil
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {companies.map((company, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition"
            >
              <span className="text-4xl mb-2">{company.logo}</span>
              <p className="text-sm font-medium text-gray-700 text-center">{company.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-emerald-600">500+</p>
            <p className="text-gray-600 mt-2">Empresas usando</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">50K+</p>
            <p className="text-gray-600 mt-2">Mensagens por hora</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">99.9%</p>
            <p className="text-gray-600 mt-2">Uptime garantido</p>
          </div>
        </div>
      </div>
    </section>
  )
}
