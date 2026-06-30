"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, QrCode, Send, ShieldCheck, Users, Trash2, Smartphone, AlertTriangle } from 'lucide-react';

interface InstanceData {
  instanceName: string;
  connectionStatus: string;
  owner?: string;
}

export default function WhatsAppPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('alfa');
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:8083');
  const [apiKey, setApiKey] = useState<string>('c575447a340e408e2c109a73ef922ca7cfb51d454289c7ec');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'not_created' | 'disconnected' | 'connected' | 'loading'>('loading');
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  
  // Test Message States
  const [destNumber, setDestNumber] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('Olá! Esta é uma mensagem de teste do ZapMágico SaaS.');
  const [sendResult, setSendResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Exemplo de Tenants do SaaS
  const tenants = [
    { id: 'alfa', name: 'Cliente Alfa (Varejo)' },
    { id: 'beta', name: 'Cliente Beta (Clínica Médica)' }
  ];

  const currentInstanceName = `saas_tenant_${selectedTenant}`;

  useEffect(() => {
    // Carregar configurações locais
    const savedUrl = localStorage.getItem('saas_evolution_url');
    if (savedUrl) setApiUrl(savedUrl);
    const savedKey = localStorage.getItem('saas_evolution_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    checkInstanceStatus();
  }, [selectedTenant, apiUrl, apiKey]);

  const saveSettings = () => {
    localStorage.setItem('saas_evolution_url', apiUrl);
    localStorage.setItem('saas_evolution_key', apiKey);
    alert('Configurações da Evolution API salvas!');
    checkInstanceStatus();
  };

  const checkInstanceStatus = async () => {
    if (!apiUrl || !apiKey) return;
    setLoading(true);
    setConnectionStatus('loading');
    setQrCodeBase64(null);

    try {
      // 1. Verificar se a instância existe
      const res = await fetch(`/api/whatsapp?route=/instance/fetchInstances`, {
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        }
      });
      const instances = await res.json();

      if (Array.isArray(instances)) {
        const currentInst = instances.find((i: InstanceData) => i.instanceName === currentInstanceName);
        
        if (currentInst) {
          if (currentInst.connectionStatus === 'ONLINE' || currentInst.connectionStatus === 'connected') {
            setConnectionStatus('connected');
          } else {
            setConnectionStatus('disconnected');
            // Buscar QR Code
            getQrCode();
          }
        } else {
          setConnectionStatus('not_created');
        }
      } else {
        setConnectionStatus('not_created');
      }
    } catch (error) {
      console.error(error);
      setConnectionStatus('not_created');
    } finally {
      setLoading(false);
    }
  };

  const getQrCode = async () => {
    try {
      const res = await fetch(`/api/whatsapp?route=/instance/connect/${currentInstanceName}`, {
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        }
      });
      const data = await res.json();
      
      if (data && data.qrcode && data.qrcode.base64) {
        setQrCodeBase64(data.qrcode.base64);
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    }
  };

  const createInstance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/whatsapp?route=/instance/create`, {
        method: 'POST',
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          instanceName: currentInstanceName,
          integration: 'WHATSAPP-BAILEYS',
          qrcode: true
        })
      });
      const data = await res.json();

      if (data && data.instance) {
        setConnectionStatus('disconnected');
        // Esperar e buscar o QR Code
        setTimeout(() => getQrCode(), 1500);
      } else {
        alert('Erro ao criar instância: ' + (data.message || 'Verifique suas configurações.'));
      }
    } catch (error: any) {
      alert('Erro na requisição: ' + error.message);
    } finally {
      setLoading(false);
      checkInstanceStatus();
    }
  };

  const deleteInstance = async () => {
    if (!confirm('Deseja realmente desconectar e excluir esta instância do WhatsApp? Isso limpará a sessão local.')) return;
    setLoading(true);
    try {
      await fetch(`/api/whatsapp?route=/instance/delete/${currentInstanceName}`, {
        method: 'DELETE',
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        }
      });
      setConnectionStatus('not_created');
      setQrCodeBase64(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      checkInstanceStatus();
    }
  };

  const sendTestMessage = async () => {
    if (!destNumber) {
      alert('Por favor, informe o número de destino.');
      return;
    }
    setSendResult(null);
    try {
      const formattedNum = destNumber.replace(/\D/g, ''); // Apenas números
      const res = await fetch(`/api/whatsapp?route=/message/sendText/${currentInstanceName}`, {
        method: 'POST',
        headers: {
          'x-api-url': apiUrl,
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          number: formattedNum,
          text: messageText
        })
      });
      const data = await res.json();

      if (data && (data.key || data.success)) {
        setSendResult({ success: true, msg: 'Mensagem enviada com sucesso!' });
      } else {
        setSendResult({ success: false, msg: 'Falha no envio: ' + (data.message || 'Retorno inválido.') });
      }
    } catch (error: any) {
      setSendResult({ success: false, msg: 'Erro na requisição: ' + error.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">WhatsApp Conexões</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerencie as conexões de WhatsApp do seu SaaS de forma isolada por conta.</p>
      </div>

      {/* Grid Superior: Seletor de Tenant & Configs da API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Seletor Multi-Conta (SaaS Tenant Selector) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-3">
              <Users className="w-5 h-5" />
              <span>Multi-Conta (Tenants)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Cada cliente (Tenant) possui sua própria conexão isolada na Evolution API utilizando o nome <code>{currentInstanceName}</code>.
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
            <span className="text-slate-500">Prefixo da Instância:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">saas_tenant_{selectedTenant}</span>
          </div>
        </div>

        {/* Credenciais de Conexão da Evolution (Simulação Bypass Admin) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Configuração da Evolution API (Servidor Local/VPS)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">URL da API Evolution</label>
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
              onClick={checkInstanceStatus}
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

      {/* Painel da Instância */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-slate-800">WhatsApp Conexão: <span className="text-emerald-600">{currentInstanceName}</span></h2>
          </div>
          
          {/* Badge de Status */}
          {connectionStatus === 'connected' && (
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
              Conectado
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
              Aguardando Pareamento
            </span>
          )}
          {connectionStatus === 'not_created' && (
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
              Sem Conexão
            </span>
          )}
          {connectionStatus === 'loading' && (
            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              Buscando...
            </span>
          )}
        </div>

        <div className="p-6">
          
          {/* Caso 1: Sem Conexão criada */}
          {connectionStatus === 'not_created' && (
            <div className="text-center py-12 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Sem WhatsApp Conectado</h3>
              <p className="text-sm text-slate-500">
                Este tenant ainda não configurou uma sessão de WhatsApp. Crie uma nova instância para parear o aparelho.
              </p>
              <button
                onClick={createInstance}
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Gerar Nova Instância WhatsApp
              </button>
            </div>
          )}

          {/* Caso 2: Instância Criada mas Desconectada (Exibir QR Code) */}
          {connectionStatus === 'disconnected' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Escaneie o QR Code</h3>
                <p className="text-sm text-slate-500">
                  Abra o WhatsApp no seu celular, vá em <strong>Aparelhos Conectados &gt; Conectar um Aparelho</strong> e aponte a câmera para o QR Code ao lado.
                </p>
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-xs text-rose-800 flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">O QR Code expira rapidamente!</span> Caso ele mude ou expire, clique no botão de atualizar abaixo.
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={checkInstanceStatus}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar QR Code / Status
                  </button>
                  <button
                    onClick={deleteInstance}
                    className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-medium transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Sessão
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center border border-slate-100 rounded-2xl p-6 bg-slate-50/50 shadow-inner">
                {qrCodeBase64 ? (
                  <img
                    src={qrCodeBase64}
                    alt="Evolution API QR Code"
                    className="w-64 h-64 border border-slate-200 rounded-xl shadow bg-white"
                  />
                ) : (
                  <div className="w-64 h-64 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl gap-2 text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs">Gerando QR Code...</span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-semibold">Evolution API QR Stream</span>
              </div>
            </div>
          )}

          {/* Caso 3: Conectado (Exibir Painel de Envio de Mensagem de Teste) */}
          {connectionStatus === 'connected' && (
            <div className="py-6 max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">WhatsApp Ativo e Pareado!</h3>
                <p className="text-sm text-slate-500">
                  A instância <strong>{currentInstanceName}</strong> está conectada e pronta para receber ou enviar mensagens no SaaS.
                </p>
              </div>

              {/* Formulário de Envio de Teste */}
              <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">Disparar Mensagem de Teste</h4>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Número de Destino (com DDD e DDI)</label>
                  <input
                    type="text"
                    value={destNumber}
                    onChange={(e) => setDestNumber(e.target.value)}
                    placeholder="Ex: 5521993165605"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Insira o código do país + DDD + número (ex: 55 para Brasil).</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mensagem</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={deleteInstance}
                    className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-medium transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Desconectar WhatsApp
                  </button>

                  <button
                    onClick={sendTestMessage}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Mensagem
                  </button>
                </div>

                {sendResult && (
                  <div className={`p-4 rounded-xl border text-sm mt-3 ${
                    sendResult.success 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {sendResult.msg}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
