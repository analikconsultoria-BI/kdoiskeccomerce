import { NextRequest, NextResponse } from 'next/server';
import { refreshBlingToken } from '@/lib/bling';

export async function GET(request: NextRequest) {
  // Proteger a rota: só aceitar chamadas internas ou com header de autorização
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.BLING_CLIENT_SECRET;
  
  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await refreshBlingToken();

  if (result.success) {
    return NextResponse.json({ message: 'Token renovado com sucesso!' });
  } else {
    return NextResponse.json({ error: 'Falha ao renovar token' }, { status: 500 });
  }
}
