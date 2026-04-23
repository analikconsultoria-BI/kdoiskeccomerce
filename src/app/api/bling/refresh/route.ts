import { NextResponse } from 'next/server';
import { refreshBlingToken } from '@/lib/bling';

export async function GET() {
  const result = await refreshBlingToken();

  if (result.success) {
    return NextResponse.json({
      message: 'Token renovado com sucesso!',
      BLING_ACCESS_TOKEN: result.accessToken,
      BLING_REFRESH_TOKEN: result.refreshToken,
    });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
