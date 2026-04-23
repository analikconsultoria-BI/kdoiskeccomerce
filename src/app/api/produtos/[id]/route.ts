import { NextRequest, NextResponse } from 'next/server';
import { getProdutoById, getEstoque } from '@/lib/bling';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const [productData, stockData] = await Promise.all([
      getProdutoById(id),
      getEstoque(id)
    ]);

    const product = productData.data;
    
    // Formata o retorno com descrição, variações e estoque
    const fullProduct = {
      ...product,
      estoque: stockData.data,
    };

    return NextResponse.json(fullProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
