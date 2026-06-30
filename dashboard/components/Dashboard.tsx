'use client'

import { useEffect, useState } from 'react'

interface DashboardProps {
  apiUrl: string
}

interface Stats {
  totalInstances: number
  activeConnections: number
  messagesPerDay: number
  integrations: number
}

export default function Dashboard({ apiUrl }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalInstances: 0,
    activeConnections: 0,
    messagesPerDay: 0,
    integrations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Placeholder: será implementado com dados reais da API
        setStats({
          totalInstances: 5,
          activeConnections: 3,
          messagesPerDay: 1250,
          integrations: 4,
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [apiUrl])

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number | string }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu sistema Evolution</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="📱" label="Instâncias" value={stats.totalInstances} />
        <StatCard icon="🔗" label="Conexões Ativas" value={stats.activeConnections} />
        <StatCard icon="💬" label="Mensagens/Dia" value={stats.messagesPerDay} />
        <StatCard icon="🔌" label="Integrações" value={stats.integrations} />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrations Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrações Ativas</h2>
          <div className="space-y-3">
            {[
              { name: 'Dify', status: 'conectado', icon: '🤖' },
              { name: 'Typebot', status: 'conectado', icon: '🤖' },
              { name: 'Chatwoot', status: 'conectado', icon: '💬' },
              { name: 'OpenAI', status: 'conectado', icon: '✨' },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span>{integration.icon}</span>
                  <span className="font-medium text-gray-900">{integration.name}</span>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition">
              + Nova Instância
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
              📊 Configurar Integrações
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition">
              📝 Visualizar Logs
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition">
              ⚙️ Configurações Avançadas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
