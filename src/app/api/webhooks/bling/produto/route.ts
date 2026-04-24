import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Bling Product Webhook Received:', JSON.stringify(body, null, 2));

    // No Bling v3, o ID do produto costuma vir em body.data.id ou body.id
    const productId = body.data?.id || body.id;

    if (productId) {
      console.log(`Revalidating data for product: ${productId}`);
      revalidatePath(`/produto/${productId}`, 'page');
      revalidatePath('/loja', 'page');
      revalidatePath('/', 'page');
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error in Product Webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
