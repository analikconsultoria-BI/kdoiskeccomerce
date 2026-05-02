import { NextResponse } from 'next/server';
import { getProdutos, getProdutoById, getEstoques, blingFetch } from '@/lib/bling';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    let pagina = 1;
    let itemsBling: any[] = [];
    let continuar = true;

    // 1. Busca TODAS as páginas de produtos (lista resumida)
    while (continuar) {
      console.log(`Buscando página ${pagina} do Bling...`);
      const res = await getProdutos(pagina, 100, 0);
      const produtos = res.data || [];
      itemsBling = [...itemsBling, ...produtos];

      if (produtos.length < 100) {
        continuar = false;
      } else {
        pagina++;
      }
      
      if (pagina > 10) continuar = false; 
    }

    if (itemsBling.length === 0) {
      return NextResponse.json({ message: 'Nenhum produto encontrado no Bling', synced: 0 });
    }

    // 2. Processamento Sequencial para detalhes e estoques (Respeitando 3 req/s)
    const resultadosFinais: any[] = [];
    console.log(`Iniciando processamento sequencial de ${itemsBling.length} produtos...`);
    
    for (const p of itemsBling) {
      try {
        console.log(`Sincronizando: ${p.nome} (${p.id})...`);
        
        // 1. Busca Detalhes (Req 1)
        const detailRes = await getProdutoById(String(p.id), 0);
        const produtoDetalhado = detailRes.data || p;

        // 2. Busca Estoque (Req 2)
        const estoqueData = await blingFetch(`/estoques/saldos?idsProdutos[]=${p.id}`, {}, 0);
        
        const estoque = estoqueData?.data?.[0]?.depositos?.[0]?.saldoFisico ?? 
                        estoqueData?.data?.[0]?.saldoFisico ?? 0;

        const imagens = [
          ...(produtoDetalhado.midia?.imagens?.internas?.map((img: any) => img.link) || []),
          ...(produtoDetalhado.midia?.imagens?.externas?.map((img: any) => img.link) || []),
        ];

        // Especificações automáticas
        const autoSpecs: Record<string, string> = {};
        if (produtoDetalhado.pesoLiquido > 0) autoSpecs['Peso Líquido'] = `${produtoDetalhado.pesoLiquido} kg`;
        if (produtoDetalhado.pesoBruto > 0) autoSpecs['Peso Bruto'] = `${produtoDetalhado.pesoBruto} kg`;
        
        if (produtoDetalhado.dimensoes) {
          const d = produtoDetalhado.dimensoes;
          if (d.largura > 0) autoSpecs['Largura'] = `${d.largura} cm`;
          if (d.altura > 0) autoSpecs['Altura'] = `${d.altura} cm`;
          if (d.profundidade > 0) autoSpecs['Profundidade'] = `${d.profundidade} cm`;
        }
        
        if (produtoDetalhado.marca) autoSpecs['Marca'] = produtoDetalhado.marca;
        if (produtoDetalhado.gtin) autoSpecs['GTIN/EAN'] = produtoDetalhado.gtin;
        
        if (produtoDetalhado.condicao) {
          const condicoes: Record<number, string> = { 1: 'Novo', 2: 'Usado', 3: 'Recondicionado' };
          const condLabel = condicoes[produtoDetalhado.condicao as number];
          if (condLabel) autoSpecs['Condição'] = condLabel;
        }

        resultadosFinais.push({
          bling_id: String(p.id),
          nome_bling: produtoDetalhado.nome,
          preco_bling: produtoDetalhado.preco || 0,
          situacao_bling: produtoDetalhado.situacao,
          estoque_bling: estoque,
          ativo: estoque > 0,
          descricao_bling: produtoDetalhado.descricaoCurta || produtoDetalhado.descricaoComplementar || '',
          imagens_bling: imagens,
          especificacoes: autoSpecs
        });

        // Delay de 800ms entre produtos (2 requisições por produto = ~2.5 req/s)
        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (e) {
        console.error(`Erro ao processar produto ${p.id}:`, e);
      }
    }

    // 3. Busca de Pedidos para cálculo de vendas_realizadas
    console.log("Iniciando sincronização de vendas dos pedidos...");
    
    async function buscarTodosPedidos() {
      let pg = 1;
      let todos: any[] = [];
      let cont = true;

      while (cont) {
        try {
          const data = await blingFetch(`/pedidos/vendas?pagina=${pg}&limite=100`, {}, false);
          const peds = data.data || [];
          todos = [...todos, ...peds];
          if (peds.length < 100) cont = false;
          else pg++;
        } catch (e: any) {
          console.error("Erro ao buscar pedidos:", e);
          cont = false;
        }
      }
      return todos;
    }

    const pedidosResumo = await buscarTodosPedidos();
    const vendasPorProduto: Record<string, number> = {};

    // Processar detalhes dos pedidos em lotes de 5 para calcular quantidades vendidas
    for (let i = 0; i < pedidosResumo.length; i += 5) {
      const lote = pedidosResumo.slice(i, i + 5);
      console.log(`Calculando lote de vendas: ${i} a ${i + 5}...`);
      
      await Promise.all(lote.map(async (ped: any) => {
        try {
          const detalhes = await blingFetch(`/pedidos/vendas/${ped.id}`, {}, false);
          for (const item of detalhes.data?.itens || []) {
            const id = String(item.produto?.id);
            if (id) {
              vendasPorProduto[id] = (vendasPorProduto[id] || 0) + (item.quantidade || 1);
            }
          }
        } catch (e) {
          // Ignorar erros individuais de pedidos
        }
      }));
      // Aguardar 2000ms entre lotes para não exceder limite da API (Bling v3 = ~3 req/s)
      await new Promise(r => setTimeout(r, 2000));
    }

    // 4. Upsert no Supabase mesclando com vendas e preservando especificações customizadas
    if (resultadosFinais.length > 0) {
      // Buscar especificações atuais para mesclar
      const { data: currentData } = await supabaseAdmin
        .from('produtos_config')
        .select('bling_id, especificacoes');
      
      const currentSpecsMap: Record<string, any> = {};
      currentData?.forEach((item: any) => {
        currentSpecsMap[item.bling_id] = item.especificacoes || {};
      });

      const finalData = resultadosFinais.map(r => ({
        ...r,
        vendas_realizadas: vendasPorProduto[r.bling_id] || 0,
        especificacoes: {
          ...r.especificacoes,
          ...(currentSpecsMap[r.bling_id] || {})
        }
      }));

      const { error } = await supabaseAdmin
        .from('produtos_config')
        .upsert(finalData, { onConflict: 'bling_id' });

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error('Falha ao salvar produtos no Supabase');
      }
    }

    return NextResponse.json({ 
      synced: resultadosFinais.length,
      ordersProcessed: pedidosResumo.length
    });
  } catch (error: any) {
    console.error('Sync Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: error.message === 'TOKEN_EXPIRED' ? 401 : 500 });
  }
}
