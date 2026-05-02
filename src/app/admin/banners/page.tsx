"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Hash, Save, X, Layout, Tag, Pencil, Upload, Smartphone, Monitor } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Image from 'next/image';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [filterLocal, setFilterLocal] = useState('all');
  const [uploadingField, setUploadingField] = useState<'desktop' | 'mobile' | 'card' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingBanner, setEditingBanner] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem_desktop_url: '',
    imagem_mobile_url: '',
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

  const processUpload = async (file: File, type: 'desktop' | 'mobile' | 'card') => {
    setUploadingField(type);
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    // Upload para o bucket 'banners'
    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file);

    if (uploadError) {
      setMessage({ text: 'Erro no upload: ' + uploadError.message, type: 'error' });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(filePath);
      if (type === 'desktop') {
        setFormData(prev => ({ ...prev, imagem_desktop_url: publicUrl }));
      } else if (type === 'mobile') {
        setFormData(prev => ({ ...prev, imagem_mobile_url: publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, imagem_url: publicUrl }));
      }
      setMessage({ text: `Imagem ${type === 'card' ? 'do card' : type} carregada com sucesso!`, type: 'success' });
    }
    setUploadingField(null);
  };

  const handleSave = async () => {
    if (!formData.imagem_desktop_url) {
      setMessage({ text: 'A imagem desktop é obrigatória.', type: 'error' });
      return;
    }

    const payload = {
      ...formData
    };

    if (editingBanner) {
      const { error } = await supabase.from('banners').update(payload).eq('id', editingBanner);
      if (error) {
        setMessage({ text: 'Erro ao atualizar: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'Banner atualizado!', type: 'success' });
        closeModal();
        fetchBanners();
      }
    } else {
      const { error } = await supabase.from('banners').insert([payload]);
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
      titulo: banner.titulo || '',
      subtitulo: banner.subtitulo || '',
      imagem_desktop_url: banner.imagem_desktop_url || '',
      imagem_mobile_url: banner.imagem_mobile_url || '',
      imagem_url: banner.imagem_url || '',
      link: banner.link || '',
      ordem: banner.ordem || 0,
      ativo: banner.ativo ?? true,
      local: banner.local || 'home'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ 
      titulo: '',
      subtitulo: '',
      imagem_desktop_url: '', 
      imagem_mobile_url: '',
      imagem_url: '',
      link: '', 
      ordem: 0, 
      ativo: true, 
      local: 'home' 
    });
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
          <p className="text-slate-500 font-medium">Configure banners responsivos para a Home ou Categorias.</p>
        </div>
        <button 
          onClick={() => {
            setEditingBanner(null);
            setFormData({ 
              titulo: '',
              subtitulo: '',
              imagem_desktop_url: '', 
              imagem_mobile_url: '',
              imagem_url: '',
              link: '', 
              ordem: 0, 
              ativo: true, 
              local: 'home' 
            });
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
                <Image 
                  src={banner.imagem_desktop_url || banner.imagem_url || 'https://placehold.co/1920x600/f9f9f9/cccccc?text=Sem+Imagem'} 
                  alt={banner.titulo || "Banner"} 
                  fill
                  className="object-cover"
                  unoptimized={!banner.imagem_desktop_url && !banner.imagem_url}
                />
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
                <h4 className="font-bold text-slate-800 mb-1 truncate">{banner.titulo || 'Banner sem título'}</h4>
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título do Banner (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="Título principal do banner"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subtítulo (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.subtitulo} 
                    onChange={e => setFormData({...formData, subtitulo: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    placeholder="Texto complementar"
                  />
                </div>

                {/* Upload Card (Principal) */}
                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center justify-between text-xs font-black text-brand-600 uppercase tracking-widest ml-1">
                    <span className="flex items-center gap-2"><Tag className="w-3 h-3" /> Imagem do Card (Grade da Home)</span>
                    <span className="text-brand-400 font-bold">600 x 400 px</span>
                  </label>
                  
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-dashed border-brand-100 bg-brand-50/30 group hover:border-brand-300 transition-all">
                    {formData.imagem_url ? (
                      <>
                        <Image src={formData.imagem_url} alt="Card Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setFormData({...formData, imagem_url: ''})}
                            className="bg-white text-red-600 p-2 rounded-xl shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                        {uploadingField === 'card' ? (
                          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-brand-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">600x400px (Proporção Card)</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processUpload(e.target.files[0], 'card')} disabled={!!uploadingField} />
                      </label>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium px-1">Esta imagem será usada na grade de categorias da página inicial.</p>
                </div>

                {/* Upload Desktop */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                    <span className="flex items-center gap-2"><Monitor className="w-3 h-3" /> Banner Desktop (Loja)</span>
                    <span className="text-slate-400 font-bold">1920 x 450 px</span>
                  </label>
                  
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group hover:border-brand-300 transition-all">
                    {formData.imagem_desktop_url ? (
                      <>
                        <Image src={formData.imagem_desktop_url} alt="Desktop Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setFormData({...formData, imagem_desktop_url: ''})}
                            className="bg-white text-red-600 p-2 rounded-xl shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                        {uploadingField === 'desktop' ? (
                          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1920x600px</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processUpload(e.target.files[0], 'desktop')} disabled={!!uploadingField} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Upload Mobile */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                    <span className="flex items-center gap-2"><Smartphone className="w-3 h-3" /> Banner Mobile (Loja)</span>
                    <span className="text-slate-400 font-bold">768 x 400 px</span>
                  </label>
                  
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group hover:border-brand-300 transition-all">
                    {formData.imagem_mobile_url ? (
                      <>
                        <Image src={formData.imagem_mobile_url} alt="Mobile Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setFormData({...formData, imagem_mobile_url: ''})}
                            className="bg-white text-red-600 p-2 rounded-xl shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                        {uploadingField === 'mobile' ? (
                          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">768x400px</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processUpload(e.target.files[0], 'mobile')} disabled={!!uploadingField} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Link de Destino</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ex: /loja?categoria=promo" />
                  </div>
                </div>

                <div className="md:col-span-2">
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
