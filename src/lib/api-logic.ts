import { supabaseAdmin } from './supabase';

export async function getBanners(local?: string) {
  let query = supabaseAdmin
    .from('banners')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (local) {
    query = query.eq('local', local);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCategorias() {
  // 1. Buscar categorias únicas cadastradas nos produtos
  const { data: products, error: pError } = await supabaseAdmin
    .from('produtos_config')
    .select('categoria_customizada')
    .not('categoria_customizada', 'is', null);

  if (pError) throw pError;

  const uniqueCategoryNames = Array.from(new Set(
    (products as { categoria_customizada: string }[])
      .map((p: { categoria_customizada: string }) => p.categoria_customizada)
      .filter((name: string) => name && name.trim() !== '')
  )) as string[];

  if (uniqueCategoryNames.length === 0) return [];

  // 2. Buscar banners associados a essas categorias
  const { data: banners, error: bError } = await supabaseAdmin
    .from('banners')
    .select('*')
    .in('local', uniqueCategoryNames)
    .eq('ativo', true);

  if (bError) throw bError;

  // 3. Montar o objeto final
  return uniqueCategoryNames.map((name: string) => {
    const banner = (banners as any[])?.find((b: any) => b.local === name);
    return {
      id: name,
      nome: name,
      imagem: banner?.imagem_url || null,
      imagem_desktop_url: banner?.imagem_desktop_url || null,
      imagem_mobile_url: banner?.imagem_mobile_url || null,
      link: `/loja?categoria=${encodeURIComponent(String(name))}`
    };
  });
}
