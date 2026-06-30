import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { event, instance, data } = payload;

    if (!instance) {
      return NextResponse.json({ success: true, message: 'Ignorado: sem instância' });
    }

    // 1. Localizar a instância correspondente no banco
    const dbInstance = await prisma.whatsAppInstance.findUnique({
      where: { instanceName: instance }
    });

    if (!dbInstance) {
      return NextResponse.json({ success: true, message: 'Ignorado: instância não cadastrada no SaaS' });
    }

    const tenantId = dbInstance.tenantId;

    // 2. Tratar evento de mensagem (messages.upsert)
    if (event === 'messages.upsert' && data) {
      const isFromMe = data.key?.fromMe === true;
      const remoteJid = data.key?.remoteJid || '';
      const formattedNumber = remoteJid.split('@')[0];

      // Ignorar mensagens de grupos (que terminam com @g.us)
      if (remoteJid.endsWith('@g.us')) {
        return NextResponse.json({ success: true, message: 'Mensagem de grupo ignorada' });
      }

      // Capturar o texto da conversa
      const content = data.message?.conversation || 
                      data.message?.extendedTextMessage?.text || 
                      (data.message?.imageMessage ? '[Imagem]' : '') ||
                      (data.message?.audioMessage ? '[Áudio]' : '') || 
                      '';

      if (content && formattedNumber) {
        // Encontrar ou criar o contato no banco
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
            name: data.pushName || `Contato ${formattedNumber}`,
            number: formattedNumber
          }
        });

        // Salvar a mensagem no histórico do banco local
        await prisma.chatMessage.create({
          data: {
            tenantId,
            instanceId: dbInstance.id,
            contactId: contact.id,
            messageId: data.key.id || `webhk_${Date.now()}`,
            sender: isFromMe ? 'SaaS / Minha Empresa' : formattedNumber,
            receiver: isFromMe ? formattedNumber : 'SaaS / Minha Empresa',
            content,
            direction: isFromMe ? 'outbound' : 'inbound',
            timestamp: new Date(data.messageTimestamp * 1000 || Date.now())
          }
        });
      }
    }

    // 3. Tratar evento de conexão (connection.update)
    if (event === 'connection.update' && data) {
      const state = data.state;
      let newStatus = 'disconnected';

      if (state === 'open' || state === 'connected') {
        newStatus = 'connected';
      } else if (state === 'connecting') {
        newStatus = 'connecting';
      }

      await prisma.whatsAppInstance.update({
        where: { id: dbInstance.id },
        data: {
          connectionStatus: newStatus,
          phoneNumber: data.phoneNumber || dbInstance.phoneNumber
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro no processamento do Webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
