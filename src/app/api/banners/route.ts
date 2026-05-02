import { NextResponse } from 'next/server';
import { getBanners } from '@/lib/api-logic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const local = searchParams.get('local');

  try {
    const data = await getBanners(local || undefined);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
