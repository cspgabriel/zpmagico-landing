"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Send, Users, Smartphone, MessageCircle, AlertCircle } from 'lucide-react';

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

interface ChatMessageRecord {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  direction: 'inbound' | 'outbound' | string;
  timestamp: string;
}

export default function ChatPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('alfa');
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:8083');
  const [apiKey, setApiKey] = useState<string>('c575447a340e408e2c109a73ef922ca7cfb51d454289c7ec');

  const [instances, setInstances] = useState<InstanceRecord[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

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

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedContact]);

  const fetchInitData = async () => {
    setLoading(true);
    setSelectedContact(null);
    setMessages([]);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedContact) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?tenantId=${selectedTenant}&number=${selectedContact.number}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact || !selectedInstance) return;

    const messageContent = inputText;
    setInputText('');

    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenantId: selectedTenant,
          instanceName: selectedInstance,
          contactNumber: selectedContact.number,
          content: messageContent,
          apiUrl,
          apiKey
        })
      });

      const data = await res.json();
      if (data.error) {
        alert('Erro ao enviar mensagem: ' + data.error);
        setInputText(messageContent); // Devolve o texto ao input
      } else {
        // Atualizar lista de mensagens na tela
        fetchMessages();
      }
    } catch (error: any) {
      alert('Erro na requisição: ' + error.message);
      setInputText(messageContent);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chat Inbox (Live Chat)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Converse em tempo real de forma multi-conta com seus clientes.</p>
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

      {/* Container Principal do Chat */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[650px] overflow-hidden grid grid-cols-1 md:grid-cols-3">
        
        {/* Painel Esquerdo: Contatos e Instâncias */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          
          {/* Cabeçalho da Instância */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Instância WhatsApp ativa</label>
            {instances.length === 0 ? (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  Nenhuma conexão ativa na Evolution para esta conta. Ative o WhatsApp na aba <strong>WhatsApp Conexões</strong>.
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <select
                  value={selectedInstance}
                  onChange={(e) => setSelectedInstance(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none border-b border-slate-200 pb-1"
                >
                  {instances.map(i => (
                    <option key={i.id} value={i.instanceName}>{i.instanceName.replace(`saas_tenant_${selectedTenant}_`, '').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Lista de Contatos */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/30 border-b border-slate-100">
              Contatos cadastrados
            </div>
            {contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Nenhum contato cadastrado no CRM. Adicione contatos na aba Contatos.
              </div>
            ) : (
              contacts.map(c => {
                const isSelected = selectedContact?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                      {c.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 truncate leading-tight">{c.name}</h4>
                      <span className="text-xs text-slate-500 font-mono">+{c.number}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Painel Central/Direito: Conversa */}
        <div className="md:col-span-2 flex flex-col h-full bg-slate-50 relative">
          
          {/* Se nenhum contato estiver selecionado */}
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">ZapMágico Live Chat</h3>
              <p className="text-slate-500 text-xs max-w-xs">
                Selecione um contato na lista ao lado para abrir a caixa de mensagens em tempo real e iniciar a conversa.
              </p>
            </div>
          ) : (
            <>
              {/* Cabeçalho da conversa ativa */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{selectedContact.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">+{selectedContact.number}</span>
                </div>
                <button
                  onClick={fetchMessages}
                  disabled={loadingMessages}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Balões de Chat */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                {messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 my-auto">
                    Nenhuma mensagem enviada ou recebida ainda. Digite sua mensagem abaixo para testar o envio.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOutbound = msg.direction === 'outbound';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isOutbound
                            ? 'bg-emerald-600 text-white self-end rounded-tr-none'
                            : 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-100'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <span className={`text-[9px] mt-1 text-right block ${
                          isOutbound ? 'text-emerald-100' : 'text-slate-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="bg-white border-t border-slate-200 p-4 flex gap-3 items-center z-10">
                <input
                  type="text"
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={!selectedInstance}
                  placeholder={selectedInstance ? "Digite sua mensagem..." : "Ative uma conexão WhatsApp para poder enviar..."}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!selectedInstance}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
