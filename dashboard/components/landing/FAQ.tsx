'use client'

import { useState } from 'react'

export default function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Preciso de experiência técnica para usar Evolution Dashboard?',
      answer:
        'Não! Evolution Dashboard foi desenvolvido para ser intuitivo. Se você consegue usar WhatsApp, consegue usar nosso dashboard. Setup leva 5 minutos e temos documentação em português.',
    },
    {
      question: 'Qual é a diferença entre plano Starter e Professional?',
      answer:
        'Starter é ideal para testar (1 instância, 10k msg/mês). Professional é para usar em produção (5 instâncias, 100k msg/mês, todas integrações, suporte prioritário). Enterprise é para operações em larga escala.',
    },
    {
      question: 'Posso usar Evolution Dashboard com Evolution API hospedada em outro lugar?',
      answer:
        'Sim! Evolution Dashboard é agnóstico. Conecte à sua própria instância de Evolution API configurando a URL e API key nas configurações. Oferecemos também opção hosted.',
    },
    {
      question: 'Evolution Dashboard funciona com WhatsApp Business oficial?',
      answer:
        'Sim, suportamos 3 providers: Baileys (WhatsApp Web), Meta Business API (oficial) e Evolution API. Configure qual preferir nas integrações.',
    },
    {
      question: 'Há limite de mensagens ou conexões?',
      answer:
        'Cada plano tem limite. Starter: 10k msg/mês. Professional: 100k msg/mês. Enterprise: ilimitado. Você pode fazer upgrade a qualquer momento.',
    },
    {
      question: 'Vocês oferecem suporte em português?',
      answer:
        'Sim! Suporte por email em Starter, suporte prioritário (chat + call) em Professional, e suporte 24/7 dedicado em Enterprise. Todos em português.',
    },
    {
      question: 'Posso exportar meus dados?',
      answer:
        'Sim! 100% dos seus dados podem ser exportados em qualquer momento em formatos padrão (JSON, CSV). Você não fica preso.',
    },
    {
      question: 'Vocês oferecem SLA (Service Level Agreement)?',
      answer:
        'Professional oferece 99.5% uptime. Enterprise oferece 99.99% com SLA e compensação garantida. Monitoramento 24/7 em ambos.',
    },
  ]

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Não encontrou sua pergunta? Contate nosso suporte
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition"
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <span className="flex-shrink-0 text-emerald-600 text-xl font-bold">
                  {expanded === i ? '−' : '+'}
                </span>
              </button>

              {expanded === i && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-gray-200 rounded-2xl text-center">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            Ainda tem dúvidas?
          </p>
          <p className="text-gray-600 mb-6">
            Nossa equipe de suporte em português está pronta para ajudar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
              💬 Chat ao Vivo
            </button>
            <button className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-lg transition">
              📧 Email
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
