"use client"

import { useState } from 'react'
import { forgotPasswordAction } from '@/app/actions/auth'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    try {
      const result = await forgotPasswordAction(formData)
      if (result?.success) {
        setSuccess(result.message || 'Link de recuperação enviado.')
      }
    } catch (err) {
      // Ignorar erros na UI por segurança
      setSuccess('Se o email existir em nossa base, um link de recuperação foi enviado.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-warm-700">{success}</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Seu Email</label>
        <input type="email" name="email" required placeholder="Digite o email cadastrado"
          className="w-full px-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-warm-400" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Link de Recuperação'}
      </button>
    </form>
  )
}
