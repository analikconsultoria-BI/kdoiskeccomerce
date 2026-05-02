import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Proteger rotas privadas
  if (url.pathname.startsWith('/minha-conta') && !user) {
    url.pathname = '/entrar'
    return NextResponse.redirect(url)
  }

  // Redirecionar usuários logados das rotas de auth
  if ((url.pathname.startsWith('/entrar') || url.pathname.startsWith('/cadastrar')) && user) {
    url.pathname = '/minha-conta'
    return NextResponse.redirect(url)
  }

  // Segurança Adicional: Headers (CSP e outros)
  const headers = supabaseResponse.headers
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP Básico - pode precisar de ajustes se houver scripts externos (ex: Analytics, Vercel)
  // headers.set(
  //   'Content-Security-Policy',
  //   "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  // )

  return supabaseResponse
}
