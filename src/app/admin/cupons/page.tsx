"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Ticket, Tag, DollarSign, Percent, Calendar, UserCheck, X, CheckCircle, XCircle } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminCupons() {
  const [cupons, setCupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'percentual',
    valor: 0,
    valor_minimo_pedido: 0,
    usos_maximos: 100,
    ativo: true,
    expira_em: ''
  });

  const fetchCupons = async () => {
    setLoading(true);
    const { data } = await supabase.from('cupons').select('*').order('created_at', { ascending: false });
    if (data) setCupons(data);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchCupons();
  }, []);

  if (!mounted) return null;

  const handleSave = async () => {
    if (!formData.codigo || !formData.valor) {
      setMessage({ text: 'Código e Valor são obrigatórios.', type: 'error' });
      return;
    }

    // Limpar data vazia para evitar erro de sintaxe no Postgres
    const cleanData = {
      ...formData,
      expira_em: formData.expira_em === '' ? null : formData.expira_em
    };

    const { error } = await supabase.from('cupons').insert([cleanData]);
    
    if (error) {
      setMessage({ text: 'Erro ao salvar cupom: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Cupom criado com sucesso!', type: 'success' });
      setShowModal(false);
      setFormData({ codigo: '', tipo: 'percentual', valor: 0, valor_minimo_pedido: 0, usos_maximos: 100, ativo: true, expira_em: '' });
      fetchCupons();
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('cupons').update({ ativo: !currentStatus }).eq('id', id);
    if (!error) {
      setCupons(cupons.map(c => c.id === id ? { ...c, ativo: !currentStatus } : c));
      setMessage({ text: 'Status do cupom atualizado.', type: 'success' });
    }
  };

  const deleteCupom = async (id: number) => {
    const { error } = await supabase.from('cupons').delete().eq('id', id);
    if (!error) {
      setCupons(cupons.filter(c => c.id !== id));
      setMessage({ text: 'Cupom removido.', type: 'success' });
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-6xl pb-12">
      {message && <Toast message={message.text} type={message.type} onClose={() => setMessage(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cupons de Desconto</h2>
          <p className="text-slate-500 font-medium">Crie regras de desconto para atrair e fidelizar clientes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-700 font-bold shadow-lg shadow-brand-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Novo Cupom
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Carregando cupons...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Código</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Regras</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Uso</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cupons.map(cupom => (
                <tr key={cupom.id} className={`hover:bg-slate-50/50 transition-colors ${!cupom.ativo ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-50 rounded-lg">
                        <Ticket className="w-4 h-4 text-brand-600" />
                      </div>
                      <span className="font-black text-slate-900 tracking-wider">{cupom.codigo}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      {cupom.tipo === 'percentual' ? (
                        <span className="flex items-center gap-1"><Percent className="w-4 h-4 text-brand-500" /> {cupom.valor}%</span>
                      ) : (
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-green-500" /> R$ {Number(cupom.valor).toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs space-y-1">
                      <div className="text-slate-500 font-medium">Mínimo: R$ {Number(cupom.valor_minimo_pedido).toFixed(2)}</div>
                      {cupom.expira_em && (
                        <div className="text-red-400 flex items-center gap-1 font-bold">
                          <Calendar className="w-3 h-3" /> Expira em: {new Date(cupom.expira_em).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-600">{cupom.usos_atual} / {cupom.usos_maximos || '∞'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => toggleStatus(cupom.id, cupom.ativo)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cupom.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {cupom.ativo ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {cupom.ativo ? 'Ativo' : 'Pausado'}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => setConfirmDelete(cupom.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cupons.length === 0 && (
            <div className="p-16 text-center text-slate-400 font-medium">
              Nenhum cupom de desconto criado ainda.
            </div>
          )}
        </div>
      )}

      {/* Modal Novo Cupom */}
      {showModal && (
        <div className="fixed inset-0 z-110 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Novo Cupom</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Código do Cupom</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value.toUpperCase()})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black tracking-wider" placeholder="EX: BEMVINDO10" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Desconto</label>
                  <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                    <option value="percentual">Percentual (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Valor do Desconto</label>
                  <input type="number" value={formData.valor} onChange={e => setFormData({...formData, valor: parseFloat(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Valor Mínimo Pedido</label>
                  <input type="number" value={formData.valor_minimo_pedido} onChange={e => setFormData({...formData, valor_minimo_pedido: parseFloat(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Máximo de Usos</label>
                  <input type="number" value={formData.usos_maximos} onChange={e => setFormData({...formData, usos_maximos: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expira em (Opcional)</label>
                  <input type="date" value={formData.expira_em} onChange={e => setFormData({...formData, expira_em: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all active:scale-95">Criar Cupom</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmDelete !== null}
        title="Excluir Cupom"
        message="Tem certeza que deseja remover este cupom de desconto permanentemente?"
        onConfirm={() => confirmDelete && deleteCupom(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Excluir"
      />
    </div>
  );
}
