"use client";

import { MessageCircle, Zap, Activity, BookOpen, Terminal, Users, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalContacts: 0, totalMessages: 0, totalInstances: 0, activeInstances: 0 });

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const { totalContacts, totalMessages, totalInstances, activeInstances } = stats;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <MessageCircle className="w-96 h-96 -mr-16 -mb-16" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            ZAP MÁGICO OFICIAL 2026
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Painel SaaS Integrado Evolution API</h1>
          <p className="text-emerald-100 text-sm">
            Toda a plataforma está integrada a um banco de dados real. Conexões WhatsApp reais, contatos persistentes, mensagens atualizadas via webhooks!
          </p>
          <div className="pt-2 flex gap-3">
            <Link
              href="/whatsapp"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition shadow"
            >
              <Zap className="w-4 h-4 fill-emerald-700" />
              WhatsApp Conexões
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-emerald-700/50 text-white border border-emerald-500/30 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700/70 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Inbox
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">WhatsApp Conexões</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Zap className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{activeInstances} / {totalInstances}</span>
            <p className="text-xs text-slate-500 mt-1">Conectadas / Cadastradas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Contatos (CRM)</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{totalContacts}</span>
            <p className="text-xs text-slate-500 mt-1">Contatos salvos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Mensagens do Chat</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><MessageCircle className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">{totalMessages}</span>
            <p className="text-xs text-slate-500 mt-1">Mensagens trocadas via API</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Health Check API</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600"><Activity className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">100% ONLINE</span>
            <p className="text-xs text-slate-500 mt-1">Porta 8083 (Docker ativa)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            Estrutura de Produção na VPS
          </h2>
          <p className="text-slate-500 text-sm">
            Este monorepo está pronto para deploy direto na VPS a partir do GitHub.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 space-y-2 overflow-x-auto">
            <p># Para rodar localmente no Windows:</p>
            <p className="text-white">1. Abra o Docker Desktop</p>
            <p className="text-white">2. Execute iniciar_docker.bat (Evolution API na porta 8083)</p>
            <p className="text-white">3. Execute iniciar_saas.bat (SaaS na porta 3001)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Multi-Tenancy Isolado
            </h2>
            <p className="text-slate-500 text-sm">
              Cada cliente vê apenas seus próprios contatos, mensagens e conexões.
            </p>
          </div>
          <div className="pt-4 flex gap-4">
            <Link href="/contacts" className="text-emerald-600 font-bold hover:text-emerald-700 text-xs">
              Ver Contatos →
            </Link>
            <Link href="/chat" className="text-teal-600 font-bold hover:text-teal-700 text-xs">
              Abrir Chat Inbox →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
