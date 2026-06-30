"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, QrCode, Trash2, Smartphone, ShieldCheck, Users, Plus, X, ServerCrash } from 'lucide-react';

interface InstanceRecord {
  id: string;
  instanceName: string;
  connectionStatus: string;
  phoneNumber?: string | null;
  qrcodeUrl?: string | null;
  createdAt: string;
}

export default function WhatsAppPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('alfa');
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:8083');
  const [apiKey, setApiKey] = useState<string>('c575447a340e408e2c109a73ef922ca7cfb51d454289c7ec');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [instances, setInstances] = useState<InstanceRecord[]>([]);
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  
  // Create New Instance States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  
  // QR Code States
  const [activeQrCode, setActiveQrCode] = useState<{ [key: string]: string | null }>({});
  const [loadingQr, setLoadingQr] = useState<{ [key: string]: boolean }>({});

  const tenants = [
    { id: 'alfa', name: 'Cliente Alfa (Varejo)' },
    { id: 'beta', name: 'Cliente Beta (Clínica Médica)' }
  ];

  useEffect(() => {
    const savedUrl = localStorage.getItem('saas_evolution_url');
    if (savedUrl) setApiUrl(savedUrl);
    const savedKey = localStorage.getItem('saas_evolution_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    fetchLocalInstances();
  }, [selectedTenant, apiUrl, apiKey]);

  const saveSettings = () => {
    localStorage.setItem('saas_evolution_url', apiUrl);
    localStorage.setItem('saas_evolution_key', apiKey);
    alert('Configurações da Evolution API salvas!');
    fetchLocalInstances();
  };

  const fetchLocalInstances = async () => {
    if (!apiUrl || !apiKey) return;
    setLoading(true);
    try {
      // 1. Verificar se a API está online
      const checkRes = await fetch(`/api/whatsapp?route=/instance/fetchInstances`, {
        headers: { 'x-api-url': apiUrl, 'x-api-key': apiKey }
      }).catch(() => null);

      if (!checkRes || !checkRes.ok) {
        setApiOnline(false);
      } else {
        setApiOnline(true);
      }

      // 2. Buscar instâncias salvas no banco de dados local SQLite
      const res = await fetch(`/api/instances?tenantId=${selectedTenant}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setInstances(data);
      } else {
        setInstances([]);
      }
    } catch (error) {
      console.error(error);
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setLoading(true);
    const sanitizedCustomName = customName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    // Nome final da instância: saas_tenant_{tenantId}_{nomeCustomizado}
    const finalInstanceName = `saas_tenant_${selectedTenant}_${sanitizedCustomName}`;

    try {
      const res = await fetch(`/api/instances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: finalInstanceName,
          tenantId: selectedTenant,
          apiUrl,
          apiKey
        })
      });

      const data = await res.json();
      if (data.error) {
        alert('Erro ao criar instância: ' + data.error);
      } else {
        setCustomName('');
        setShowCreateModal(false);
        fetchLocalInstances();
      }
    } catch (error: any) {
      alert('Erro na requisição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceName: string) => {
    if (!confirm(`Deseja realmente excluir e desconectar a instância ${instanceName}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/instances?instanceName=${instanceName}`, {
        method: 'DELETE',
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        }
      });
      const data = await res.json();
      if (data.error) {
        alert('Erro ao excluir: ' + data.error);
      }
      fetchLocalInstances();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetQrCode = async (instanceName: string) => {
    setLoadingQr(prev => ({ ...prev, [instanceName]: true }));
    setActiveQrCode(prev => ({ ...prev, [instanceName]: null }));

    try {
      const res = await fetch(`/api/whatsapp?route=/instance/connect/${instanceName}`, {
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        }
      });
      const data = await res.json();

      // Evolution API 2.3.7 retorna o QR em formatos diferentes conforme o estado:
      // - { base64, code, pairingCode }  (connect quando desconectada)
      // - { qrcode: { base64 } }         (algumas versões / eventos)
      const base64 =
        data?.base64 ||
        data?.qrcode?.base64 ||
        data?.qrcode ||
        null;

      if (base64) {
        const normalized = base64.startsWith('data:image')
          ? base64
          : `data:image/png;base64,${base64}`;
        setActiveQrCode(prev => ({ ...prev, [instanceName]: normalized }));
      } else if (data?.instance?.state === 'open' || data?.state === 'open') {
        alert('Esta conexão já está ativa (WhatsApp conectado).');
        fetchLocalInstances();
      } else {
        const motivo = data?.error || data?.message || 'A Evolution API não retornou um QR Code.';
        alert('Falha ao gerar QR Code: ' + motivo);
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    } finally {
      setLoadingQr(prev => ({ ...prev, [instanceName]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">WhatsApp Conexões</h1>
          <p className="text-slate-500 text-sm mt-0.5">Crie e gerencie múltiplas conexões de WhatsApp reais integradas à Evolution API.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!apiOnline}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Nova Conexão
        </button>
      </div>

      {/* Alerta se a Evolution API estiver offline */}
      {!apiOnline && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800 text-sm">
          <ServerCrash className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Evolution API offline na porta 8083!</span>
            <p className="mt-1 text-xs">
              Certifique-se de que o contêiner Docker está rodando. Execute <code>iniciar_docker.bat</code> e clique no botão "Testar/Atualizar" abaixo.
            </p>
          </div>
        </div>
      )}

      {/* Grid Superior: Seletor de Tenant & Configs da API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Seletor Multi-Conta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-3">
              <Users className="w-5 h-5" />
              <span>Conta SaaS (Tenant)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Alterne a conta ativa no painel do SaaS para visualizar ou criar conexões de WhatsApp exclusivas daquela empresa.
            </p>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Conta ativa no painel</label>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Prefixo do Cliente:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">saas_tenant_{selectedTenant}</span>
          </div>
        </div>

        {/* Configurações do Servidor Evolution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Configuração da Evolution API</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">URL da API</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8083"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Chave de API Master</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Chave de API da Evolution"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={fetchLocalInstances}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Testar/Atualizar
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
            >
              Salvar Ajustes
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Instâncias Cadastradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instances.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800">Nenhuma Conexão Cadastrada</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Nenhuma instância de WhatsApp foi criada para esta conta. Clique em "Nova Conexão" para parear um telefone.
            </p>
          </div>
        ) : (
          instances.map(inst => {
            const friendlyName = inst.instanceName.replace(`saas_tenant_${selectedTenant}_`, '').toUpperCase();
            return (
              <div key={inst.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        {friendlyName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{friendlyName}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">{inst.instanceName}</span>
                      </div>
                    </div>
                    {/* Badge de Status */}
                    {inst.connectionStatus === 'connected' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Online
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Desconectado
                      </span>
                    )}
                  </div>

                  {/* QR Code Container se solicitado */}
                  {activeQrCode[inst.instanceName] && (
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 animate-fadeIn">
                      <img
                        src={activeQrCode[inst.instanceName]!}
                        alt="QR Code"
                        className="w-48 h-48 border border-slate-200 rounded-lg bg-white shadow-sm"
                      />
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aponte a câmera do WhatsApp</span>
                    </div>
                  )}

                  {loadingQr[inst.instanceName] && (
                    <div className="h-48 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl gap-2 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                      <span className="text-xs">Gerando QR Code...</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex gap-3">
                  {inst.connectionStatus !== 'connected' && (
                    <button
                      onClick={() => handleGetQrCode(inst.instanceName)}
                      disabled={loadingQr[inst.instanceName]}
                      className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Mostrar QR Code
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteInstance(inst.instanceName)}
                    className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação de Instância */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800">Nova Conexão WhatsApp</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInstance} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Identificador da Conexão</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: suporte, vendas, financeiro"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Nome amigável (sem espaços ou acentos) para identificar este celular.</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  {loading ? 'Criando...' : 'Criar Instância'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
