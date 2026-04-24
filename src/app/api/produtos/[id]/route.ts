import { NextRequest, NextResponse } from 'next/server';
import { getProdutoById, getEstoque } from '@/lib/bling';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log(`Fetching Bling product ID: ${id}`);
    
    // Busca dados do produto (1h de cache)
    const productData = await getProdutoById(id, 3600);
    
    if (!productData || !productData.data) {
      console.error(`Bling product NOT FOUND for ID: ${id}. Response:`, JSON.stringify(productData));
      return NextResponse.json({ 
        error: 'Produto não encontrado no Bling',
        details: `ID ${id} não retornou dados da API v3`
      }, { status: 404 });
    }

    const p = productData.data;

    let estoque = null;
    try {
      // Busca estoque em tempo real (sem cache)
      const stockData = await getEstoque(id, false);
      estoque = stockData?.data?.[0] ?? null;
    } catch (err) {
      console.error('Stock fetch failed (non-critical):', err);
      estoque = null;
    }

    const hasStock = estoque ? (estoque.saldoVirtualTotal > 0 || estoque.saldoRealTotal > 0) : true;

    // Mapeia para o formato da interface Product do frontend (mantendo compatibilidade)
    const mappedProduct = {
      ...p,
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
      description: p.descricaoCurta || p.descricaoComplementar || p.descricao || '',
      specifications: {},
      images: [
        ...(p.midia?.imagens?.internas?.map((img: any) => img.link) || []),
        ...(p.midia?.imagens?.externas?.map((img: any) => img.link) || []),
      ],
      inStock: p.situacao === 'A' && hasStock,
      badge: undefined,
      freeShipping: false,
      deliveryDays: 7,
      estoque: estoque
    };

    return NextResponse.json(mappedProduct);
  } catch (error: any) {
    console.error('Fatal error in /api/produtos/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
