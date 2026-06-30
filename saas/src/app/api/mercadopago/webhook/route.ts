import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log("MercadoPago webhook:", { type, data });

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
        console.error("Erro ao buscar pagamento:", await mpResponse.text());
        return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
      }

      const payment = await mpResponse.json();
      
      // Verificar status do pagamento
      if (payment.status === "approved") {
        const externalReference = payment.external_reference;
        const payerEmail = payment.payer?.email;
        const amount = payment.transaction_amount;
        
        console.log("Pagamento aprovado:", { externalReference, payerEmail, amount });

        // TODO: Aqui você integra com seu banco de dados
        // 1. Criar/atualizar usuário no banco
        // 2. Liberar acesso ao SaaS
        // 3. Enviar email de boas-vindas
        // 4. Conectar instância Evolution API
        
        // Exemplo com Prisma (descomente quando configurar):
        /*
        const user = await prisma.user.upsert({
          where: { email: payerEmail },
          update: {
            status: "ACTIVE",
            plan: "MONTHLY",
            mercadoPagoPaymentId: paymentId,
            mercadoPagoExternalReference: externalReference,
            updatedAt: new Date(),
          },
          create: {
            email: payerEmail,
            name: payment.payer?.first_name + " " + payment.payer?.last_name,
            status: "ACTIVE",
            plan: "MONTHLY",
            mercadoPagoPaymentId: paymentId,
            mercadoPagoExternalReference: externalReference,
          },
        });
        */
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Endpoint para teste/healthcheck
  return NextResponse.json({ 
    status: "ok", 
    message: "MercadoPago webhook endpoint ready",
    timestamp: new Date().toISOString()
  });
}