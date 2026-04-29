import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const local = searchParams.get('local');

  try {
    let query = supabaseAdmin
      .from('banners')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (local) {
      query = query.eq('local', local);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
