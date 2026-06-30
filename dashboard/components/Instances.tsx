'use client'

import { useState } from 'react'

interface Instance {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'connecting'
  phoneNumber: string
  provider: string
  messagesCount: number
  lastActivity: string
}

interface InstancesProps {
  apiUrl: string
}

export default function Instances({ apiUrl }: InstancesProps) {
  const [instances, setInstances] = useState<Instance[]>([
    {
      id: '1',
      name: 'WhatsApp Principal',
      status: 'connected',
      phoneNumber: '+55 11 99999-9999',
      provider: 'Baileys',
      messagesCount: 523,
      lastActivity: '2 minutos atrás',
    },
    {
      id: '2',
      name: 'WhatsApp Suporte',
      status: 'connected',
      phoneNumber: '+55 11 99999-8888',
      provider: 'Meta Business API',
      messagesCount: 287,
      lastActivity: '5 minutos atrás',
    },
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const statusColor = {
    connected: 'bg-emerald-100 text-emerald-700',
    disconnected: 'bg-red-100 text-red-700',
    connecting: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instâncias WhatsApp</h1>
          <p className="text-gray-500 mt-1">Gerencie suas conexões WhatsApp</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          + Nova Instância
        </button>
      </div>

      {/* Instances List */}
      <div className="grid gap-6">
        {instances.map((instance) => (
          <div key={instance.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{instance.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{instance.phoneNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[instance.status]}`}>
                {instance.status === 'connected' ? '🟢' : instance.status === 'disconnected' ? '🔴' : '🟡'}{' '}
                {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded">
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="font-semibold text-gray-900">{instance.provider}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Mensagens</p>
                <p className="font-semibold text-gray-900">{instance.messagesCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Última atividade</p>
                <p className="font-semibold text-gray-900">{instance.lastActivity}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
                ⚙️ Configurar
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition">
                📊 Histórico
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition">
                🗑️ Deletar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Instância WhatsApp</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Instância</label>
                <input
                  type="text"
                  placeholder="Ex: WhatsApp Principal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600">
                  <option>Baileys (WhatsApp Web)</option>
                  <option>Meta Business API</option>
                  <option>Evolution API</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://seu-servidor.com/webhook"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded transition"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition">
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
