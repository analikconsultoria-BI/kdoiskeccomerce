import { NextRequest, NextResponse } from 'next/server';
import { getProdutos, getProdutoById } from '@/lib/bling';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pagina = Number(searchParams.get('pagina')) || 1;
  const limite = Number(searchParams.get('limite')) || 24; // Reduzi o limite padrão para não estourar a API do Bling com muitas chamadas paralelas

  try {
    const lista = await getProdutos(pagina, limite, 86400);
    
    // Busca os detalhes de cada produto em paralelo para obter as imagens (que não vêm na listagem)
    // Usamos revalidate de 24h (86400) já que imagens não mudam sempre
    const detalhes = await Promise.all(
      lista.data.map((p: any) => 
        getProdutoById(String(p.id), 86400)
          .then(res => res.data)
          .catch(() => p)
      )
    );

    // Mapeia para o formato da interface Product do frontend
    const mappedProducts = detalhes.map((p: any) => ({
      id: String(p.id),
      name: p.nome,
      slug: String(p.id),
      price: p.preco || 0,
      installments: { count: 12, value: (p.preco || 0) / 12 },
      pixPrice: (p.preco || 0) * 0.95,
      category: { 
        id: String(p.categoria?.id || ''), 
        name: p.categoria?.descricao || p.categoria?.nome || 'Geral', 
        slug: '', 
        description: '' 
      },
      rating: 0,
      reviewsCount: 0,
      soldCount: 0,
      shortDescription: p.descricaoCurta || '',
      benefits: [],
      description: p.descricao || '',
      specifications: {},
      images: [
        ...(p.midia?.imagens?.internas?.map((img: any) => img.linkMiniatura || img.link) || []),
        ...(p.midia?.imagens?.externas?.map((img: any) => img.link) || []),
      ],
      inStock: p.situacao === 'A',
      badge: undefined,
      freeShipping: false,
      deliveryDays: 7
    }));

    // Cache de 5 minutos (300 segundos) para evitar flood no Bling
    return NextResponse.json(mappedProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
