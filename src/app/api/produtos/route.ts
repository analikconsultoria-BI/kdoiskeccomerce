import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const busca = searchParams.get('busca') || '';
  const categoria = searchParams.get('categoria') || '';

  try {
    let query = supabaseAdmin
      .from('produtos_config')
      .select('*')
      .eq('ativo', true)
      .order('vendas_realizadas', { ascending: false })
      .order('ordem_exibicao', { ascending: true });

    if (busca) {
      // Sanitizar input para evitar injeção no filtro PostgREST
      const sanitizedBusca = busca.replace(/[%_\\'"()]/g, '');
      if (sanitizedBusca) {
        query = query.or(`nome_customizado.ilike.%${sanitizedBusca}%,nome_bling.ilike.%${sanitizedBusca}%`);
      }
    }

    if (categoria) {
      const sanitizedCategoria = categoria.replace(/[%_\\'"()]/g, '');
      query = query.eq('categoria_customizada', sanitizedCategoria);
    }

    const { data: produtos, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Falha ao buscar produtos');
    }

    // Montar o produto mesclando dados customizados com dados do Bling
    const finalProducts = (produtos || []).map((p: any) => ({
      id: p.bling_id,
      name: p.nome_customizado || p.nome_bling || 'Produto Sem Nome',
      slug: p.slug || p.bling_id,
      price: p.preco_promocional ? Number(p.preco_promocional) : Number(p.preco_bling || 0),
      originalPrice: p.preco_de ? Number(p.preco_de) : Number(p.preco_bling || 0),
      installments: { 
        count: p.parcelas_max || 12, 
        value: (p.preco_promocional || p.preco_bling || 0) / (p.parcelas_max || 12) 
      },
      pixPrice: (p.preco_promocional || p.preco_bling || 0) * (1 - (p.pix_desconto_percent || 5) / 100),
      category: { 
        id: p.categoria_customizada || 'geral', 
        name: p.categoria_customizada || 'Geral', 
        slug: p.categoria_customizada || 'geral', 
        description: '' 
      },
      rating: 0,
      reviewsCount: 0,
      soldCount: p.vendas_realizadas || 0,
      shortDescription: p.descricao_curta || p.descricao_bling || '',
      benefits: p.beneficios || [],
      description: p.descricao_completa || p.descricao_bling || '',
      specifications: p.especificacoes || {},
      images: p.imagens?.length > 0 ? p.imagens : (p.imagens_bling || []),
      inStock: Number(p.estoque_bling) > 0,
      badge: p.badge,
      freeShipping: p.frete_gratis || false,
      deliveryDays: p.prazo_entrega_dias || 7
    }));

    return NextResponse.json(finalProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // Cache reduzido pois agora lê direto do DB (rápido)
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
