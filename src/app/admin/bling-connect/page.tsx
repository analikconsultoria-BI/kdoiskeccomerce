import { ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';

export default async function BlingConnectPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const params = await searchParams;
  const clientId = process.env.BLING_CLIENT_ID;
  const redirectUri = process.env.BLING_REDIRECT_URI;
  const success = params.success === 'true';

  const state = Math.random().toString(36).substring(7);
  const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&state=${state}`;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <RefreshCw className="w-10 h-10 text-brand-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Conexão com Bling ERP</h1>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Mantenha seu catálogo e estoque sincronizados automaticamente. <br/>
          Caso o token expire ou precise de reautorização, use o botão abaixo.
        </p>

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 font-bold justify-center animate-fade-in">
            <ShieldCheck className="w-5 h-5" />
            Conexão realizada com sucesso!
          </div>
        )}

        <div className="flex flex-col gap-4">
          <a 
            href={authUrl}
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Conectar com Bling
          </a>
          
          <p className="text-xs text-slate-400 font-medium">
            Você será redirecionado para o Bling para autorizar o acesso.
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-700 mb-2">Escopos Necessários</h4>
            <ul className="text-xs text-slate-500 space-y-2 font-medium">
               <li>• Produtos (Leitura/Escrita)</li>
               <li>• Estoques (Leitura)</li>
               <li>• Vendas (Leitura)</li>
            </ul>
         </div>
         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-700 mb-2">Segurança</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Seus tokens são armazenados de forma persistente em nosso banco de dados e renovados automaticamente.
            </p>
         </div>
      </div>
    </div>
  );
}
