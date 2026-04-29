"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Hash, Save, X, Layout, Tag, Pencil } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [filterLocal, setFilterLocal] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingBanner, setEditingBanner] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    imagem_url: '',
    link: '',
    ordem: 0,
    ativo: true,
    local: 'home'
  });

  const fetchBanners = async () => {
    setLoading(true);
    const { data: bannerData } = await supabase.from('banners').select('*').order('ordem');
    if (bannerData) setBanners(bannerData);

    // Buscar categorias únicas dos produtos cadastrados
    const { data: prodData } = await supabase.from('produtos_config').select('categoria_customizada');
    if (prodData) {
      const cats = Array.from(new Set(prodData.map(p => p.categoria_customizada).filter(Boolean))) as string[];
      setCategorias(cats);
    }

    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchBanners();
  }, []);

  if (!mounted) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processUpload(file);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processUpload(file);
  };

  const processUpload = async (file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      setMessage({ text: 'Erro no upload: ' + uploadError.message, type: 'error' });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(filePath);
      setFormData({ ...formData, imagem_url: publicUrl });
      setMessage({ text: 'Imagem carregada com sucesso!', type: 'success' });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!formData.imagem_url) {
      setMessage({ text: 'A imagem é obrigatória.', type: 'error' });
      return;
    }

    if (editingBanner) {
      const { error } = await supabase.from('banners').update(formData).eq('id', editingBanner);
      if (error) {
        setMessage({ text: 'Erro ao atualizar: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'Banner atualizado!', type: 'success' });
        closeModal();
        fetchBanners();
      }
    } else {
      const { error } = await supabase.from('banners').insert([formData]);
      if (error) {
        setMessage({ text: 'Erro ao salvar: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'Banner adicionado!', type: 'success' });
        closeModal();
        fetchBanners();
      }
    }
  };

  const openEditModal = (banner: any) => {
    setEditingBanner(banner.id);
    setFormData({
      imagem_url: banner.imagem_url,
      link: banner.link,
      ordem: banner.ordem,
      ativo: banner.ativo,
      local: banner.local || 'home'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ imagem_url: '', link: '', ordem: 0, ativo: true, local: 'home' });
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('banners').update({ ativo: !currentStatus }).eq('id', id);
    if (!error) {
      setBanners(banners.map(b => b.id === id ? { ...b, ativo: !currentStatus } : b));
      setMessage({ text: 'Status atualizado.', type: 'success' });
    }
  };

  const deleteBanner = async (id: number) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) {
      setBanners(banners.filter(b => b.id !== id));
      setMessage({ text: 'Banner removido.', type: 'success' });
      setConfirmDelete(null);
    }
  };

  const filteredBanners = filterLocal === 'all' 
    ? banners 
    : banners.filter(b => b.local === filterLocal);

  return (
    <div className="max-w-6xl pb-12">
      {message && <Toast message={message.text} type={message.type} onClose={() => setMessage(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gerenciamento de Banners</h2>
          <p className="text-slate-500 font-medium">Configure banners para a Home ou Categorias específicas.</p>
        </div>
        <button 
          onClick={() => {
            setEditingBanner(null);
            setFormData({ imagem_url: '', link: '', ordem: 0, ativo: true, local: 'home' });
            setShowModal(true);
          }}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-700 font-bold shadow-lg shadow-brand-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Novo Banner
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <button 
          onClick={() => setFilterLocal('all')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filterLocal === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFilterLocal('home')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filterLocal === 'home' ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
        >
          Home
        </button>
        {categorias.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilterLocal(cat)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterLocal === cat ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Carregando banners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map(banner => (
            <div key={banner.id} className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all ${!banner.ativo ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <div className="aspect-video relative group">
                <img src={banner.imagem_url} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => toggleStatus(banner.id, banner.ativo)} className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                    {banner.ativo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button onClick={() => openEditModal(banner)} className="p-3 bg-white rounded-full text-brand-600 hover:scale-110 transition-transform">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => setConfirmDelete(banner.id)} className="p-3 bg-white rounded-full text-red-600 hover:scale-110 transition-transform">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  {!banner.ativo && (
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Inativo</div>
                  )}
                  <div className="bg-brand-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {banner.local === 'home' ? 'Home' : banner.local}
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">Ordem: {banner.ordem}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-2 rounded-lg truncate">
                  <LinkIcon className="w-3 h-3" /> {banner.link || 'Sem link de destino'}
                </div>
              </div>
            </div>
          ))}

          {filteredBanners.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-medium">
              Nenhum banner encontrado para este local.
            </div>
          )}
        </div>
      )}

      {/* Modal Novo Banner */}
      {showModal && (
        <div className="fixed inset-0 z-110 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Onde exibir o banner?</label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      value={formData.local} 
                      onChange={e => setFormData({...formData, local: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="home">Página Inicial (Home)</option>
                      <optgroup label="Categorias">
                        {categorias.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Imagem do Banner</label>
                  
                  {formData.imagem_url ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 mb-4 group">
                      <img src={formData.imagem_url} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setFormData({...formData, imagem_url: ''})}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${isDragging ? 'bg-brand-50 border-brand-500 scale-[1.02]' : 'border-slate-200 hover:bg-slate-50 hover:border-brand-300'}`}
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                          <span className="text-xs font-bold text-slate-400">Enviando...</span>
                        </div>
                      ) : (
                        <>
                          <div className={`p-4 rounded-2xl transition-all ${isDragging ? 'bg-brand-100 scale-110' : 'bg-slate-100 group-hover:scale-110'}`}>
                            <Plus className={`w-6 h-6 ${isDragging ? 'text-brand-600' : 'text-slate-400'}`} />
                          </div>
                          <span className={`mt-3 text-xs font-bold uppercase tracking-widest ${isDragging ? 'text-brand-600' : 'text-slate-400'}`}>
                            {isDragging ? 'Solte para Upload' : 'Arraste ou Clique para Upload'}
                          </span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                  )}

                  <div className="relative mt-2">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.imagem_url} 
                      onChange={e => setFormData({...formData, imagem_url: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" 
                      placeholder="Ou cole uma URL externa aqui..." 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Link de Destino</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ex: /loja?categoria=promo" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ordem de Exibição</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" value={formData.ordem} onChange={e => setFormData({...formData, ordem: parseInt(e.target.value) || 0})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4">
              <button onClick={closeModal} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all active:scale-95">
                {editingBanner ? 'Salvar Alterações' : 'Criar Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmDelete !== null}
        title="Excluir Banner"
        message="Tem certeza que deseja remover este banner? Esta ação não pode ser desfeita."
        onConfirm={() => confirmDelete && deleteBanner(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Excluir"
      />
    </div>
  );
}
