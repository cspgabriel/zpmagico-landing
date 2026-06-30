import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const contactNumber = searchParams.get('number');

    if (!tenantId || !contactNumber) {
      return NextResponse.json({ error: 'tenantId ou number ausente.' }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        tenantId,
        OR: [
          { sender: contactNumber },
          { receiver: contactNumber }
        ]
      },
      orderBy: { timestamp: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, instanceName, contactNumber, content, apiUrl, apiKey } = body;

    if (!tenantId || !instanceName || !contactNumber || !content || !apiUrl || !apiKey) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const formattedNumber = contactNumber.replace(/\D/g, '');

    // 1. Chamar a Evolution API para enviar a mensagem via WhatsApp
    const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: formattedNumber,
        text: content
      })
    });

    const evolutionData = await response.json().catch(() => null);

    if (!response.ok || !evolutionData) {
      return NextResponse.json({ 
        error: 'Erro no envio da Evolution API: ' + (evolutionData?.message || 'Erro de comunicação.') 
      }, { status: response.status });
    }

    // 2. Localizar ou Criar o Contato correspondente no banco
    const contact = await prisma.contact.upsert({
      where: {
        tenantId_number: {
          tenantId,
          number: formattedNumber
        }
      },
      update: {},
      create: {
        tenantId,
        name: `Contato ${formattedNumber}`,
        number: formattedNumber
      }
    });

    // 3. Localizar a instância no banco do SaaS
    const instance = await prisma.whatsAppInstance.findUnique({
      where: { instanceName }
    });

    if (!instance) {
      return NextResponse.json({ error: 'Instância não registrada no SaaS.' }, { status: 404 });
    }

    // 4. Registrar a mensagem enviada no SQLite local
    const messageId = evolutionData.key?.id || `msg_${Date.now()}`;
    const newMessage = await prisma.chatMessage.create({
      data: {
        tenantId,
        instanceId: instance.id,
        contactId: contact.id,
        messageId,
        sender: 'SaaS / Minha Empresa',
        receiver: formattedNumber,
        content,
        direction: 'outbound'
      }
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
