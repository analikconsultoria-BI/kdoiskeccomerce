import { NextResponse } from 'next/server';
import { getCategorias } from '@/lib/bling';

export async function GET() {
  try {
    const data = await getCategorias();
    
    // Mapeia para id, nome, pai
    const simplifiedCategories = data.data.map((c: any) => ({
      id: c.id,
      nome: c.descricao,
      pai: c.idCategoriaPai,
    }));

    return NextResponse.json(simplifiedCategories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
