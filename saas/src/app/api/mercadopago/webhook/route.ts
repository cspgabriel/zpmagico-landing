import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log("MercadoPago webhook recebido:", { type, data });

    // Verificar se é um evento de pagamento
    if (type === "payment") {
      const paymentId = data.id;
      
      // Buscar detalhes do pagamento via API do MercadoPago
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!mpResponse.ok) {
        console.error("Erro ao buscar pagamento no Mercado Pago:", await mpResponse.text());
        return NextResponse.json({ error: "Failed to fetch payment details" }, { status: 500 });
      }

      const payment = await mpResponse.json();
      
      // Verificar se o pagamento está aprovado
      if (payment.status === "approved") {
        const payerEmail = payment.payer?.email?.toLowerCase().trim();
        const first_name = payment.payer?.first_name || "Cliente";
        const last_name = payment.payer?.last_name || "ZapMágico";
        const name = `${first_name} ${last_name}`.trim();
        const externalReference = payment.external_reference;
        const amount = payment.transaction_amount;
        
        console.log("Processando pagamento aprovado via webhook:", { paymentId, payerEmail, name, amount });

        if (!payerEmail) {
          console.error("❌ E-mail do pagador não encontrado nos dados do Mercado Pago.");
          return NextResponse.json({ error: "Payer email is missing" }, { status: 400 });
        }

        // 1. Verificar se o usuário já foi criado (evitar duplicações)
        const userExists = await prisma.user.findUnique({
          where: { email: payerEmail },
        });

        if (!userExists) {
          console.log(`👤 Criando conta automática para o e-mail: ${payerEmail}...`);
          
          // Gerar senha temporária legível (ex: ZAP-941824)
          const pin = Math.floor(100000 + Math.random() * 900000);
          const tempPassword = `ZAP-${pin}`;
          const passwordHash = await hashPassword(tempPassword);

          // Gerar slug único
          const emailPrefix = payerEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 15);
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          const slug = `${emailPrefix}-${randomSuffix}`;

          // Executar transação no banco MySQL
          await prisma.$transaction(async (tx) => {
            // A. Criar Tenant
            const tenant = await tx.tenant.create({
              data: {
                slug,
                name: `Empresa de ${name}`,
                status: "ACTIVE",
              },
            });

            // B. Criar User vinculado ao Tenant
            await tx.user.create({
              data: {
                email: payerEmail,
                name,
                passwordHash,
                role: "CLIENT",
                tenantId: tenant.id,
              },
            });

            // C. Garantir existência do Plano Vitalício
            let plan = await tx.plan.findUnique({
              where: { slug: "vitalicio" },
            });

            if (!plan) {
              plan = await tx.plan.create({
                data: {
                  slug: "vitalicio",
                  name: "Licença Vitalícia",
                  description: "Acesso vitalício ao WhatsZap Mágico",
                  priceCents: 9700,
                  maxInstances: 1,
                  maxMessagesPerMonth: 5000,
                  maxContacts: 1000,
                  features: JSON.stringify(["campaigns", "api_access"]),
                },
              });
            }

            // D. Criar Subscription vitalícia
            await tx.subscription.create({
              data: {
                tenantId: tenant.id,
                planId: plan.id,
                status: "ACTIVE",
                asaasPaymentId: paymentId, // Referência do ID de pagamento
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // +100 anos
              },
            });
          });

          // 2. Disparar email de confirmação com a senha plana temporária
          const loginUrl = `${process.env.AUTH_URL || 'https://zapmagico.agenciarmktdigital.com.br'}/login`;
          await sendConfirmationEmail({
            to: payerEmail,
            name,
            loginEmail: payerEmail,
            plainPassword: tempPassword,
            loginUrl,
          });
          
          console.log(`✅ Fluxo pós-pagamento concluído via webhook para ${payerEmail}`);
        } else {
          console.log(`👤 Usuário ${payerEmail} já possui conta ativa no sistema.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: "ok", 
    message: "MercadoPago webhook endpoint ready",
    timestamp: new Date().toISOString()
  });
}