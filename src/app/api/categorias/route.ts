import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Buscar categorias únicas cadastradas nos produtos
    const { data: products, error: pError } = await supabaseAdmin
      .from('produtos_config')
      .select('categoria_customizada')
      .not('categoria_customizada', 'is', null);

    if (pError) throw pError;

    // Extrair nomes únicos e remover vazios
    const uniqueCategoryNames = Array.from(new Set(
      (products as { categoria_customizada: string }[])
        .map((p: { categoria_customizada: string }) => p.categoria_customizada)
        .filter((name: string) => name && name.trim() !== '')
    )) as string[];

    // 2. Buscar banners associados a essas categorias
    // O campo 'local' na tabela banners agora guarda o nome da categoria
    const { data: banners, error: bError } = await supabaseAdmin
      .from('banners')
      .select('*')
      .in('local', uniqueCategoryNames)
      .eq('ativo', true);

    if (bError) throw bError;

    // 3. Montar o objeto final
    const categoriesWithBanners = uniqueCategoryNames.map((name: string) => {
      const banner = (banners as any[])?.find((b: any) => b.local === name);
      return {
        id: name, // Usamos o nome como ID para facilitar o filtro na URL
        nome: name,
        imagem: banner?.imagem_url || null,
        link: `/loja?categoria=${encodeURIComponent(String(name))}`
      };
    });

    return NextResponse.json(categoriesWithBanners);
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
