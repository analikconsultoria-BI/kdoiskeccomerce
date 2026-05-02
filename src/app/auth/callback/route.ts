import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient() // Deve ser await pois usa cookies() no Next 15+
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redireciona para o painel de controle após o login
  return NextResponse.redirect(`${origin}/minha-conta`)
}
