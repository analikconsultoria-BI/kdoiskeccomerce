import { NextResponse } from 'next/server';
import { getCategorias } from '@/lib/api-logic';

export async function GET() {
  try {
    const categoriesWithBanners = await getCategorias();
    return NextResponse.json(categoriesWithBanners);
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
