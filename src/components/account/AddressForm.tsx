"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function AddressForm() {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: '',
    nome: 'Casa' // Ex: Casa, Trabalho
  })

  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    let cep = e.target.value.replace(/\D/g, '')
    if (cep.length > 8) cep = cep.slice(0, 8)
    
    setAddress(prev => ({ ...prev, cep: cep.replace(/^(\d{5})(\d)/, "$1-$2") }))

    if (cep.length === 8) {
      setLoading(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Ação para salvar no banco usando supabase (Server Action ou API)
    alert("Salvar Endereço (Implementação da Action aqui)")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Nome (Ex: Casa)</label>
          <input type="text" required value={address.nome} onChange={e => setAddress({...address, nome: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">CEP</label>
          <div className="relative">
            <input type="text" required value={address.cep} onChange={handleCepChange} placeholder="00000-000"
              className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
            {loading && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-brand-500" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warm-900 mb-1">Logradouro</label>
          <input type="text" required value={address.logradouro} onChange={e => setAddress({...address, logradouro: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Número</label>
          <input type="text" required value={address.numero} onChange={e => setAddress({...address, numero: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Complemento</label>
          <input type="text" value={address.complemento} onChange={e => setAddress({...address, complemento: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Bairro</label>
          <input type="text" required value={address.bairro} onChange={e => setAddress({...address, bairro: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Cidade</label>
          <input type="text" required value={address.cidade} onChange={e => setAddress({...address, cidade: e.target.value})}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Estado</label>
          <input type="text" required value={address.estado} onChange={e => setAddress({...address, estado: e.target.value})} maxLength={2}
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
      </div>

      <button type="submit" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors">
        Salvar Endereço
      </button>
    </form>
  )
}
