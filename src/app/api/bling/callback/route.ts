import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code not provided' }, { status: 400 });
  }

  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.BLING_REDIRECT_URI || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Salvar no Supabase (usando update no ID 1 para garantir a atualização do registro existente)
    const { error: dbError } = await supabaseAdmin
      .from('bling_tokens')
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null
      })
      .eq('id', 1);

    if (dbError) {
      console.error('Erro ao salvar tokens no banco:', dbError);
      return NextResponse.json({ error: 'Erro ao salvar tokens no banco' }, { status: 500 });
    }

    // Redirecionar de volta para o painel de conexão
    return NextResponse.redirect(new URL('/admin/bling-connect?success=true', request.url));
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
