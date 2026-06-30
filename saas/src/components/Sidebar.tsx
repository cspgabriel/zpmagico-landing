"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageCircle, Users, MessageSquare, Megaphone } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'WhatsApp Conexões', href: '/whatsapp', icon: MessageCircle },
  { name: 'Contatos (CRM)', href: '/contacts', icon: Users },
  { name: 'Chat Inbox (Live)', href: '/chat', icon: MessageSquare },
  { name: 'Campanhas (Disparos)', href: '/campaigns', icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col gap-6 bg-[#101018] border-r border-white/5 p-4 shrink-0 h-screen">
      <div className="flex items-center gap-3 px-2 mt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-xl flex items-center justify-center font-extrabold text-black text-xl shadow-lg shadow-[#00ff88]/10">
          Z
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white leading-none">WhatsZap Mágico</h1>
          <span className="text-[9px] font-semibold text-[#00ff88] uppercase tracking-wider">Multi-Tenant SaaS</span>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1.5 mt-4 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shadow-sm shadow-[#00ff88]/5 font-bold'
                  : 'text-[#8a8a9a] hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-[#e8e8f0] text-sm border border-white/10">
          G
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Gabriel (Admin)</p>
          <p className="text-[10px] text-[#00ff88] font-medium">Plano: Enterprise</p>
        </div>
      </div>
    </aside>
  );
}
