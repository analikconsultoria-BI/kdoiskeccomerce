"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ArrowLeft, Save, ShoppingCart, ExternalLink, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';

export default function EditProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const { data } = await supabase.from('produtos_config').select('*').eq('bling_id', id).single();
      if (data) {
        setProduto(data);
        // Inicializar lista de especificações
        const specArray = Object.entries(data.especificacoes || {}).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setSpecs(specArray);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const [specs, setSpecs] = useState<{ key: string, value: string }[]>([]);

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
    
    // Atualizar o objeto no produto para salvar
    const specObject: Record<string, string> = {};
    newSpecs.forEach(s => {
      if (s.key.trim()) specObject[s.key.trim()] = s.value;
    });
    setProduto((prev: any) => ({ ...prev, especificacoes: specObject }));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    
    const specObject: Record<string, string> = {};
    newSpecs.forEach(s => {
      if (s.key.trim()) specObject[s.key.trim()] = s.value;
    });
    setProduto((prev: any) => ({ ...prev, especificacoes: specObject }));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!mounted) return null;

  const handleChange = (field: string, value: any) => {
    setProduto((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('produtos_config').update(produto).eq('bling_id', id);
    if (error) setMessage({ text: 'Erro ao salvar: ' + error.message, type: 'error' });
    else setMessage({ text: 'Alterações salvas com sucesso!', type: 'success' });
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Carregando detalhes do produto...</div>;
  if (!produto) return <div className="p-8 text-center text-red-500 font-bold underline">Produto não encontrado.</div>;

  const tabs = [
    { id: 'geral', label: 'Geral' },
    { id: 'conteudo', label: 'Conteúdo' },
    { id: 'preco', label: 'Preço e Frete' },
    { id: 'marketplaces', label: 'Marketplaces' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">
      {/* Toast Notification */}
      {message && (
        <Toast 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos" className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Editar Catálogo</h2>
            <p className="text-slate-500 font-medium truncate max-w-[300px]">{produto.nome_customizado || produto.nome_bling}</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-brand-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-700 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-100 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto justify-center"
        >
          <Save className="w-4 h-4" /> {saving ? 'Processando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Customizado</label>
                  <input type="text" value={produto.nome_customizado || ''} onChange={e => handleChange('nome_customizado', e.target.value)} placeholder={`Original: ${produto.nome_bling}`} className="w-full border rounded-lg p-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug (URL amigável)</label>
                  <input type="text" value={produto.slug || ''} onChange={e => handleChange('slug', e.target.value)} placeholder="ex: caneca-personalizada" className="w-full border rounded-lg p-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria Customizada</label>
                  <input type="text" value={produto.categoria_customizada || ''} onChange={e => handleChange('categoria_customizada', e.target.value)} placeholder="Ex: Casa, Cozinha..." className="w-full border rounded-lg p-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge</label>
                  <select value={produto.badge || ''} onChange={e => handleChange('badge', e.target.value || null)} className="w-full border rounded-lg p-2.5 bg-white">
                    <option value="">Nenhum</option>
                    <option value="Novo">Novo</option>
                    <option value="Mais Vendido">Mais Vendido</option>
                    <option value="Promoção">Promoção</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-8 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={produto.ativo} onChange={e => handleChange('ativo', e.target.checked)} className="w-5 h-5 rounded text-brand-600" />
                  <span className="font-medium">Produto Ativo na Loja</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={produto.destaque} onChange={e => handleChange('destaque', e.target.checked)} className="w-5 h-5 rounded text-brand-600" />
                  <span className="font-medium">Destaque na Home</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'conteudo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Descrição Curta</label>
                <textarea rows={3} value={produto.descricao_curta || ''} onChange={e => handleChange('descricao_curta', e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Pequeno resumo para o topo da página do produto..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição Completa</label>
                <textarea rows={6} value={produto.descricao_completa || ''} onChange={e => handleChange('descricao_completa', e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Substitui a descrição longa que vem do Bling..."></textarea>
                <p className="text-xs text-gray-500 mt-1">Se vazio, usará a descrição vinda do Bling.</p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Especificações Técnicas</h3>
                    <p className="text-xs text-slate-500">Dados técnicos do produto (Peso, Dimensões, etc)</p>
                  </div>
                  <button 
                    onClick={addSpec}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Especificação
                  </button>
                </div>

                <div className="space-y-3">
                  {specs.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm italic">
                      Nenhuma especificação cadastrada.
                    </div>
                  )}
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-3 items-start animate-fade-in">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={spec.key} 
                          onChange={e => handleSpecChange(index, 'key', e.target.value)}
                          placeholder="Nome (ex: Voltagem)" 
                          className="w-full border rounded-lg p-2 text-sm" 
                        />
                      </div>
                      <div className="flex-2">
                        <input 
                          type="text" 
                          value={spec.value} 
                          onChange={e => handleSpecChange(index, 'value', e.target.value)}
                          placeholder="Valor (ex: 110v)" 
                          className="w-full border rounded-lg p-2 text-sm" 
                        />
                      </div>
                      <button 
                        onClick={() => removeSpec(index)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preco' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-sm text-gray-500 font-medium mb-1">Preço Original (Bling)</label>
                  <div className="text-xl font-bold text-gray-700">R$ {Number(produto.preco_bling || 0).toFixed(2)}</div>
                  <p className="text-xs text-gray-400 mt-1">Somente leitura. Alterar no Bling.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Preço Promocional (Sobrescreve Bling)</label>
                  <input type="number" step="0.01" value={produto.preco_promocional || ''} onChange={e => handleChange('preco_promocional', e.target.value)} placeholder="Ex: 99.90" className="w-full border border-brand-300 focus:ring-2 ring-brand-100 rounded-lg p-2.5" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Preço "De" (Exibido riscado)</label>
                  <input type="number" step="0.01" value={produto.preco_de || ''} onChange={e => handleChange('preco_de', e.target.value)} placeholder="Ex: 149.90" className="w-full border rounded-lg p-2.5" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Desconto PIX (%)</label>
                  <input type="number" value={produto.pix_desconto_percent || ''} onChange={e => handleChange('pix_desconto_percent', e.target.value)} placeholder="Deixe em branco para usar o padrão da loja" className="w-full border rounded-lg p-2.5" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Parcelas Máximas</label>
                  <input type="number" value={produto.parcelas_max || ''} onChange={e => handleChange('parcelas_max', e.target.value)} placeholder="Ex: 12" className="w-full border rounded-lg p-2.5" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prazo de Entrega Estimado (Dias)</label>
                  <input type="number" value={produto.prazo_entrega_dias || ''} onChange={e => handleChange('prazo_entrega_dias', e.target.value)} className="w-full border rounded-lg p-2.5" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={produto.frete_gratis} onChange={e => handleChange('frete_gratis', e.target.checked)} className="w-5 h-5 rounded text-brand-600" />
                  <span className="font-medium text-green-600">Frete Grátis</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'marketplaces' && (
            <div className="space-y-8">
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Venda em Outros Canais</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2">
                      Link da Shopee
                      {produto.link_shopee && <ExternalLink className="w-3 h-3 text-brand-500" />}
                    </label>
                    <input 
                      type="text" 
                      value={produto.link_shopee || ''} 
                      onChange={e => handleChange('link_shopee', e.target.value)} 
                      placeholder="https://shopee.com.br/produto..." 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 ring-orange-100 transition-all" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-2">
                      Link do Mercado Livre
                      {produto.link_mercadolivre && <ExternalLink className="w-3 h-3 text-brand-500" />}
                    </label>
                    <input 
                      type="text" 
                      value={produto.link_mercadolivre || ''} 
                      onChange={e => handleChange('link_mercadolivre', e.target.value)} 
                      placeholder="https://produto.mercadolivre.com.br/MLB-..." 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 ring-blue-100 transition-all" 
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/50 rounded-xl border border-orange-100/50 flex gap-3">
                  <div className="p-2 bg-white rounded-lg h-fit">
                    <Save className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Esses links aparecerão na página do produto para o cliente. É uma ótima forma de dar segurança extra na compra ou aproveitar benefícios desses marketplaces.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Título (SEO)</label>
                <input type="text" value={produto.meta_titulo || ''} onChange={e => handleChange('meta_titulo', e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Título para o Google (máx 60 caracteres)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Descrição (SEO)</label>
                <textarea rows={3} value={produto.meta_descricao || ''} onChange={e => handleChange('meta_descricao', e.target.value)} className="w-full border rounded-lg p-2.5" placeholder="Descrição para os resultados de busca (máx 160 caracteres)"></textarea>
              </div>

              {/* Preview */}
              <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white max-w-2xl">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Preview Google</h3>
                <div className="text-[#1a0dab] text-xl font-medium truncate">
                  {produto.meta_titulo || produto.nome_customizado || produto.nome_bling} - KdoisK
                </div>
                <div className="text-[#006621] text-sm truncate my-1">
                  https://kdoisk.com.br/produto/{produto.slug || produto.bling_id}
                </div>
                <div className="text-[#545454] text-sm line-clamp-2">
                  {produto.meta_descricao || produto.descricao_curta || 'Nenhuma descrição informada. Preencha os dados de SEO para otimizar sua taxa de clique.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
