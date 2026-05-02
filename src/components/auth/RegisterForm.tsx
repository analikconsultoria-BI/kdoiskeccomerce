"use client"

import { useState, useEffect } from 'react'
import { registerAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { supabase } from '@/lib/supabase'

// Setup zxcvbn options
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
}
zxcvbnOptions.setOptions(options)

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [password, setPassword] = useState('')
  const [score, setScore] = useState(0)
  
  // Mascaras simples (na submissão o Zod sanitiza)
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password)
      setScore(result.score) // 0 to 4
    } else {
      setScore(0)
    }
  }, [password])

  const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    setCpf(value)
  }

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length > 2) {
      value = `(${value.slice(0,2)}) ${value.slice(2)}`
    }
    if (value.length > 9) {
      value = `${value.slice(0,10)}-${value.slice(10)}`
    }
    setTelefone(value)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setSuccess('')
    
    // Substituir valores formatados pelos puros antes de enviar, ou deixar o backend limpar
    // O backend já faz .replace(/\D/g, '') no telefone. CPF precisa estar válido.
    formData.set('cpf', cpf.replace(/\D/g, ''))

    try {
      const result = await registerAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.message || 'Cadastro realizado com sucesso!')
        // setTimeout(() => window.location.href = '/entrar', 3000)
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600']
  const strengthLabels = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte']

  if (success) {
    return (
      <div className="text-center p-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-warm-900 mb-2">Conta Criada!</h3>
        <p className="text-warm-600 mb-6">{success}</p>
        <Link href="/entrar" className="inline-block px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700">
          Fazer Login
        </Link>
      </div>
    )
  }

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

    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Nome Completo</label>
        <input type="text" name="nome" required 
          className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Email</label>
        <input type="email" name="email" required 
          className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">CPF</label>
          <input type="text" name="cpf" required value={cpf} onChange={handleCpf} placeholder="000.000.000-00"
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-warm-900 mb-1">Telefone / WhatsApp</label>
          <input type="text" name="telefone" required value={telefone} onChange={handleTelefone} placeholder="(00) 00000-0000"
            className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Senha</label>
        <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
        
        {password && (
          <div className="mt-2">
            <div className="flex gap-1 h-1.5 mb-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 rounded-full ${i <= score ? strengthColors[score] : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className={`text-xs font-medium ${score < 3 ? 'text-red-500' : 'text-green-600'}`}>
              Força da senha: {strengthLabels[score]}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-warm-900 mb-1">Confirmar Senha</label>
        <input type="password" name="confirmPassword" required 
          className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input type="checkbox" name="aceiteTermos" id="aceite" required className="mt-1 w-4 h-4 text-brand-600 rounded" />
        <label htmlFor="aceite" className="text-xs text-warm-600">
          Li e aceito os <Link href="/termos" className="text-brand-600 hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-brand-600 hover:underline">Política de Privacidade</Link>.
        </label>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta'}
      </button>

      <div className="text-center mt-4">
        <p className="text-warm-600 text-sm">
          Já tem uma conta? <Link href="/entrar" className="text-brand-600 font-bold hover:text-brand-800">Entrar</Link>
        </p>
      </div>
    </form>
    </>
  )
}
