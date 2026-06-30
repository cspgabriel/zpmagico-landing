"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageCircle, Settings, Users, MessageSquare, Megaphone } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'WhatsApp Conexões', href: '/whatsapp', icon: MessageCircle },
  { name: 'Contatos (CRM)', href: '/contacts', icon: Users },
  { name: 'Chat Inbox (Live)', href: '/chat', icon: MessageSquare },
  { name: 'Campanhas (Disparos)', href: '/campaigns', icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col gap-6 bg-white border-r border-slate-200 p-4 shrink-0 h-screen">
      <div className="flex items-center gap-3 px-2 mt-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-emerald-500/20">
          Z
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-none">ZapMágico</h1>
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Multi-Tenant SaaS</span>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2 mt-4 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'opacity-80' : 'opacity-60'}`} />
              <span className="font-semibold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
          G
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">Gabriel (Admin)</p>
          <p className="text-[10px] text-slate-500">Plan: Enterprise</p>
        </div>
      </div>
    </aside>
  );
}
