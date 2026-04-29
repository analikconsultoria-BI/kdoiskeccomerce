import { NextRequest, NextResponse } from 'next/server';
import { getProdutoById } from '@/lib/bling';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const webhookSchema = z.object({
  data: z.object({
    id: z.number().or(z.string()).optional(),
  }).optional(),
  id: z.number().or(z.string()).optional()
}).passthrough();

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.BLING_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await request.json();
    const body = webhookSchema.parse(rawBody);
    
    const productId = body.data?.id || body.id;

    if (productId) {
      // Como o produto foi alterado, buscamos os dados novos direto da API do Bling
      // para ter o formato correto (imagens, descrições, etc)
      const res = await getProdutoById(String(productId), 0);
      const p = res?.data;

      if (p) {
        const imagens = [
          ...(p.midia?.imagens?.internas?.map((img: any) => img.link) || []),
          ...(p.midia?.imagens?.externas?.map((img: any) => img.link) || []),
        ];

        // Atualiza apenas campos _bling (se não existir, o upsert cria a linha com ativo = false por padrão do DB)
        const payload = {
          bling_id: String(p.id),
          nome_bling: p.nome,
          preco_bling: p.preco || 0,
          situacao_bling: p.situacao,
          descricao_bling: p.descricaoCurta || p.descricaoComplementar || p.descricao || '',
          imagens_bling: imagens
        };

        const { error } = await supabaseAdmin
          .from('produtos_config')
          .upsert(payload, { onConflict: 'bling_id' });

        if (error) console.error('Supabase upsert erro no webhook de produto:', error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 400 });
  }
}
