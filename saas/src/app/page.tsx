import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-black text-sm">Z</div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">WhatsZap Mágico</span>
        </div>
        <Link href="/login" className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold text-sm px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-400/30 transition">
          QUERO AGORA →
        </Link>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-5 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(0,255,136,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,212,255,0.05) 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/30 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400 mb-6">
            ⚡ +2.300 usuários ativos
          </div>
          <h1 className="text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[1.1] max-w-3xl mx-auto mb-4 tracking-tight">
            O jeito mais inteligente de{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">automatizar seu WhatsApp</span>
          </h1>
          <p className="text-[clamp(0.9rem,2vw,1.2rem)] text-[#8a8a9a] max-w-xl mx-auto mb-8 leading-relaxed">
            Disparo em massa com segurança anti-ban, extratores de dados, IA para atendimento 24h e muito mais.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-7">
            {["📱 Disparo em Massa", "🛡️ Anti-Ban", "🤖 IA 24h", "📊 Extratores", "⚡ Multi-Instância"].map((tag) => (
              <span key={tag} className="bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs text-[#8a8a9a]">{tag}</span>
            ))}
          </div>
          <div className="mb-6">
            <p className="text-lg text-[#8a8a9a] line-through mb-0.5">De R$ 97,00/mês</p>
            <p className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent leading-tight font-display">
              12x R$ 19,90
            </p>
            <p className="text-sm text-[#8a8a9a] mt-1">ou R$ 197,90 à vista · Teste grátis 24h · 15 dias de garantia</p>
          </div>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-lg px-12 py-4 rounded-xl hover:translate-y-[-2px] hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition animate-pulse-glow mb-3"
          >
            🔥 QUERO AUTOMATIZAR MEU WHATSAPP
          </Link>
          <p className="text-sm text-[#8a8a9a]">🛡️ 15 dias de garantia incondicional · Acesso imediato</p>
        </div>
      </section>

      {/* PROOF BAR */}
      <div className="bg-white/5 border-y border-white/10 py-6 px-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <span className="text-[11px] uppercase tracking-[1.5px] text-[#8a8a9a]">Resultados dos nossos usuários</span>
          <div className="flex gap-8 flex-wrap">
            {[{ num: "+46 mil", desc: "Mensagens/dia" }, { num: "99,7%", desc: "Taxa de entrega" }, { num: "12", desc: "Instâncias simultâneas" }, { num: "0", desc: "Bloqueios na conta" }].map((s) => (
              <div key={s.desc} className="text-center">
                <div className="text-xl font-extrabold text-emerald-400">{s.num}</div>
                <div className="text-[11px] text-[#8a8a9a] uppercase tracking-[0.5px]">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-3 tracking-tight">Você ainda está perdendo clientes?</h2>
        <p className="text-base text-[#8a8a9a] max-w-xl mb-10">Responder manual, planilha bagunçada, conta bloqueada, lead esquecido.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: "😤", title: '"Vou perder minha conta"', desc: "Usou qualquer ferramenta e tomou bloqueio. O medo de perder o contato com seus clientes te paralisa." },
            { icon: "⏰", title: '"Não dou conta dos leads"', desc: "Lead sem resposta em 5 minutos = concorrente fecha a venda. Você perde por lentidão." },
            { icon: "📉", title: '"Meu disparo não entrega"', desc: "Número queimado, bloqueio silencioso, mensagem caindo no spam. Seu esforço vira pó." },
            { icon: "🔧", title: '"Só ferramenta complicada"', desc: "Tutorial de 2 horas, API que não conecta, suporte que demora 3 dias." },
          ].map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-emerald-500/20 hover:-translate-y-0.5 transition">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h4 className="font-bold mb-1.5">{card.title}</h4>
              <p className="text-sm text-[#8a8a9a] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#101018] py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-3 tracking-tight">Tudo que você precisa em um só lugar</h2>
          <p className="text-base text-[#8a8a9a] max-w-xl mb-10">12 módulos integrados em uma plataforma. Do disparo ao atendimento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: "📤", title: "Disparo em Massa Inteligente", desc: "Delay aleatório, pausas programadas, rotação de instâncias. Sua conta nunca fica exposta." },
              { icon: "🛡️", title: "Proteção Anti-Ban", desc: "Simula comportamento humano real. Limites dinâmicos e detecção antes do WhatsApp agir." },
              { icon: "🤖", title: "IA de Atendimento 24h", desc: "Chatbot que qualifica, responde FAQ e agenda. Enquanto você dorme, ela vende." },
              { icon: "🔍", title: "Extrator de Grupos", desc: "Extraia números de participantes de grupos automaticamente." },
              { icon: "📍", title: "Extrator por Geolocalização", desc: "Capture números de estabelecimentos próximos. Ideal para prospecção local." },
              { icon: "👥", title: "Multi-Instância", desc: "Gerencie dezenas de números em um só painel. Cada instância independente." },
              { icon: "📊", title: "Relatórios Detalhados", desc: "Entregas, aberturas, cliques — tudo medido em tempo real." },
              { icon: "🏷️", title: "Segmentação", desc: "Organize contatos por origem, interesse, estágio. A mensagem certa para a pessoa certa." },
              { icon: "🔗", title: "API para Integrações", desc: "REST API completa. Conecte com seu CRM ou sistema interno." },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-emerald-500/20 hover:-translate-y-0.5 transition relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-emerald-400 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition">
                <div className="text-2xl mb-2.5">{f.icon}</div>
                <h4 className="font-bold text-sm mb-1.5">{f.title}</h4>
                <p className="text-xs text-[#8a8a9a] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTI-BAN */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <div className="bg-gradient-to-br from-[#0a0a0f] via-emerald-950/10 to-[#0a0a0f] rounded-2xl border border-emerald-500/10 p-12 md:p-16 text-center relative">
          <div className="text-5xl mb-3">🛡️</div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            <span className="text-emerald-400">Proteção Anti-Ban</span> que funciona de verdade
          </h3>
          <p className="text-[#8a8a9a] max-w-2xl mx-auto mb-6 leading-relaxed">
            Nossa taxa de bloqueio é <strong className="text-emerald-400">0,3%</strong> contra <strong className="text-red-400">37%</strong> da média do mercado.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["✓ Delay aleatório inteligente", "✓ Pausas programadas", "✓ Rotação de instâncias", "✓ Limite por hora dinâmico", "✓ Alertas preventivos"].map((item) => (
              <span key={item} className="bg-emerald-900/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-[#101018] py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-3 tracking-tight text-center">WhatsZap Mágico vs Concorrência</h2>
          <p className="text-base text-[#8a8a9a] text-center mb-10">Mais de 2.300 usuários já migraram.</p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {[
              ["Funcionalidade", "WhatsZap Mágico", "Concorrência"],
              ["Proteção Anti-Ban", "✓ Avançada", "✗ Básica"],
              ["IA para Atendimento", "✓ Inclusa", "✗ Separada"],
              ["Extratores", "✓ Inclusos", "✗ Separados"],
              ["Instâncias Ilimitadas", "✓ Sim", "✗ Limitado"],
              ["Suporte", "✓ 24h", "✗ Email"],
              ["Garantia", "✓ 15 dias", "✗ 7 dias"],
              ["Preço Justo", "R$ 19,90/mês", "R$ 97/mês"],
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-white/10 last:border-0 ${i === 0 ? "bg-white/5 font-bold text-xs uppercase tracking-wider text-[#8a8a9a]" : ""}`}>
                {row.map((cell, j) => (
                  <div key={j} className={`px-5 py-4 text-sm flex items-center gap-1.5 ${j === 0 ? "text-[#8a8a9a] text-xs" : ""} ${j === 1 && i > 0 ? "text-emerald-400 font-bold" : j === 2 && i > 0 ? "text-red-400" : ""}`}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-5 py-20 overflow-hidden">
        <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-3 tracking-tight">Quem usa, aprova</h2>
        <p className="text-base text-[#8a8a9a] mb-10">O que nossos usuários estão falando.</p>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[
            { quote: "Uso para disparar campanhas de imóveis. Minha base de leads triplicou e não tomei um bloqueio sequer em 4 meses.", name: "Carlos M.", role: "Corretor Imobiliário" },
            { quote: "O extrator de grupos + disparo salvou minha prospecção. Em 2 semanas gerei mais de 300 leads qualificados.", name: "Ana R.", role: "Head de Vendas" },
            { quote: "Tinha medo de bloqueio porque já perdi conta 2 vezes. Aqui estou há 8 meses com 3 números ativos.", name: "Fernando L.", role: "Gerente Comercial" },
            { quote: "Testei 4 ferramentas antes. Ou queimava o número ou era complicada demais. O WhatsZap Mágico é simples e funciona.", name: "Marina S.", role: "Empreendedora Digital" },
            { quote: "Desde que implantei aqui na imobiliária, minha equipe passou de 5 para 40 visitas agendadas por semana.", name: "Rafael T.", role: "Diretor Imobiliária" },
          ].map((t) => (
            <div key={t.name} className="min-w-[300px] max-w-[340px] bg-white/5 border border-white/10 rounded-2xl p-6 flex-shrink-0">
              <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
              <blockquote className="text-sm leading-relaxed mb-3">"{t.quote}"</blockquote>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-sm text-black">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[#8a8a9a]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARA QUEM */}
      <section className="max-w-3xl mx-auto px-5 py-20">
        <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-3 tracking-tight">Isso é pra você se...</h2>
        <p className="text-base text-[#8a8a9a] mb-10">WhatsZap Mágico é para quem leva vendas a sério.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-emerald-500/20 rounded-xl p-7">
            <div className="text-emerald-400 font-extrabold text-xs uppercase tracking-[1.5px] mb-4">✅ É pra você</div>
            <ul className="space-y-2.5">
              {["Corretor que quer disparar imóveis sem tomar bloqueio", "Hotel/pousada que envia ofertas com fotos via WhatsApp", "Pizzaria/restaurante que dispara o cardápio todo dia", "Lojista que manda promoções sem ser denunciado", "Imobiliária que extrai condôminos de grupos"].map((item) => (
                <li key={item} className="text-sm text-[#8a8a9a] pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-400 before:font-bold">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-red-500/10 rounded-xl p-7">
            <div className="text-red-400 font-extrabold text-xs uppercase tracking-[1.5px] mb-4">✗ Não é pra você</div>
            <ul className="space-y-2.5">
              {["Quer spammar 10 mil números em 5 minutos (e tomar ban)", "Não tem produto ou serviço pra vender", "Espera que a ferramenta venda sozinha", "Não quer investir R$ 19,90 pra testar", "Acha que automação WhatsApp é opcional"].map((item) => (
                <li key={item} className="text-sm text-[#8a8a9a] pl-5 relative before:content-['✗'] before:absolute before:left-0 before:text-red-400 before:font-bold">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="bg-[#101018] py-20 px-5" id="oferta">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-10 md:p-12 text-center relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-emerald-400 before:to-transparent">
            <div className="inline-flex items-center gap-1.5 bg-red-900/20 border border-red-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-400 mb-5">
              ⏰ Oferta por tempo limitado
            </div>
            <p className="text-[11px] uppercase tracking-[1.5px] text-[#8a8a9a] mb-1">Valor normal</p>
            <p className="text-lg text-[#8a8a9a] line-through mb-1">R$ 97,00/mês</p>
            <p className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent leading-tight font-display mb-1">
              <span className="text-3xl">R$</span> 19,90
            </p>
            <p className="text-sm text-[#8a8a9a] mb-2">12 parcelas de R$ 19,90 ou R$ 197,90 à vista</p>
            <p className="text-xs text-emerald-400 font-bold mb-5">⏳ Oferta por tempo limitado</p>
            <p className="text-xs text-[#8a8a9a] mb-6">🔒 Pagamento 100% seguro via MercadoPago</p>
            <a
              href="https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=189231969-894e381b-e097-4f5f-adf5-b1ef91dc93c7"
              className="block bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-lg py-5 rounded-xl hover:translate-y-[-2px] hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition animate-pulse-glow mb-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔥 QUERO MEU ACESSO AGORA
            </a>
            <p className="text-sm text-[#8a8a9a]">🛡️ Garantia incondicional de 15 dias · Risco zero</p>
            <div className="bg-white/5 rounded-xl p-5 mt-5">
              <h5 className="text-xs font-bold text-cyan-400 mb-2.5 uppercase tracking-[1px]">🎁 Bônus Exclusivos ao Assinar Hoje</h5>
              <ul className="text-left space-y-2">
                {["20 templates de campanha prontos para disparo", "Guia completo de proteção anti-ban (R$ 47 valor)", "Suporte prioritário vitalício", "1 hora de consultoria de automação"].map((b) => (
                  <li key={b} className="text-xs text-[#8a8a9a] pl-5 relative before:content-['🎁'] before:absolute before:left-0">{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="max-w-lg mx-auto px-5 py-16">
        <div className="border-2 border-emerald-500/20 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-extrabold text-emerald-400 mb-3">🛡️ Garantia Incondicional de 15 Dias</h3>
          <p className="text-sm text-[#8a8a9a] leading-relaxed">Assine, teste todas as funcionalidades por 15 dias. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do seu dinheiro. Risco zero.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#101018] py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold mb-10 tracking-tight text-center">Perguntas Frequentes</h2>
          <div className="space-y-0">
            {[
              ["O WhatsZap Mágico é seguro? Não vou tomar bloqueio?", "Sim. O sistema foi construído com camadas de proteção anti-ban: delay aleatório inteligente, pausas programadas, limite dinâmico por hora e rotação automática de instâncias. Taxa de bloqueio de apenas 0,3%."],
              ["Preciso instalar algo no meu computador?", "Não. Tudo funciona 100% online pelo painel web. Você só precisa do seu WhatsApp conectado via QR Code, igual o WhatsApp Web."],
              ["Quantos números posso conectar?", "Quantos quiser. Cada instância é independente, com suas próprias configurações de proteção e envio."],
              ["Como funciona a IA de atendimento?", "Você configura respostas automáticas para perguntas frequentes. A IA qualifica leads e agenda. Se não souber responder, transfere pra você."],
              ["Tem suporte se eu precisar de ajuda?", "Sim. Suporte prioritário via WhatsApp com tempo médio de resposta de 3 minutos em horário comercial."],
              ["Como funciona o teste grátis de 24h?", "Cadastre-se, conecte seu WhatsApp e teste tudo por 24h sem pagar nada."],
              ["E a garantia de 15 dias?", "Se nos primeiros 15 dias você não ficar satisfeito, devolvemos 100%. Sem perguntas, sem burocracia."],
            ].map(([q, a], i) => (
              <details key={i} className="group border-b border-white/10 py-4">
                <summary className="text-sm font-semibold cursor-pointer flex justify-between items-center text-[#e8e8f0] list-none">
                  {q}
                  <span className="text-emerald-400 text-xl transition-transform group-open:rotate-45 flex-shrink-0 ml-3">+</span>
                </summary>
                <p className="text-sm text-[#8a8a9a] mt-2.5 max-w-[90%] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-20 px-5" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(0,255,136,0.08) 0%, transparent 60%)" }}>
        <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black mb-3">Automatize seu WhatsApp agora.</h2>
        <p className="text-base text-[#8a8a9a] max-w-lg mx-auto mb-7">Mais de 2.300 usuários já transformaram suas vendas. O próximo pode ser você.</p>
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-lg px-14 py-4.5 rounded-xl hover:translate-y-[-2px] hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition animate-pulse-glow"
        >
          🔥 QUERO COMEÇAR AGORA
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-white/5 border-t border-white/10 py-8 px-5 text-center">
        <p className="text-xs text-[#8a8a9a]">WhatsZap Mágico · Automatize. Venda. Escale.</p>
        <p className="text-xs text-[#8a8a9a] mt-1.5">© 2026 · Todos os direitos reservados</p>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 p-2.5 md:hidden">
        <Link href="/login" className="block text-center bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-sm py-3.5 rounded-xl">
          🔥 TESTAR GRÁTIS POR 24H
        </Link>
      </div>

      <style>{`
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(0,255,136,0.2); } 50% { box-shadow: 0 0 40px rgba(0,255,136,0.5); } }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
}
