"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/ui/Toast';
import { Save, Settings, Phone, Mail, Share2, CreditCard, Truck, Percent, Camera, Users, Video, Globe, ShoppingCart, ListChecks } from 'lucide-react';

export default function AdminConfiguracoes() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [activeHomeCategories, setActiveHomeCategories] = useState<string[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const fetchConfigs = async () => {
    const { data } = await supabase.from('configuracoes_loja').select('*');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach(c => map[c.chave] = c.valor);
      setConfigs(map);
      
      if (map['categorias_home_ativas']) {
        try {
          setActiveHomeCategories(JSON.parse(map['categorias_home_ativas']));
        } catch (e) {
          setActiveHomeCategories([]);
        }
      }
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAvailableCategories(data.map(c => c.nome));
      }
    } catch (e) {
      console.error('Erro ao buscar categorias:', e);
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchConfigs();
    fetchCategories();
  }, []);

  if (!mounted) return null;

  const handleChange = (chave: string, valor: string) => {
    setConfigs(prev => ({ ...prev, [chave]: valor }));
  };

  const handleSave = async (chave: string) => {
    const { error } = await supabase.from('configuracoes_loja').upsert({ chave, valor: configs[chave] }, { onConflict: 'chave' });
    if (error) {
      setMessage({ text: 'Erro ao salvar configuração.', type: 'error' });
    } else {
      setMessage({ text: 'Configuração salva com sucesso!', type: 'success' });
    }
  };

  const toggleCategoryHome = async (nome: string) => {
    const newActive = activeHomeCategories.includes(nome)
      ? activeHomeCategories.filter(c => c !== nome)
      : [...activeHomeCategories, nome];
    
    setActiveHomeCategories(newActive);
    
    const { error } = await supabase.from('configuracoes_loja').upsert({ 
      chave: 'categorias_home_ativas', 
      valor: JSON.stringify(newActive) 
    }, { onConflict: 'chave' });

    if (error) {
      setMessage({ text: 'Erro ao salvar categorias na home.', type: 'error' });
    } else {
      setMessage({ text: 'Lista de categorias atualizada!', type: 'success' });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl pb-12">
      {message && (
        <Toast 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configurações</h2>
        <p className="text-slate-500 font-medium">Ajuste os detalhes gerais e regras de negócio da sua loja.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Geral */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-50 rounded-lg">
              <Settings className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Geral & Contato</h3>
          </div>
          
          <div className="space-y-4">
            <ConfigItem label="Nome da Loja" chave="nome_loja" value={configs['nome_loja']} onChange={handleChange} onSave={handleSave} icon={<Settings className="w-4 h-4" />} />
            <ConfigItem label="WhatsApp Suporte" chave="whatsapp_suporte" value={configs['whatsapp_suporte']} onChange={handleChange} onSave={handleSave} icon={<Phone className="w-4 h-4" />} />
            <ConfigItem label="E-mail Contato" chave="email_contato" value={configs['email_contato']} onChange={handleChange} onSave={handleSave} icon={<Mail className="w-4 h-4" />} type="email" />
          </div>
        </section>

        {/* Redes Sociais */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 rounded-lg">
              <Share2 className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Redes Sociais</h3>
          </div>
          
          <div className="space-y-4">
            <ConfigItem label="Instagram URL" chave="instagram_url" value={configs['instagram_url']} onChange={handleChange} onSave={handleSave} icon={<Camera className="w-4 h-4" />} />
            <ConfigItem label="Facebook URL" chave="facebook_url" value={configs['facebook_url']} onChange={handleChange} onSave={handleSave} icon={<Globe className="w-4 h-4" />} />
            <ConfigItem label="TikTok URL" chave="tiktok_url" value={configs['tiktok_url']} onChange={handleChange} onSave={handleSave} icon={<Video className="w-4 h-4" />} />
            <ConfigItem label="Shopee Store URL" chave="shopee_url" value={configs['shopee_url']} onChange={handleChange} onSave={handleSave} icon={<ShoppingCart className="w-4 h-4" />} />
            <ConfigItem label="Mercado Livre URL" chave="mercadolivre_url" value={configs['mercadolivre_url']} onChange={handleChange} onSave={handleSave} icon={<ShoppingCart className="w-4 h-4" />} />
          </div>
        </section>

        {/* Financeiro */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Financeiro & Frete</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigItem label="Máximo de Parcelas" chave="parcelas_max" value={configs['parcelas_max']} onChange={handleChange} onSave={handleSave} icon={<CreditCard className="w-4 h-4" />} type="number" />
            <ConfigItem label="Parcelas Sem Juros" chave="parcelas_sem_juros" value={configs['parcelas_sem_juros']} onChange={handleChange} onSave={handleSave} icon={<CreditCard className="w-4 h-4" />} type="number" />
            <ConfigItem label="Frete Grátis Acima de (R$)" chave="frete_gratis_acima" value={configs['frete_gratis_acima']} onChange={handleChange} onSave={handleSave} icon={<Truck className="w-4 h-4" />} type="number" />
            <ConfigItem label="Desconto PIX (%)" chave="pix_desconto_percent" value={configs['pix_desconto_percent']} onChange={handleChange} onSave={handleSave} icon={<Percent className="w-4 h-4" />} type="number" />
          </div>
        </section>

        {/* Categorias na Home */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ListChecks className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Catálogo por Categoria na Home</h3>
              <p className="text-xs text-slate-500 font-medium italic">Selecione quais categorias devem aparecer como vitrines na página inicial.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadingCats ? (
              <div className="col-span-full py-4 text-center text-slate-400">Carregando categorias...</div>
            ) : availableCategories.length === 0 ? (
              <div className="col-span-full py-4 text-center text-slate-400 italic">Nenhuma categoria encontrada nos produtos ativos.</div>
            ) : (
              availableCategories.map((cat) => {
                const isActive = activeHomeCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategoryHome(cat)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                      isActive 
                        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-600'}`}>{cat}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ConfigItem({ label, chave, value, onChange, onSave, icon, type = "text" }: any) {
  return (
    <div>
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
          <input 
            type={type} 
            value={value || ''} 
            onChange={(e) => onChange(chave, e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-brand-100 focus:bg-white transition-all text-sm font-bold text-slate-700" 
          />
        </div>
        <button 
          onClick={() => onSave(chave)} 
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center group"
        >
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
