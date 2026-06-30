import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendConfirmationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "MP_TOKEN_NOT_CONFIGURED" }, { status: 500 });
    }

    // 1. Consultar status do pagamento no Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!mpResponse.ok) {
      console.error("Erro ao buscar pagamento no Mercado Pago:", await mpResponse.text());
      return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 });
    }

    const payment = await mpResponse.json();
    
    if (payment.status !== "approved") {
      return NextResponse.json({ 
        status: payment.status, 
        message: "O pagamento ainda não foi aprovado." 
      });
    }

    const payerEmail = payment.payer?.email?.toLowerCase().trim();
    if (!payerEmail) {
      return NextResponse.json({ error: "Payer email not found in payment data" }, { status: 400 });
    }

    // 2. Verificar se o usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: payerEmail },
      include: { tenant: true },
    });

    let tempPassword = "";

    if (!user) {
      console.log(`👤 Criando novo usuário e tenant automático para: ${payerEmail}...`);
      
      // Gerar senha temporária legível (ex: ZAP-452819)
      const pin = Math.floor(100000 + Math.random() * 900000);
      tempPassword = `ZAP-${pin}`;
      const passwordHash = await hashPassword(tempPassword);

      // Gerar slug amigável a partir do e-mail
      const emailPrefix = payerEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 15);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const slug = `${emailPrefix}-${randomSuffix}`;
      const name = payment.payer?.first_name 
        ? `${payment.payer.first_name} ${payment.payer.last_name || ""}`.trim()
        : `Cliente ZapMágico`;

      // Rodar transação no banco de dados para criar Tenant, User e Subscription
      await prisma.$transaction(async (tx) => {
        // A. Criar o Tenant
        const tenant = await tx.tenant.create({
          data: {
            slug,
            name: `Empresa de ${name}`,
            status: "ACTIVE",
          },
        });

        // B. Criar o User vinculado ao Tenant
        user = await tx.user.create({
          data: {
            email: payerEmail,
            name,
            passwordHash,
            role: "CLIENT",
            tenantId: tenant.id,
          },
          include: { tenant: true },
        });

        // C. Buscar plano "vitalicio" ou "starter" existente ou criar temporário
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

        // D. Criar a assinatura vitalícia (expiração em 100 anos no futuro)
        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: plan.id,
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // +100 anos
          },
        });
      });

      // 3. Disparar email de confirmação com a senha plana temporária
      const loginUrl = `${process.env.AUTH_URL || 'https://zapmagico.agenciarmktdigital.com.br'}/login`;
      await sendConfirmationEmail({
        to: payerEmail,
        name: user!.name || 'Cliente ZapMágico',
        loginEmail: payerEmail,
        plainPassword: tempPassword,
        loginUrl,
      });
    }

    return NextResponse.json({
      status: "approved",
      email: payerEmail,
      name: user!.name,
      // Retorna a senha temporária gerada apenas na criação da conta
      tempPassword: tempPassword || null,
      message: tempPassword 
        ? "Sua conta foi criada automaticamente!" 
        : "Seu pagamento foi confirmado! Use seus dados de acesso cadastrados."
    });

  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: error.message || "Failed to process status check" }, { status: 500 });
  }
}
