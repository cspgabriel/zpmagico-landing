import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId ausente.' }, { status: 400 });
    }

    const contacts = await prisma.contact.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, name, number } = body;

    if (!tenantId || !name || !number) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const formattedNumber = number.replace(/\D/g, '');

    const contact = await prisma.contact.upsert({
      where: {
        tenantId_number: {
          tenantId,
          number: formattedNumber
        }
      },
      update: {
        name
      },
      create: {
        tenantId,
        name,
        number: formattedNumber
      }
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
