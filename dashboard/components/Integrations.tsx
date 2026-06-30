'use client'

import { useState } from 'react'

interface Integration {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  icon: string
  config?: Record<string, string>
}

interface IntegrationsProps {
  apiUrl: string
}

export default function Integrations({ apiUrl }: IntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'dify',
      name: 'Dify',
      type: 'IA / Chatbot',
      status: 'active',
      icon: '🤖',
      config: { apiKey: 'sk_***', url: 'https://api.dify.ai' },
    },
    {
      id: 'typebot',
      name: 'Typebot',
      type: 'Chatbot Builder',
      status: 'active',
      icon: '🤖',
      config: { apiKey: 'tb_***', url: 'https://typebot.co' },
    },
    {
      id: 'chatwoot',
      name: 'Chatwoot',
      type: 'CRM / Customer Support',
      status: 'inactive',
      icon: '💬',
      config: { apiKey: 'cw_***', url: 'https://chatwoot.com' },
    },
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'AI / Transcription',
      status: 'active',
      icon: '✨',
      config: { apiKey: 'sk_***', model: 'gpt-4' },
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [configFormData, setConfigFormData] = useState<Record<string, string>>({})

  const handleEdit = (integration: Integration) => {
    setEditingId(integration.id)
    setConfigFormData(integration.config || {})
  }

  const handleSave = () => {
    setIntegrations(
      integrations.map((i) =>
        i.id === editingId ? { ...i, config: configFormData } : i
      )
    )
    setEditingId(null)
  }

  const toggleStatus = (id: string) => {
    setIntegrations(
      integrations.map((i) =>
        i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
      )
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas integrações com ferramentas externas</p>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={`rounded-lg shadow p-6 border ${
              integration.status === 'active'
                ? 'bg-white border-emerald-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{integration.type}</p>
                </div>
              </div>
              <button
                onClick={() => toggleStatus(integration.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  integration.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {integration.status === 'active' ? '✓ Ativo' : '✗ Inativo'}
              </button>
            </div>

            {editingId === integration.id ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                {Object.entries(configFormData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={key === 'apiKey' ? 'password' : 'text'}
                      value={value}
                      onChange={(e) =>
                        setConfigFormData({ ...configFormData, [key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-3">
                {integration.config &&
                  Object.entries(integration.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500">{key}</p>
                      <p className="font-medium text-gray-900 truncate">{value}</p>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-3">
              {editingId === integration.id ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded transition"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(integration)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                  >
                    ✏️ Editar
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition">
                    🧪 Testar
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition">
                    🗑️ Desconectar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
