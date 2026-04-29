import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const estoqueWebhookSchema = z.object({
  data: z.object({
    produto: z.object({
      id: z.number().or(z.string()).optional()
    }).optional(),
    id: z.number().or(z.string()).optional(),
    depositos: z.array(z.object({
      saldoFisico: z.number().optional()
    }).passthrough()).optional(),
    saldoFisico: z.number().optional()
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
    const body = estoqueWebhookSchema.parse(rawBody);
    
    // Tentando extrair o ID e o saldo do payload
    const productId = body.data?.produto?.id || body.data?.id || body.id;
    // Conforme regra definida: ler apenas o saldo do primeiro depósito retornado (índice 0)
    const saldo = body?.data?.depositos?.[0]?.saldoFisico ?? body?.data?.saldoFisico ?? 0;

    if (productId) {
      const estoque = Number(saldo);
      // Se estoque zerado, desativa. Se voltou pro estoque, ativa.
      const isAtivo = estoque > 0;

      const { error } = await supabaseAdmin
        .from('produtos_config')
        .update({ 
          estoque_bling: estoque,
          ativo: isAtivo 
        })
        .eq('bling_id', String(productId));
      
      if (error) console.error('Supabase update erro no webhook de estoque:', error);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook estoque processing error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 400 });
  }
}
