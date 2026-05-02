import { updateSession } from '@/lib/supabase-middleware'
import { NextRequest, NextResponse } from 'next/server'

// Rate Limiting Simples na Memória (LRU Cache)
// Como o Vercel Edge não suporta lru-cache normal bem (às vezes), 
// e não foi fornecido um Redis, faremos um controle básico usando uma Map global
// Note: no ambiente serverless (Vercel), a Map pode resetar entre instâncias.
// Para produção máxima segurança, recomenda-se Upstash Redis.
const rateLimitMap = new Map<string, { count: number, resetAt: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now()
  const windowData = rateLimitMap.get(ip)

  if (!windowData) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (now > windowData.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (windowData.count >= limit) {
    return { success: false }
  }

  windowData.count++
  return { success: true }
}

export async function proxy(request: NextRequest) {
  // Aplicar Rate Limit nas Rotas de Auth
  if (request.nextUrl.pathname.startsWith('/api/auth') || request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    let limit = 50 // default
    let windowMs = 60 * 1000 // 1 minute

    if (request.nextUrl.pathname.includes('/entrar')) {
      limit = 5 // 5 requests per minute
    } else if (request.nextUrl.pathname.includes('/cadastrar') || request.nextUrl.pathname.includes('/esqueci-senha')) {
      limit = 3 // 3 requests per minute
    }

    const rateLimit = checkRateLimit(ip, limit, windowMs)
    if (!rateLimit.success) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`)
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Atualizar sessão Supabase e verificar rotas (/minha-conta)
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
