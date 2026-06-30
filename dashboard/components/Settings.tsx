'use client'

import { useState, useEffect } from 'react'

interface SettingsProps {
  apiUrl: string
  onApiUrlChange: (url: string) => void
}

export default function Settings({ apiUrl, onApiUrlChange }: SettingsProps) {
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl)
  const [apiKey, setApiKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('evolutionApiKey')
    if (saved) setApiKey(saved)
    const savedSecret = localStorage.getItem('webhookSecret')
    if (savedSecret) setWebhookSecret(savedSecret)
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem('evolutionApiUrl', tempApiUrl)
    localStorage.setItem('evolutionApiKey', apiKey)
    localStorage.setItem('webhookSecret', webhookSecret)
    onApiUrlChange(tempApiUrl)
    setSaveMessage('Configurações salvas com sucesso!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as configurações do seu sistema</p>
      </div>

      {saveMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
          ✓ {saveMessage}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Connection Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conexão API</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL da API Evolution</label>
              <input
                type="url"
                value={tempApiUrl}
                onChange={(e) => setTempApiUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <p className="text-xs text-gray-500 mt-1">Endereço do servidor Evolution API</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key Global</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua chave de API"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <p className="text-xs text-gray-500 mt-1">Chave de autenticação para a API</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Seu webhook secret"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <p className="text-xs text-gray-500 mt-1">Chave para validar requisições de webhook</p>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Banco de Dados</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600">
                <option>PostgreSQL</option>
                <option>MySQL</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Banco de dados utilizado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connection String</label>
              <input
                type="password"
                placeholder="postgresql://user:password@host:5432/database"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <p className="text-xs text-gray-500 mt-1">String de conexão com o banco</p>
            </div>
          </div>
        </div>

        {/* Cache Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cache</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Redis</label>
                <p className="text-sm text-gray-500">Usar Redis para cache</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition">
                Habilitado
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Redis</label>
              <input
                type="text"
                placeholder="redis://localhost:6379"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Webhook Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Webhook Base</label>
              <input
                type="url"
                placeholder="https://seu-servidor.com/webhooks"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Ressinatura HMAC</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Validar webhooks com HMAC SHA256</p>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Retry automático</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Reenviar webhooks falhados automaticamente</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            💾 Salvar Configurações
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
            🧪 Testar Conexão
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition">
            ↻ Reiniciar Serviço
          </button>
        </div>
      </div>
    </div>
  )
}
