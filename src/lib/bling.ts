import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';

const BLING_API_URL = 'https://www.bling.com.br/Api/v3';

// Variável para evitar múltiplas renovações de token simultâneas
let refreshPromise: Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> | null = null;

export async function blingFetch(path: string, options: RequestInit = {}, revalidate: number | false = 300, retryCount = 0) {
  // Busca o token mais recente no banco
  const { data: tokenData } = await supabaseAdmin
    .from('bling_tokens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  let token = tokenData?.access_token;

  const url = `${BLING_API_URL}${path}`;
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: revalidate !== false ? { 
      revalidate: typeof revalidate === 'number' ? revalidate : undefined, 
      ...options.next 
    } : undefined,
    cache: revalidate === false ? 'no-store' : options.cache,
  };

  let response = await fetch(url, defaultOptions);

  // Se atingir o limite (429), tenta novamente após um delay progressivo
  if (response.status === 429 && retryCount < 5) {
    const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s...
    console.warn(`Bling Rate Limit hit. Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return blingFetch(path, options, revalidate, retryCount + 1);
  }

  if (response.status === 401) {
    console.warn('Bling Token Expired. Attempting refresh...');
    
    // Se já houver uma renovação em curso, aguarda ela
    if (!refreshPromise) {
      refreshPromise = refreshBlingToken();
    }
    
    const refreshResult = await refreshPromise;
    
    // Reseta a promise após a conclusão (para futuras expirações)
    if (refreshPromise) {
      refreshPromise = null;
    }

    if (refreshResult.success) {
      const newOptions = {
        ...defaultOptions,
        headers: {
          ...defaultOptions.headers,
          'Authorization': `Bearer ${refreshResult.accessToken}`,
        },
      };
      response = await fetch(url, newOptions);
    } else {
      console.error('Failed to refresh Bling token:', refreshResult.error);
      throw new Error('TOKEN_EXPIRED');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Bling API Error: ${response.status}`);
  }

  return response.json();
}

export async function refreshBlingToken() {
  const clientId = process.env.BLING_CLIENT_ID;
  const clientSecret = process.env.BLING_CLIENT_SECRET;
  
  const { data: tokenData } = await supabaseAdmin
    .from('bling_tokens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const refreshToken = tokenData?.refresh_token;

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push('BLING_CLIENT_ID');
    if (!clientSecret) missing.push('BLING_CLIENT_SECRET');
    if (!refreshToken) missing.push('refresh_token (Supabase)');
    return { success: false, error: `Missing credentials for refresh: ${missing.join(', ')}` };
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Bling Refresh API Error:', errorData);
      return { success: false, error: errorData.error_description || errorData.error || 'Failed to refresh token' };
    }

    const data = await response.json();
    
    // Salvar novos tokens no Supabase (usando update no ID 1 para manter um único registro ativo)
    await supabaseAdmin
      .from('bling_tokens')
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null
      })
      .eq('id', 1);

    return { 
      success: true, 
      accessToken: data.access_token, 
      refreshToken: data.refresh_token 
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Helper functions
export async function getProdutos(pagina = 1, limite = 100, revalidate = 300, pesquisa?: string) {
  let path = `/produtos?pagina=${pagina}&limite=${limite}`;
  if (pesquisa) {
    path += `&nome=${encodeURIComponent(pesquisa)}`;
  }
  return blingFetch(path, {}, revalidate);
}

export async function getProdutoById(id: string, revalidate = 300) {
  return blingFetch(`/produtos/${id}`, {}, revalidate);
}

export async function getCategorias(revalidate = 3600) {
  return blingFetch('/categorias/produtos', {}, revalidate);
}

export async function getEstoques(produtoIds: string[], revalidate: number | false = 60) {
  const idsQuery = produtoIds.map(id => `idsProdutos[]=${id}`).join('&');
  return blingFetch(`/estoques/saldos?${idsQuery}`, {}, revalidate);
}
