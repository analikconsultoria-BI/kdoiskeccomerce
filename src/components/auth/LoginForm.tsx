"use client"

import { useState } from 'react'
import { loginAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

import { supabase } from '@/lib/supabase'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setError('Erro ao conectar com o Google.')
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    try {
      const result = await loginAction(formData)
      if (result && 'error' in result && result.error) {
        setError(result.error)
      } else {
        // Redirecionamento é tratado no middleware ou server action
        window.location.href = '/minha-conta'
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-brand-200 rounded-xl h-12 font-bold text-warm-700 hover:bg-brand-50 transition-all mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar com Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-brand-200" />
        <span className="text-xs text-warm-500 font-bold uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-brand-200" />
      </div>

      <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-2">Email</label>
        <input 
          type="email" 
          name="email"
          required 
          placeholder="seu@email.com"
          className="w-full px-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-warm-400"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-warm-900">Senha</label>
          <Link href="/esqueci-senha" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
            Esqueci minha senha
          </Link>
        </div>
        <input 
          type="password" 
          name="password"
          required 
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-warm-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          name="remember" 
          id="remember"
          className="w-4 h-4 text-brand-600 rounded border-brand-300 focus:ring-brand-500" 
        />
        <label htmlFor="remember" className="text-sm text-warm-700">Lembrar-me</label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
      </button>

      <div className="text-center mt-6">
        <p className="text-warm-600 text-sm">
          Ainda não tem conta?{' '}
          <Link href="/cadastrar" className="text-brand-600 font-bold hover:text-brand-800">
            Criar conta
          </Link>
        </p>
      </div>
    </form>
    </>
  )
}
