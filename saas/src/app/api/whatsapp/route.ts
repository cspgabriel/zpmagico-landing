import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return handleRequest(request, 'GET');
}

export async function POST(request: Request) {
  return handleRequest(request, 'POST');
}

export async function DELETE(request: Request) {
  return handleRequest(request, 'DELETE');
}

async function handleRequest(request: Request, method: string) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRoute = searchParams.get('route'); // Ex: /instance/fetchInstances

    if (!targetRoute) {
      return NextResponse.json({ error: 'Parâmetro "route" ausente.' }, { status: 400 });
    }

    // Obter as credenciais da Evolution API enviadas pelo client nos headers
    const evolutionApiUrl = request.headers.get('x-api-url') || 'http://localhost:8083';
    const evolutionApiKey = request.headers.get('x-api-key');

    if (!evolutionApiKey) {
      return NextResponse.json({ error: 'Header "x-api-key" (Evolution API Key) ausente.' }, { status: 401 });
    }

    // Montar a URL de destino da Evolution API
    const targetUrl = new URL(targetRoute, evolutionApiUrl).toString();

    // Copiar os headers do request e definir a autenticação da Evolution ("apikey")
    const headers = new Headers();
    headers.set('apikey', evolutionApiKey);
    headers.set('Content-Type', 'application/json');

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Repassar o body se for POST/PUT
    if (method !== 'GET' && method !== 'HEAD') {
      const bodyText = await request.text();
      if (bodyText) {
        fetchOptions.body = bodyText;
      }
    }

    // Fazer a chamada para a Evolution API local/remota
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json().catch(() => null);

    return NextResponse.json(data || { success: response.ok }, { status: response.status });
  } catch (error: any) {
    console.error('Erro no proxy de API:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no proxy.' }, { status: 500 });
  }
}
