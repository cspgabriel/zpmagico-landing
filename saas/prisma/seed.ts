import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 ZapMágico — seed inicial\n');

  // ─── 1. Planos (catálogo público) ────────────────────────────────────────
  const starter = await prisma.plan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      slug: 'starter',
      name: 'Starter',
      description: 'Pra quem está começando. 1 conexão WhatsApp e até 500 mensagens/mês.',
      priceCents: 9900, // R$ 99/mês
      maxInstances: 1,
      maxMessagesPerMonth: 500,
      maxContacts: 200,
      features: JSON.stringify(['chat_inbox', 'contacts_crm']),
      trialDays: 7,
    },
  });

  const pro = await prisma.plan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      slug: 'pro',
      name: 'Pro',
      description: 'Pra times que vendem. 3 conexões, 5.000 mensagens, campanhas.',
      priceCents: 24900, // R$ 249/mês
      maxInstances: 3,
      maxMessagesPerMonth: 5000,
      maxContacts: 2000,
      features: JSON.stringify(['chat_inbox', 'contacts_crm', 'campaigns', 'api_access']),
      trialDays: 7,
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      slug: 'enterprise',
      name: 'Enterprise',
      description: 'Pra operações críticas. Ilimitado + suporte prioritário.',
      priceCents: 79900, // R$ 799/mês
      maxInstances: 10,
      maxMessagesPerMonth: 50000,
      maxContacts: 20000,
      features: JSON.stringify(['chat_inbox', 'contacts_crm', 'campaigns', 'api_access', 'priority_support', 'webhooks']),
      trialDays: 14,
    },
  });

  console.log(`✅ Planos: ${await prisma.plan.count()} (Starter R$ 99, Pro R$ 249, Enterprise R$ 799)`);

  // ─── 2. Tenant interno da Agenciar (ADMIN) ───────────────────────────────
  const adminPasswordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'admin123!@#',
    12,
  );

  const agenciar = await prisma.tenant.upsert({
    where: { slug: 'agenciar' },
    update: {},
    create: {
      slug: 'agenciar',
      name: 'Agenciar MKT Digital (Interno)',
      status: 'ACTIVE',
      users: {
        create: [
          {
            email: process.env.SEED_ADMIN_EMAIL || 'admin@agenciar.com.br',
            name: 'Gabriel (Admin)',
            role: 'ADMIN',
            passwordHash: adminPasswordHash,
          },
        ],
      },
    },
  });

  console.log(`✅ Tenant interno: ${agenciar.slug} (ADMIN)`);

  // ─── 3. Tenants cliente (TESTE — Alfa Varejo, Beta Clínica) ───────────────
  const tenantAlfa = await prisma.tenant.upsert({
    where: { slug: 'alfa' },
    update: {},
    create: {
      slug: 'alfa',
      name: 'Cliente Alfa (Varejo)',
      status: 'ACTIVE',
      users: {
        create: [
          {
            email: 'alfa@cliente.com.br',
            name: 'Marina (Varejo)',
            role: 'CLIENT',
            passwordHash: adminPasswordHash, // mesmo hash só pra seed
          },
        ],
      },
    },
  });

  const tenantBeta = await prisma.tenant.upsert({
    where: { slug: 'beta' },
    update: {},
    create: {
      slug: 'beta',
      name: 'Cliente Beta (Clínica Médica)',
      status: 'ACTIVE',
      users: {
        create: [
          {
            email: 'beta@cliente.com.br',
            name: 'Dr. Anderson (Clínica)',
            role: 'CLIENT',
            passwordHash: adminPasswordHash,
          },
        ],
      },
    },
  });

  console.log(`✅ Tenants cliente: ${tenantAlfa.slug}, ${tenantBeta.slug}`);

  // ─── 4. Contatos de teste em cada tenant ─────────────────────────────────
  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: tenantAlfa.id, number: '5521993165605' } },
    update: {},
    create: {
      tenantId: tenantAlfa.id,
      name: 'Gabriel Protel',
      number: '5521993165605',
      tags: 'lead,vip',
    },
  });

  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: tenantAlfa.id, number: '5521999999999' } },
    update: {},
    create: {
      tenantId: tenantAlfa.id,
      name: 'Cliente Teste Varejo',
      number: '5521999999999',
    },
  });

  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: tenantBeta.id, number: '5521988888888' } },
    update: {},
    create: {
      tenantId: tenantBeta.id,
      name: 'Dr. Anderson Pereira',
      number: '5521988888888',
      tags: 'paciente,retorno',
    },
  });

  console.log(`✅ Contatos seed: 3 (2 do Alfa, 1 do Beta)`);

  // ─── 5. Subscription trial de 14 dias pra cada tenant ────────────────────
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  for (const tenant of [tenantAlfa, tenantBeta]) {
    await prisma.subscription.upsert({
      where: { tenantId: tenant.id },
      update: {},
      create: {
        tenantId: tenant.id,
        planId: pro.id,
        status: 'TRIALING',
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        trialEndsAt: trialEnd,
      },
    });
  }

  console.log(`✅ Subscriptions: 2 trials de 14 dias (Pro)\n`);

  // ─── Resumo ──────────────────────────────────────────────────────────────
  console.log('═'.repeat(60));
  console.log('🎉 Seed concluído!');
  console.log('═'.repeat(60));
  console.log(`📊 Tenants: ${await prisma.tenant.count()}`);
  console.log(`👥 Users:   ${await prisma.user.count()}`);
  console.log(`📇 Contatos: ${await prisma.contact.count()}`);
  console.log(`📦 Planos:  ${await prisma.plan.count()}`);
  console.log(`💳 Subscriptions: ${await prisma.subscription.count()}`);
  console.log('═'.repeat(60));
  console.log('\n🔑 Login unificado p/ todos:');
  console.log(`   • admin@agenciar.com.br / ${process.env.SEED_ADMIN_PASSWORD || 'admin123!@#'}`);
  console.log('═'.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
