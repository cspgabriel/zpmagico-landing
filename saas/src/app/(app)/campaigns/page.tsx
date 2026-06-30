"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Users, Smartphone, Megaphone, Send, AlertCircle, Play, CheckCircle } from 'lucide-react';

interface InstanceRecord {
  id: string;
  instanceName: string;
  connectionStatus: string;
}

interface ContactRecord {
  id: string;
  name: string;
  number: string;
}

export default function CampaignsPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('alfa');
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:8083');
  const [apiKey, setApiKey] = useState<string>('c575447a340e408e2c109a73ef922ca7cfb51d454289c7ec');

  const [instances, setInstances] = useState<InstanceRecord[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  
  // Campaign Form States
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaignMessage, setCampaignMessage] = useState<string>('');
  
  // Execution States
  const [sending, setSending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [totalToSend, setTotalToSend] = useState<number>(0);
  const [currentSendIndex, setCurrentSendIndex] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failCount, setFailCount] = useState<number>(0);

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
    fetchInitData();
  }, [selectedTenant]);

  const fetchInitData = async () => {
    try {
      // 1. Buscar instâncias conectadas (ONLINE) no banco local
      const resInst = await fetch(`/api/instances?tenantId=${selectedTenant}`);
      const dataInst = await resInst.json();
      if (Array.isArray(dataInst)) {
        const connectedOnly = dataInst.filter((i: InstanceRecord) => i.connectionStatus === 'connected');
        setInstances(connectedOnly);
        if (connectedOnly.length > 0) {
          setSelectedInstance(connectedOnly[0].instanceName);
        } else {
          setSelectedInstance('');
        }
      }

      // 2. Buscar contatos do tenant
      const resContacts = await fetch(`/api/contacts?tenantId=${selectedTenant}`);
      const dataContacts = await resContacts.json();
      if (Array.isArray(dataContacts)) {
        setContacts(dataContacts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const runCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !campaignMessage.trim() || !selectedInstance || contacts.length === 0) {
      alert('Certifique-se de preencher todos os campos e ter contatos cadastrados.');
      return;
    }

    setSending(true);
    setProgress(0);
    setTotalToSend(contacts.length);
    setCurrentSendIndex(0);
    setSuccessCount(0);
    setFailCount(0);

    // Loop de Disparo (Front-end Campaign Runner)
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      setCurrentSendIndex(i + 1);

      try {
        const res = await fetch(`/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tenantId: selectedTenant,
            instanceName: selectedInstance,
            contactNumber: contact.number,
            content: campaignMessage,
            apiUrl,
            apiKey
          })
        });
        
        const data = await res.json();

        if (res.ok && !data.error) {
          setSuccessCount(prev => prev + 1);
        } else {
          setFailCount(prev => prev + 1);
        }
      } catch (error) {
        console.error(error);
        setFailCount(prev => prev + 1);
      }

      // Atualizar progresso na tela
      setProgress(Math.round(((i + 1) / contacts.length) * 100));

      // Intervalo de delay simples (ex: 2 segundos por mensagem para evitar spam/bloqueio)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setSending(false);
    alert('Campanha de disparo em massa finalizada!');
    setCampaignName('');
    setCampaignMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campanhas (Disparo em Massa)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Dispare mensagens do WhatsApp em massa para todos os contatos do seu banco de dados de forma automática.</p>
        </div>

        {/* Seletor Multi-Conta */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel de Configuração e Disparo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600" />
            Nova Campanha de WhatsApp
          </h2>

          <form onSubmit={runCampaign} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  disabled={sending}
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Ofertas de Natal, Informativo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Conexão WhatsApp Remetente</label>
                {instances.length === 0 ? (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    Ative o WhatsApp na aba <strong>WhatsApp Conexões</strong>.
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <select
                      value={selectedInstance}
                      onChange={(e) => setSelectedInstance(e.target.value)}
                      disabled={sending}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {instances.map(i => (
                        <option key={i.id} value={i.instanceName}>{i.instanceName.replace(`saas_tenant_${selectedTenant}_`, '').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mensagem de Disparo</label>
              <textarea
                required
                disabled={sending}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="Insira a mensagem que será enviada para todos os contatos da lista..."
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500 font-semibold">
                Destinatários: <span className="text-emerald-600">{contacts.length} contatos cadastrados</span>
              </span>
              <button
                type="submit"
                disabled={sending || instances.length === 0 || contacts.length === 0}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 fill-white" />
                Disparar Campanha
              </button>
            </div>

          </form>
        </div>

        {/* Painel de Acompanhamento / Progresso */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Progresso do Envio
            </h2>
            
            {/* Status do envio */}
            {sending ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                    <span>Enviando mensagens...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="block text-2xl font-bold text-slate-800">{currentSendIndex} / {totalToSend}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Processando</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <span className="block text-2xl font-bold text-emerald-700">{successCount}</span>
                    <span className="text-[10px] text-emerald-600 uppercase font-semibold">Sucesso</span>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                  <span className="block text-2xl font-bold text-rose-700">{failCount}</span>
                  <span className="text-[10px] text-rose-600 uppercase font-semibold">Falhados</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                Nenhum envio em andamento no momento. Configure sua campanha e clique em Disparar para acompanhar o envio de mensagens em tempo real com delay inteligente.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
