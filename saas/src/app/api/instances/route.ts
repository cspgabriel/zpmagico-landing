import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const apiUrl = request.headers.get('x-api-url');
    const apiKey = request.headers.get('x-api-key');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId ausente.' }, { status: 400 });
    }

    const instances = await prisma.whatsAppInstance.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    // Reconciliar com o estado REAL da Evolution: o webhook pode ter perdido
    // um connection.update (SaaS reiniciado, etc). Sem isso o status "trava".
    if (apiUrl && apiKey && instances.length > 0) {
      try {
        const evoRes = await fetch(`${apiUrl}/instance/fetchInstances`, {
          headers: { apikey: apiKey },
          // não deixa o painel inteiro travar se a Evolution estiver lenta
          signal: AbortSignal.timeout(5000)
        });
        if (evoRes.ok) {
          const live = await evoRes.json();
          const byName = new Map<string, string>(
            (Array.isArray(live) ? live : []).map((i: any) => [
              i.name,
              i.connectionStatus === 'open' ? 'connected' : (i.connectionStatus || 'disconnected')
            ])
          );
          for (const inst of instances) {
            const real = byName.get(inst.instanceName);
            if (real && real !== inst.connectionStatus) {
              inst.connectionStatus = real;
              await prisma.whatsAppInstance.update({
                where: { id: inst.id },
                data: { connectionStatus: real }
              });
            }
          }
        }
      } catch {
        // Evolution offline/lenta — devolve o último estado conhecido do SQLite.
      }
    }

    return NextResponse.json(instances);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instanceName, tenantId, apiUrl, apiKey } = body;

    if (!instanceName || !tenantId || !apiUrl || !apiKey) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    // 1. Garantir que o Tenant existe no banco (Upsert)
    const tenant = await prisma.tenant.upsert({
      where: { id: tenantId },
      update: {},
      create: { id: tenantId, name: `Empresa ${tenantId.toUpperCase()}` }
    });

    // URL pública onde a Evolution (dentro do Docker) consegue alcançar este SaaS.
    // Dentro do container, "localhost" é o próprio container — use host.docker.internal.
    const webhookBase =
      process.env.SAAS_PUBLIC_URL || 'http://host.docker.internal:3001';

    // 2. Chamar a Evolution API para criar a instância no Docker,
    //    JÁ registrando o webhook que alimenta o SQLite (mensagens + status).
    const response = await fetch(`${apiUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instanceName,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: true,
        webhook: {
          url: `${webhookBase}/api/webhook`,
          enabled: true,
          byEvents: false,
          base64: true,
          events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED']
        }
      })
    });

    const evolutionData = await response.json().catch(() => null);

    if (!response.ok || !evolutionData) {
      return NextResponse.json({
        error: 'Falha na Evolution API: ' + (evolutionData?.message || 'Erro de comunicação.')
      }, { status: response.status });
    }

    // 3. Salvar no banco SQLite do SaaS
    const newInstance = await prisma.whatsAppInstance.upsert({
      where: { instanceName },
      update: {
        connectionStatus: 'disconnected'
      },
      create: {
        tenantId,
        instanceName,
        connectionStatus: 'disconnected'
      }
    });

    return NextResponse.json(newInstance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceName = searchParams.get('instanceName');
    const apiUrl = request.headers.get('x-api-url') || 'http://localhost:8083';
    const apiKey = request.headers.get('x-api-key');

    if (!instanceName || !apiKey) {
      return NextResponse.json({ error: 'instanceName ou apiKey ausentes.' }, { status: 400 });
    }

    // 1. Chamar a Evolution API para deletar a sessão no Docker
    const response = await fetch(`${apiUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: {
        'apikey': apiKey
      }
    });

    // 2. Remover do banco de dados local SQLite
    await prisma.whatsAppInstance.deleteMany({
      where: { instanceName }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
