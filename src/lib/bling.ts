import { revalidatePath } from 'next/cache';

const BLING_API_URL = 'https://www.bling.com.br/Api/v3';

export async function blingFetch(path: string, options: RequestInit = {}, revalidate: number | false = 300, retryCount = 0) {
  let token = process.env.BLING_ACCESS_TOKEN;

  const url = `${BLING_API_URL}${path}`;
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { 
      revalidate: typeof revalidate === 'number' ? revalidate : undefined, 
      ...options.next 
    },
    cache: revalidate === false ? 'no-store' : options.cache,
  };

  let response = await fetch(url, defaultOptions);

  // Se atingir o limite (429), tenta novamente após um pequeno delay
  if (response.status === 429 && retryCount < 3) {
    const delay = (retryCount + 1) * 1000;
    console.warn(`Bling Rate Limit hit. Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return blingFetch(path, options, revalidate, retryCount + 1);
  }

  if (response.status === 401) {
    console.warn('Bling Token Expired. Attempting refresh...');
    const refreshResult = await refreshBlingToken();
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
  const refreshToken = process.env.BLING_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return { success: false, error: 'Missing credentials for refresh' };
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
      return { success: false, error: 'Failed to refresh token' };
    }

    const data = await response.json();
    
    // Update tokens (Note: This only updates in memory for the current process/request chain)
    // In a real app, you MUST save these to a database.
    process.env.BLING_ACCESS_TOKEN = data.access_token;
    process.env.BLING_REFRESH_TOKEN = data.refresh_token;

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
export async function getProdutos(pagina = 1, limite = 100, revalidate = 300) {
  return blingFetch(`/produtos?pagina=${pagina}&limite=${limite}`, {}, revalidate);
}

export async function getProdutoById(id: string, revalidate = 300) {
  return blingFetch(`/produtos/${id}`, {}, revalidate);
}

export async function getCategorias(revalidate = 3600) {
  return blingFetch('/categorias/produtos', {}, revalidate);
}

export async function getEstoque(produtoId: string, revalidate: number | false = 60) {
  return blingFetch(`/estoques/saldos?idsProdutos[]=${produtoId}`, {}, revalidate);
}
