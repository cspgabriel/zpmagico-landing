import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar Tenants
  const tenantAlfa = await prisma.tenant.upsert({
    where: { id: 'alfa' },
    update: {},
    create: { id: 'alfa', name: 'Cliente Alfa (Varejo)', plan: 'pro' }
  });

  const tenantBeta = await prisma.tenant.upsert({
    where: { id: 'beta' },
    update: {},
    create: { id: 'beta', name: 'Cliente Beta (Clínica Médica)', plan: 'enterprise' }
  });

  // Criar Contatos para o Tenant Alfa
  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: 'alfa', number: '5521993165605' } },
    update: {},
    create: { tenantId: 'alfa', name: 'Gabriel Protel', number: '5521993165605' }
  });

  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: 'alfa', number: '5521999999999' } },
    update: {},
    create: { tenantId: 'alfa', name: 'Cliente Teste Varejo', number: '5521999999999' }
  });

  // Criar Contatos para o Tenant Beta
  await prisma.contact.upsert({
    where: { tenantId_number: { tenantId: 'beta', number: '5521988888888' } },
    update: {},
    create: { tenantId: 'beta', name: 'Dr. Anderson Pereira', number: '5521988888888' }
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
