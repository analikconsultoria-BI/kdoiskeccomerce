import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('configuracoes_loja').select('*');
    if (error) throw error;

    const map: Record<string, string> = {};
    data?.forEach((c: { chave: string; valor: string }) => map[c.chave] = c.valor);

    return NextResponse.json(map, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar config:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
