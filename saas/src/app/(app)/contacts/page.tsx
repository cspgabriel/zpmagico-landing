"use client";

import { useState, useEffect } from 'react';
import { Users, Plus, RefreshCw, Search, Phone, UserCheck, X } from 'lucide-react';

interface ContactRecord {
  id: string;
  name: string;
  number: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('alfa');
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Create Contact States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newNumber, setNewNumber] = useState<string>('');

  const tenants = [
    { id: 'alfa', name: 'Cliente Alfa (Varejo)' },
    { id: 'beta', name: 'Cliente Beta (Clínica Médica)' }
  ];

  useEffect(() => {
    fetchContacts();
  }, [selectedTenant]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts?tenantId=${selectedTenant}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error(error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNumber.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenantId: selectedTenant,
          name: newName,
          number: newNumber
        })
      });

      const data = await res.json();
      if (data.error) {
        alert('Erro ao criar contato: ' + data.error);
      } else {
        setNewName('');
        setNewNumber('');
        setShowModal(false);
        fetchContacts();
      }
    } catch (error: any) {
      alert('Erro na requisição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar contatos pela busca
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.number.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Contatos (CRM)</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie os contatos/leads cadastrados de forma isolada por conta do SaaS.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Contato
        </button>
      </div>

      {/* Grid: Seletor de Tenant & Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Seletor Multi-Conta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Conta SaaS</label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm md:col-span-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou número..."
            className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabela de Contatos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nome do Contato</th>
                <th className="px-6 py-4">Número do WhatsApp</th>
                <th className="px-6 py-4">Data de Cadastro</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Nenhum contato encontrado.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        {c.name[0].toUpperCase()}
                      </div>
                      {c.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      +{c.number}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => alert(`Iniciar conversa com ${c.name} pelo Chat Inbox!`)}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Conversar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Contato */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800">Adicionar Novo Contato</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateContact} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Número do Celular (com DDI e DDD)</label>
                <input
                  type="text"
                  required
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="Ex: 5521993165605"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Insira o código do país + DDD + número (sem traços ou parênteses).</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  {loading ? 'Adicionando...' : 'Salvar Contato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
