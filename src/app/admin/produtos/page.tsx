"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Search, Edit, Package, XCircle, Timer, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Filters
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState('');
  
  // Sync UI
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const fetchProdutos = async () => {
    setLoading(true);
    let query = supabase.from('produtos_config').select('*').order('created_at', { ascending: false });
    const { data } = await query;
    if (data) {
      setProdutos(data);
      setStats({
        total: data.length,
        ativos: data.filter(p => p.ativo).length,
        inativos: data.filter(p => !p.ativo).length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSync = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setSyncing(true);
    setShowSyncModal(true);

    try {
      const res = await fetch('/api/bling/sync', { 
        method: 'POST',
        signal: controller.signal 
      });
      const result = await res.json();
      
      if (res.ok) {
        setMessage({ text: `Sucesso! ${result.synced} produtos sincronizados.`, type: 'success' });
        fetchProdutos();
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        setMessage({ text: 'Sincronização cancelada pelo usuário.', type: 'error' });
      } else {
        setMessage({ text: 'Erro na sincronização: ' + e.message, type: 'error' });
      }
    } finally {
      setSyncing(false);
      setShowSyncModal(false);
      setAbortController(null);
    }
  };

  const cancelSync = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const updateConfig = async (ids: string | string[], field: string, value: any) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const { error } = await supabase.from('produtos_config').update({ [field]: value }).in('id', idsArray);
    
    if (!error) {
      const newProdutos = produtos.map(p => idsArray.includes(p.id) ? { ...p, [field]: value } : p);
      setProdutos(newProdutos);
      setStats({
        total: newProdutos.length,
        ativos: newProdutos.filter(p => p.ativo).length,
        inativos: newProdutos.filter(p => !p.ativo).length,
      });
      setMessage({ text: `${idsArray.length} produto(s) atualizado(s).`, type: 'success' });
      if (Array.isArray(ids)) setSelectedIds([]);
    } else {
      setMessage({ text: 'Erro ao atualizar produtos.', type: 'error' });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProdutos.length) setSelectedIds([]);
    else setSelectedIds(filteredProdutos.map(p => p.id));
  };

  // Filter Logic
  const filteredProdutos = produtos.filter(p => {
    const matchBusca = p.nome_customizado?.toLowerCase().includes(busca.toLowerCase()) || 
                       p.nome_bling?.toLowerCase().includes(busca.toLowerCase()) ||
                       p.bling_id.includes(busca);
    const matchAtivo = filtroAtivo === 'todos' ? true : 
                       filtroAtivo === 'ativos' ? p.ativo : !p.ativo;
    return matchBusca && matchAtivo;
  });

  return (
    <div className="relative">
      {/* Syncing Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-110 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">Sincronizando Catálogo</h3>
            <p className="text-slate-500 font-medium mb-8">
              Estamos buscando seus produtos e estoques no Bling de forma segura para não travar a API.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Timer className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ritmo de Segurança</div>
                <div className="text-sm font-black text-slate-700">~3 produtos por segundo</div>
              </div>
            </div>

            <button 
              onClick={cancelSync}
              className="w-full py-4 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar Operação
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {message && (
        <Toast 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}

      {/* Floating Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8">
          <div className="text-sm font-bold border-r border-slate-700 pr-6">
            <span className="text-brand-400">{selectedIds.length}</span> selecionados
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => updateConfig(selectedIds, 'ativo', true)} className="hover:text-green-400 font-bold text-sm">Ativar</button>
            <button onClick={() => updateConfig(selectedIds, 'ativo', false)} className="hover:text-red-400 font-bold text-sm">Desativar</button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
            <input 
              type="text" 
              placeholder="Nova Categoria..." 
              value={bulkCategory}
              onChange={e => setBulkCategory(e.target.value)}
              className="bg-slate-800 border-none rounded-lg px-3 py-1 text-xs focus:ring-1 ring-brand-500"
            />
            <button 
              onClick={() => {
                if (bulkCategory) {
                  updateConfig(selectedIds, 'categoria_customizada', bulkCategory);
                  setBulkCategory('');
                }
              }} 
              className="bg-brand-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-brand-700"
            >
              Aplicar
            </button>
          </div>

          <button onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-white ml-4">
            <Package className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Produtos</h2>
          <p className="text-slate-500 font-medium">Gerencie seu catálogo sincronizado do Bling.</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-700 disabled:opacity-50 font-bold shadow-lg shadow-brand-200 transition-all active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} /> 
          {syncing ? 'Sincronizando...' : 'Sincronizar com Bling'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 rounded-xl">
              <Package className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.total}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total de Itens</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.ativos}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Ativos no Site</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <XCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.inativos}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider text-[10px]">Inativos / Ocultos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou ID..." 
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select 
          value={filtroAtivo} 
          onChange={e => setFiltroAtivo(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="todos">Todos</option>
          <option value="ativos">Apenas Ativos</option>
          <option value="inativos">Apenas Inativos</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-brand-600" 
                    checked={selectedIds.length === filteredProdutos.length && filteredProdutos.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 font-medium text-gray-600">ID (Bling)</th>
                <th className="p-4 font-medium text-gray-600">Produto</th>
                <th className="p-4 font-medium text-gray-600">Preço Atual</th>
                <th className="p-4 font-medium text-gray-600 text-center">Estoque</th>
                <th className="p-4 font-medium text-gray-600">Ativo na Loja</th>
                <th className="p-4 font-medium text-gray-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProdutos.map(p => {
                const isIndisponivel = p.estoque_bling <= 0;
                const rowOpacity = (!p.ativo || isIndisponivel) ? 'bg-slate-50/80 grayscale-[0.5] opacity-75' : '';

                return (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition-all ${selectedIds.includes(p.id) ? 'bg-brand-50/30' : ''} ${rowOpacity}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600" 
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-400">{p.bling_id}</td>
                    <td className="p-4">
                      <div className={`font-bold ${!p.ativo || isIndisponivel ? 'text-slate-500' : 'text-slate-900'}`}>
                        {p.nome_customizado || p.nome_bling || 'Sem nome'}
                      </div>
                      <div className="text-[10px] text-brand-600 font-black uppercase tracking-widest">{p.categoria_customizada || 'Sem categoria'}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      R$ {Number(p.preco_promocional || p.preco_bling || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.estoque_bling > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.estoque_bling > 0 ? p.estoque_bling : 'Esgotado'}
                      </span>
                    </td>
                    <td className="p-4">
                      <label className={`relative inline-flex items-center ${isIndisponivel ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`} title={isIndisponivel ? 'Sem estoque disponível' : ''}>
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={p.ativo && !isIndisponivel}
                          disabled={isIndisponivel}
                          onChange={(e) => updateConfig(p.id, 'ativo', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </td>
                    <td className="p-4 text-center">
                      <Link href={`/admin/produtos/${p.bling_id}`} className="inline-flex items-center gap-2 text-xs text-brand-700 hover:text-brand-900 bg-brand-100/50 hover:bg-brand-100 px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all">
                        <Edit className="w-3.5 h-3.5" /> Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredProdutos.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-8 text-center text-gray-500">Carregando produtos...</div>}
      </div>
    </div>
  );
}
