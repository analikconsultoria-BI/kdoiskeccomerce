import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Bling Stock Webhook Received:', JSON.stringify(body, null, 2));

    // No Bling v3, o ID do produto costuma vir em body.data.id ou body.id dependendo da configuração
    // O ideal é validar a estrutura real conforme o log acima
    const productId = body.data?.produto?.id || body.data?.id || body.id;

    if (productId) {
      console.log(`Revalidating stock for product: ${productId}`);
      revalidatePath(`/produto/${productId}`);
      revalidateTag('estoque');
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error in Stock Webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
