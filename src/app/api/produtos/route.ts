import { NextRequest, NextResponse } from 'next/server';
import { getProdutos } from '@/lib/bling';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pagina = Number(searchParams.get('pagina')) || 1;
  const limite = Number(searchParams.get('limite')) || 100;

  try {
    const data = await getProdutos(pagina, limite);
    
    // Mapeia para o formato solicitado: id, nome, preco, codigo, imagens, situacao
    const simplifiedProducts = data.data.map((p: any) => ({
      id: p.id,
      nome: p.nome,
      preco: p.preco,
      codigo: p.codigo,
      imagens: p.midia?.imagens?.externas || [],
      situacao: p.situacao,
    }));

    return NextResponse.json(simplifiedProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
