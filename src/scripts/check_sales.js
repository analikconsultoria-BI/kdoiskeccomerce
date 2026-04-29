const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltam variáveis de ambiente Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSales() {
  const { data, error } = await supabase
    .from('produtos_config')
    .select('nome_bling, vendas_realizadas')
    .gt('vendas_realizadas', 0);

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  if (data.length === 0) {
    console.log("Nenhum produto com vendas registradas ainda. Certifique-se de rodar o Sync no admin.");
  } else {
    console.log("Produtos com vendas sincronizadas:");
    data.forEach(p => {
      console.log(`- ${p.nome_bling}: ${p.vendas_realizadas} vendas`);
    });
  }
}

checkSales();
