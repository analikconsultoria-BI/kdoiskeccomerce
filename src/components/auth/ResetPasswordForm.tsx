"use client"

import { useState } from 'react'
import { resetPasswordAction } from '@/app/actions/auth'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    try {
      const result = await resetPasswordAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess('Sua senha foi redefinida com sucesso!')
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-warm-700 font-bold mb-4">{success}</p>
        <Link href="/entrar" className="inline-block px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700">
          Ir para Login
        </Link>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Nova Senha</label>
        <input type="password" name="password" required 
          className="w-full px-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        <p className="text-xs text-warm-500 mt-1">Mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 especial.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Confirmar Nova Senha</label>
        <input type="password" name="confirmPassword" required 
          className="w-full px-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Redefinir Senha'}
      </button>
    </form>
  )
}
