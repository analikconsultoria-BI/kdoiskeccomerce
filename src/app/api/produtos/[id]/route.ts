import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Sanitizar input para evitar injeção no filtro PostgREST
    const sanitizedId = id.replace(/[%_\\'"(),]/g, '');
    
    // Busca por slug OU bling_id
    const { data: p, error } = await supabaseAdmin
      .from('produtos_config')
      .select('*')
      .or(`slug.eq.${sanitizedId},bling_id.eq.${sanitizedId}`)
      .single();

    if (error || !p) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
      }
      throw error;
    }

    // Se estiver inativo e a chamada não for do admin (simplificação: vamos retornar 404 se não ativo para APIs públicas)
    // Para simplificar, deixamos retornar os dados se acessado diretamente por ID, mas o front decide exibir ou não,
    // ou podemos forçar 404 se ativo == false.
    if (!p.ativo) {
       return NextResponse.json({ error: 'Produto indisponível' }, { status: 404 });
    }

    const finalProduct = {
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
      soldCount: 0,
      shortDescription: p.descricao_curta || p.descricao_bling || '',
      benefits: p.beneficios || [],
      description: p.descricao_completa || p.descricao_bling || '',
      specifications: p.especificacoes || {},
      images: p.imagens?.length > 0 ? p.imagens : (p.imagens_bling || []),
      inStock: Number(p.estoque_bling) > 0,
      badge: p.badge,
      freeShipping: p.frete_gratis || false,
      deliveryDays: p.prazo_entrega_dias || 7,
      
      // Meta SEO
      metaTitle: p.meta_titulo,
      metaDescription: p.meta_descricao,

      // Marketplaces
      link_shopee: p.link_shopee,
      link_mercadolivre: p.link_mercadolivre
    };

    return NextResponse.json(finalProduct, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
