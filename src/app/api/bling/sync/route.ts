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

    // 2. Processamento em lotes de 10 para detalhes e estoques
    const resultadosFinais: any[] = [];
    const chunks = [];
    for (let i = 0; i < itemsBling.length; i += 10) {
      chunks.push(itemsBling.slice(i, i + 10));
    }

    console.log(`Iniciando processamento de ${itemsBling.length} produtos em lotes de 10...`);
    
    for (const chunk of chunks) {
      const promessas = chunk.map(async (p: any) => {
        try {
          // Busca Detalhes
          const detailRes = await getProdutoById(String(p.id), 0);
          const produtoDetalhado = detailRes.data || p;

          // Busca Estoque Individualmente (Conforme solicitado)
          const estoqueData = await blingFetch(`/estoques/saldos?idsProdutos[]=${p.id}`, {}, 0);
          
          // Estrutura solicitada: data[0].depositos[0].saldoFisico
          // No Bling v3, o retorno de /estoques/saldos é uma lista de produtos. 
          // Se passamos um ID, o data[0] é o produto, e ele tem saldoFisico/saldoVirtual ou depositos[]
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

          return {
            bling_id: String(p.id),
            nome_bling: produtoDetalhado.nome,
            preco_bling: produtoDetalhado.preco || 0,
            situacao_bling: produtoDetalhado.situacao,
            estoque_bling: estoque,
            ativo: estoque > 0,
            descricao_bling: produtoDetalhado.descricaoCurta || produtoDetalhado.descricaoComplementar || '',
            imagens_bling: imagens,
            especificacoes: autoSpecs
          };
        } catch (e) {
          console.error(`Erro ao processar produto ${p.id}:`, e);
          return null;
        }
      });

      const batchResults = await Promise.all(promessas);
      resultadosFinais.push(...batchResults.filter(r => r !== null));

      // Pequeno delay para respeitar o limite de 3 req/s (já que fizemos ~20 requisições nesse lote)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Busca de Pedidos para cálculo de vendas_realizadas
    console.log("Iniciando sincronização de vendas dos pedidos...");
    
    async function buscarTodosPedidos() {
      let pg = 1;
      let todos: any[] = [];
      let cont = true;
      while (cont) {
        try {
          const res = await blingFetch(`/pedidos/vendas?pagina=${pg}&limite=100`, { cache: 'no-store' });
          const peds = res.data || [];
          todos = [...todos, ...peds];
          if (peds.length < 100 || pg >= 20) cont = false; // Limite de 20 páginas por segurança
          else pg++;
        } catch (e: any) {
          if (e.message.includes('insufficient_scope')) {
            console.error("ERRO CRÍTICO: O Token do Bling não tem permissão para acessar Pedidos. É necessário reautorizar o App no Bling com o escopo de Vendas.");
          } else {
            console.error("Erro ao buscar pedidos:", e);
          }
          cont = false;
        }
      }
      return todos;
    }

    const pedidosResumo = await buscarTodosPedidos();
    const vendasPorProduto: Record<string, number> = {};

    // Processar detalhes dos pedidos em lotes para calcular quantidades vendidas
    const pedidoChunks = [];
    for (let i = 0; i < pedidosResumo.length; i += 5) {
      pedidoChunks.push(pedidosResumo.slice(i, i + 5));
    }

    console.log(`Processando detalhes de ${pedidosResumo.length} pedidos para calcular vendas...`);
    for (const chunk of pedidoChunks) {
      await Promise.all(chunk.map(async (ped: any) => {
        try {
          const detalhes = await blingFetch(`/pedidos/vendas/${ped.id}`, { cache: 'no-store' });
          for (const item of detalhes.data?.itens || []) {
            const id = String(item.produto?.id);
            if (id) {
              vendasPorProduto[id] = (vendasPorProduto[id] || 0) + (item.quantidade || 0);
            }
          }
        } catch (e) {
          console.error(`Erro ao buscar detalhes do pedido ${ped.id}:`, e);
        }
      }));
      // Delay para respeitar rate limit do Bling
      await new Promise(resolve => setTimeout(resolve, 1000));
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
          ...r.especificacoes, // Auto specs vindas do Bling agora
          ...(currentSpecsMap[r.bling_id] || {}) // Specs já existentes (custom ou auto antigas) ganham preferência
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
