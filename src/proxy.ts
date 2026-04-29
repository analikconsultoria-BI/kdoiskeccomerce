import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Rate Limiter em memória (limitado a instâncias locais ou single edge, mas já oferece proteção básica)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

function checkRateLimit(ip: string, route: string, maxRequests: number, windowMs: number): boolean {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'unknown';

  // --- RATE LIMITING ---
  if (pathname.startsWith('/api/bling/callback')) {
    if (!checkRateLimit(ip, 'callback', 5, 60000)) { // 5 req/min
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }
  if (pathname.startsWith('/admin/login')) {
    if (!checkRateLimit(ip, 'login', 10, 60000)) { // 10 req/min
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }
  if (pathname.startsWith('/api/checkout')) {
    if (!checkRateLimit(ip, 'checkout', 20, 60000)) { // 20 req/min
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // --- API ROUTES PROTECTION ---
  if (pathname === '/api/bling/sync') {
    if (request.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
  }

  // --- ADMIN AUTH & ROLE VALIDATION ---
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/bling/:path*', 
    '/api/checkout/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
