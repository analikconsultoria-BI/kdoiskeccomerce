import { revalidatePath } from 'next/cache';

const BLING_API_URL = 'https://www.bling.com.br/Api/v3';

export async function blingFetch(path: string, options: RequestInit = {}) {
  let token = process.env.BLING_ACCESS_TOKEN;

  const url = `${BLING_API_URL}${path}`;
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 300, ...options.next },
  };

  let response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    console.warn('Bling Token Expired. Attempting refresh...');
    
    // Try to refresh the token
    const refreshResult = await refreshBlingToken();
    
    if (refreshResult.success) {
      // Retry with new token
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
export async function getProdutos(pagina = 1, limite = 100) {
  return blingFetch(`/produtos?pagina=${pagina}&limite=${limite}`);
}

export async function getProdutoById(id: string) {
  return blingFetch(`/produtos/${id}`);
}

export async function getCategorias() {
  return blingFetch('/categorias/produtos');
}

export async function getEstoque(produtoId: string) {
  return blingFetch(`/estoques/${produtoId}`);
}
