import { MessageCircle, ShieldCheck, Zap, Activity, BookOpen, Terminal, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Mensagem de Boas-Vindas */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <MessageCircle className="w-96 h-96 -mr-16 -mb-16" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            ZAP MÁGICO OFICIAL 2026
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao seu painel SaaS de WhatsApp!</h1>
          <p className="text-emerald-100 text-sm">
            Esta é a base de um software Multi-Conta integrado à Evolution API. Cada conta (Tenant) gerencia suas instâncias do WhatsApp de forma isolada, persistindo dados com total segurança.
          </p>
          <div className="pt-2">
            <Link
              href="/whatsapp"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition shadow"
            >
              <Zap className="w-4 h-4 fill-emerald-700" />
              Conectar meu WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Conexões Ativas</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Zap className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">2 / 5</span>
            <p className="text-xs text-slate-500 mt-1">Contas pareadas no servidor</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Mensagens (Mês)</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><MessageCircle className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">14.820</span>
            <p className="text-xs text-slate-500 mt-1">Disparadas via API local</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Uso de Memória</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><Cpu className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">240 MB</span>
            <p className="text-xs text-slate-500 mt-1">Consumo da Evolution local</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Health Check API</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600"><Activity className="w-5 h-5" /></span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-800">100% ONLINE</span>
            <p className="text-xs text-slate-500 mt-1">Servidor local na porta 8083</p>
          </div>
        </div>

      </div>

      {/* Seção de Documentação & VPS Deploy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Guia Rápido VPS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            Guia Rápido: Rodando na sua VPS
          </h2>
          <p className="text-slate-500 text-sm">
            Este monorepo foi planejado para ser clonado diretamente no seu servidor. Veja os comandos básicos para subir o ecossistema completo:
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 space-y-2 overflow-x-auto">
            <p># 1. Clone o repositório na VPS</p>
            <p className="text-white">git clone https://github.com/cspgabriel/zap-magico-oficial-2026.git</p>
            <p># 2. Acesse a pasta docker e inicie o Evolution stack</p>
            <p className="text-white">cd zap-magico-oficial-2026/docker && docker compose up -d</p>
            <p># 3. Acesse a pasta saas, instale e rode o build</p>
            <p className="text-white">cd ../saas && npm install && npm run build</p>
          </div>
          <p className="text-slate-400 text-xs">
            * Certifique-se de configurar as variáveis de ambiente no arquivo <code>docker/.env</code> antes de subir o docker.
          </p>
        </div>

        {/* Card Arquitetura Multi-Tenant */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Arquitetura de Isolamento
            </h2>
            <p className="text-slate-500 text-sm">
              Consulte a documentação completa de arquitetura contida na pasta <code>docs/architecture_multi_tenant_saas.md</code> para entender o fluxo de banco de dados, mapeamento de tenants no Prisma e webhooks globais.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/whatsapp"
              className="text-emerald-600 font-bold hover:text-emerald-700 text-sm inline-flex items-center gap-1"
            >
              Ir para conexões →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
